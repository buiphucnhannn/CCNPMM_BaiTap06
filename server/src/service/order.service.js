import cartRepository from '../repository/cart.repository.js';
import orderRepository from '../repository/order.repository.js';
import Product from '../model/product.model.js';

class OrderService {
    getMinutesSince(date) {
        if (!date) return 0;
        return (Date.now() - new Date(date).getTime()) / (60 * 1000);
    }

    async autoConfirmOrders(userId) {
        const cutoffDate = new Date(Date.now() - 30 * 60 * 1000);
        await orderRepository.autoConfirmByUser(userId, cutoffDate);
    }
    getEffectivePrice(product) {
        if (!product) return 0;
        const salePrice = product.salePrice;
        if (salePrice && salePrice > 0 && salePrice < product.price) return salePrice;
        return product.price || 0;
    }

    buildOrderCode() {
        const now = new Date();
        const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
        return `ODR-${datePart}-${randomPart}`;
    }

    async createOrder(userId, shippingAddress, note = '') {
        const cart = await cartRepository.findByUserIdWithProducts(userId);
        if (!cart || cart.items.length === 0) {
            throw new Error('Giỏ hàng trống');
        }

        const orderItems = [];
        let subtotal = 0;

        for (const item of cart.items) {
            const product = item.product;
            if (!product || !product.isActive) {
                throw new Error('Sản phẩm không tồn tại hoặc đã ngừng bán');
            }

            const unitPrice = this.getEffectivePrice(product);
            const quantity = item.quantity;

            if (Array.isArray(product.sizes) && product.sizes.length > 0) {
                if (item.size === null || item.size === undefined) {
                    throw new Error('Vui lòng chọn size cho sản phẩm');
                }
                const sizeInfo = product.sizes.find((s) => Number(s.size) === Number(item.size));
                if (!sizeInfo) {
                    throw new Error('Size không tồn tại');
                }
                if (sizeInfo.stock < quantity) {
                    throw new Error(`Tồn kho không đủ cho size ${item.size}`);
                }
            }

            const lineTotal = unitPrice * quantity;
            subtotal += lineTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                brand: product.brand,
                image: product.images?.[0] || '',
                size: item.size ?? null,
                quantity,
                unitPrice,
                lineTotal
            });
        }

        for (const item of orderItems) {
            const update = { $inc: { soldCount: item.quantity } };
            if (item.size !== null && item.size !== undefined) {
                const updateResult = await Product.updateOne(
                    { _id: item.product, 'sizes.size': item.size },
                    { ...update, $inc: { ...update.$inc, 'sizes.$[sizeElem].stock': -item.quantity } },
                    { arrayFilters: [{ 'sizeElem.size': item.size, 'sizeElem.stock': { $gte: item.quantity } }] }
                );

                if (updateResult.modifiedCount === 0) {
                    throw new Error(`Không đủ tồn kho cho size ${item.size}`);
                }
            } else {
                await Product.updateOne({ _id: item.product }, update);
            }
        }

        const shippingFee = 0;
        const total = subtotal + shippingFee;

        const orderData = {
            user: userId,
            orderCode: this.buildOrderCode(),
            items: orderItems,
            subtotal,
            shippingFee,
            total,
            paymentMethod: 'COD',
            status: 'pending',
            confirmedAt: null,
            shippingAddress,
            note
        };

        const order = await orderRepository.create(orderData);

        cart.items = [];
        await cartRepository.save(cart);

        return order;
    }

    async getOrdersByUser(userId) {
        await this.autoConfirmOrders(userId);
        return await orderRepository.findByUserId(userId);
    }

    async getOrderById(userId, orderId) {
        await this.autoConfirmOrders(userId);
        const order = await orderRepository.findByIdForUser(orderId, userId);
        if (!order) throw new Error('Đơn hàng không tồn tại');
        return order;
    }

    async cancelOrder(userId, orderId) {
        const order = await orderRepository.findByIdForUser(orderId, userId);
        if (!order) throw new Error('Đơn hàng không tồn tại');

        const minutesSinceCreated = this.getMinutesSince(order.createdAt);
        if (minutesSinceCreated > 30) {
            throw new Error('Đơn hàng đã quá 30 phút, không thể hủy');
        }

        if (order.status === 'pending' || order.status === 'confirmed') {
            return await orderRepository.updateForUser(orderId, userId, {
                status: 'cancelled',
                cancelledAt: new Date(),
            });
        }

        if (order.status === 'preparing') {
            return await orderRepository.updateForUser(orderId, userId, {
                status: 'cancel_requested',
                cancelRequestedAt: new Date(),
            });
        }

        if (order.status === 'cancelled' || order.status === 'cancel_requested') {
            throw new Error('Đơn hàng đã được hủy hoặc đang chờ hủy');
        }

        throw new Error('Đơn hàng đang ở trạng thái không thể hủy');
    }
}

export default new OrderService();
