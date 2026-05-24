import cartRepository from '../repository/cart.repository.js';
import productRepository from '../repository/product.repository.js';

class CartService {
    getEffectivePrice(product) {
        if (!product) return 0;
        const salePrice = product.salePrice;
        if (salePrice && salePrice > 0 && salePrice < product.price) return salePrice;
        return product.price || 0;
    }

    normalizeSize(product, sizeInput) {
        const sizes = Array.isArray(product.sizes) ? product.sizes : [];
        if (sizes.length === 0) {
            return { normalizedSize: null, maxStock: null };
        }

        if (sizeInput === undefined || sizeInput === null || sizeInput === '') {
            throw new Error('Vui lòng chọn size');
        }

        const parsedSize = Number(sizeInput);
        if (Number.isNaN(parsedSize)) {
            throw new Error('Size không hợp lệ');
        }

        const sizeInfo = sizes.find((s) => Number(s.size) === parsedSize);
        if (!sizeInfo) {
            throw new Error('Size không tồn tại');
        }
        if (sizeInfo.stock <= 0) {
            throw new Error('Size đã hết hàng');
        }

        return { normalizedSize: parsedSize, maxStock: sizeInfo.stock };
    }

    buildCartResponse(cart) {
        const items = (cart?.items || [])
            .map((item) => {
                const product = item.product;
                if (!product) return null;

                const unitPrice = this.getEffectivePrice(product);
                return {
                    _id: item._id,
                    product,
                    size: item.size,
                    quantity: item.quantity,
                    unitPrice,
                    lineTotal: unitPrice * item.quantity
                };
            })
            .filter(Boolean);

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.lineTotal, 0);

        return { items, totalItems, totalPrice };
    }

    removeUnavailableItems(cart) {
        const originalLength = cart.items.length;
        cart.items = cart.items.filter((item) => item.product && item.product.isActive !== false);
        return cart.items.length !== originalLength;
    }

    async getCart(userId) {
        let cart = await cartRepository.findByUserIdWithProducts(userId);
        if (!cart) {
            cart = await cartRepository.createForUser(userId);
            cart = await cartRepository.findByUserIdWithProducts(userId);
        }

        if (cart) {
            const changed = this.removeUnavailableItems(cart);
            if (changed) {
                await cartRepository.save(cart);
            }
        }

        return this.buildCartResponse(cart);
    }

    async addItem(userId, itemData) {
        const { productId, size, quantity } = itemData;
        const product = await productRepository.findById(productId);
        if (!product || !product.isActive) {
            throw new Error('Sản phẩm không tồn tại hoặc đã ngừng bán');
        }

        const safeQuantity = Math.max(parseInt(quantity, 10) || 1, 1);
        const { normalizedSize, maxStock } = this.normalizeSize(product, size);

        const cart = (await cartRepository.findByUserId(userId)) || await cartRepository.createForUser(userId);

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId && Number(item.size) === Number(normalizedSize)
        );

        const nextQuantity = (existingItem?.quantity || 0) + safeQuantity;

        if (maxStock !== null && nextQuantity > maxStock) {
            throw new Error(`Số lượng vượt quá tồn kho (${maxStock})`);
        }

        if (existingItem) {
            existingItem.quantity = nextQuantity;
        } else {
            cart.items.push({ product: productId, size: normalizedSize, quantity: safeQuantity });
        }

        await cartRepository.save(cart);
        const refreshed = await cartRepository.findByUserIdWithProducts(userId);
        return this.buildCartResponse(refreshed);
    }

    async updateItem(userId, itemId, quantity) {
        const cart = await cartRepository.findByUserId(userId);
        if (!cart) throw new Error('Giỏ hàng trống');

        const item = cart.items.id(itemId);
        if (!item) throw new Error('Sản phẩm không tồn tại trong giỏ');

        const safeQuantity = parseInt(quantity, 10);
        if (!safeQuantity || safeQuantity < 1) {
            throw new Error('Số lượng không hợp lệ');
        }

        const product = await productRepository.findById(item.product);
        if (!product || !product.isActive) {
            throw new Error('Sản phẩm không tồn tại hoặc đã ngừng bán');
        }

        if (Array.isArray(product.sizes) && product.sizes.length > 0) {
            const sizeInfo = product.sizes.find((s) => Number(s.size) === Number(item.size));
            if (!sizeInfo) {
                throw new Error('Size không tồn tại');
            }
            const sizeStock = sizeInfo.stock ?? 0;
            if (sizeStock <= 0) {
                throw new Error('Size đã hết hàng');
            }
            if (safeQuantity > sizeStock) {
                throw new Error(`Số lượng vượt quá tồn kho (${sizeStock})`);
            }
        }

        item.quantity = safeQuantity;
        await cartRepository.save(cart);

        const refreshed = await cartRepository.findByUserIdWithProducts(userId);
        return this.buildCartResponse(refreshed);
    }

    async removeItem(userId, itemId) {
        const cart = await cartRepository.findByUserId(userId);
        if (!cart) throw new Error('Giỏ hàng trống');

        const item = cart.items.id(itemId);
        if (!item) throw new Error('Sản phẩm không tồn tại trong giỏ');

        item.deleteOne();
        await cartRepository.save(cart);

        const refreshed = await cartRepository.findByUserIdWithProducts(userId);
        return this.buildCartResponse(refreshed);
    }

    async clearCart(userId) {
        const cart = await cartRepository.findByUserId(userId);
        if (!cart) return this.buildCartResponse(null);

        cart.items = [];
        await cartRepository.save(cart);

        const refreshed = await cartRepository.findByUserIdWithProducts(userId);
        return this.buildCartResponse(refreshed);
    }
}

export default new CartService();
