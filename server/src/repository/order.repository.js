import Order from '../model/order.model.js';

class OrderRepository {
    async create(orderData) {
        const order = new Order(orderData);
        return await order.save();
    }

    async findByUserId(userId) {
        return await Order.find({ user: userId }).sort({ createdAt: -1 });
    }

    async findByIdForUser(orderId, userId) {
        return await Order.findOne({ _id: orderId, user: userId });
    }

    async updateForUser(orderId, userId, updateData) {
        return await Order.findOneAndUpdate({ _id: orderId, user: userId }, updateData, { new: true });
    }

    async autoConfirmByUser(userId, cutoffDate) {
        return await Order.updateMany(
            { user: userId, status: 'pending', createdAt: { $lte: cutoffDate } },
            { status: 'confirmed', confirmedAt: new Date() }
        );
    }
}

export default new OrderRepository();
