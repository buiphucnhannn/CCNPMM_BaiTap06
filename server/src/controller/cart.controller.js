import cartService from '../service/cart.service.js';
import { validationResult } from 'express-validator';

class CartController {
    checkValidationErrors(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        return null;
    }

    async getCart(req, res) {
        try {
            const cart = await cartService.getCart(req.user.userId);
            res.status(200).json({ success: true, cart });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async addItem(req, res) {
        const validationError = this.checkValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            const cart = await cartService.addItem(req.user.userId, req.body);
            res.status(201).json({ success: true, message: 'Thêm vào giỏ hàng thành công', cart });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async updateItem(req, res) {
        const validationError = this.checkValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            const cart = await cartService.updateItem(req.user.userId, req.params.itemId, req.body.quantity);
            res.status(200).json({ success: true, message: 'Cập nhật giỏ hàng thành công', cart });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async removeItem(req, res) {
        try {
            const cart = await cartService.removeItem(req.user.userId, req.params.itemId);
            res.status(200).json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng', cart });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async clearCart(req, res) {
        try {
            const cart = await cartService.clearCart(req.user.userId);
            res.status(200).json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng', cart });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default new CartController();
