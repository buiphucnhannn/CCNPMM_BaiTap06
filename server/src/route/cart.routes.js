import express from 'express';
import cartController from '../controller/cart.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimit.middleware.js';
import { addCartItemValidation, updateCartItemValidation } from '../validation/cart.validation.js';

const router = express.Router();

router.get('/',
    authenticateToken,
    apiLimiter,
    cartController.getCart.bind(cartController)
);

router.post('/items',
    authenticateToken,
    apiLimiter,
    addCartItemValidation,
    cartController.addItem.bind(cartController)
);

router.patch('/items/:itemId',
    authenticateToken,
    apiLimiter,
    updateCartItemValidation,
    cartController.updateItem.bind(cartController)
);

router.delete('/items/:itemId',
    authenticateToken,
    apiLimiter,
    cartController.removeItem.bind(cartController)
);

router.delete('/',
    authenticateToken,
    apiLimiter,
    cartController.clearCart.bind(cartController)
);

export default router;
