import express from 'express';
import orderController from '../controller/order.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimit.middleware.js';
import { createOrderValidation } from '../validation/order.validation.js';

const router = express.Router();

router.post('/checkout',
    authenticateToken,
    apiLimiter,
    createOrderValidation,
    orderController.checkout.bind(orderController)
);

router.get('/my',
    authenticateToken,
    apiLimiter,
    orderController.getMyOrders.bind(orderController)
);

router.get('/:id',
    authenticateToken,
    apiLimiter,
    orderController.getOrderById.bind(orderController)
);

router.patch('/:id/cancel',
    authenticateToken,
    apiLimiter,
    orderController.cancelOrder.bind(orderController)
);

export default router;
