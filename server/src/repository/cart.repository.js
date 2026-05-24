import Cart from '../model/cart.model.js';

class CartRepository {
    async findByUserId(userId) {
        return await Cart.findOne({ user: userId });
    }

    async findByUserIdWithProducts(userId) {
        return await Cart.findOne({ user: userId }).populate('items.product', 'name brand price salePrice images sizes isActive');
    }

    async createForUser(userId) {
        const cart = new Cart({ user: userId, items: [] });
        return await cart.save();
    }

    async save(cart) {
        return await cart.save();
    }
}

export default new CartRepository();
