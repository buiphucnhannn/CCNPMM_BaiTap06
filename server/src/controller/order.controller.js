import orderService from '../service/order.service.js';
import { validationResult } from 'express-validator';

class OrderController {
    checkValidationErrors(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        return null;
    }

    async checkout(req, res) {
        const validationError = this.checkValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            const { fullName, phone, address, note } = req.body;
            const order = await orderService.createOrder(req.user.userId, { fullName, phone, address }, note);
            res.status(201).json({ success: true, message: 'Đặt hàng COD thành công', order });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getMyOrders(req, res) {
        try {
            const orders = await orderService.getOrdersByUser(req.user.userId);
            res.status(200).json({ success: true, orders });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await orderService.getOrderById(req.user.userId, req.params.id);
            res.status(200).json({ success: true, order });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    async cancelOrder(req, res) {
        try {
            const order = await orderService.cancelOrder(req.user.userId, req.params.id);
            res.status(200).json({ success: true, message: 'Cập nhật trạng thái hủy đơn thành công', order });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default new OrderController();
