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
}

export default new OrderRepository();
