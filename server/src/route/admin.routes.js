import express from 'express';
import authController from '../controller/auth.controller.js';
import productController from '../controller/product.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';
import { createProductValidation, updateProductValidation } from '../validation/product.validation.js';

const router = express.Router();

// ==================== ADMIN PROFILE ====================
// Pipeline: Authentication (Lớp 3) → Authorization admin (Lớp 4) → Controller
router.get('/profile',
    authenticateToken,
    authorizeRole('admin'),
    authController.getAdminProfile.bind(authController)
);

// ==================== ADMIN PRODUCT MANAGEMENT ====================
router.post('/products',
    authenticateToken,
    authorizeRole('admin'),
    createProductValidation,
    productController.createProduct.bind(productController)
);

router.put('/products/:id',
    authenticateToken,
    authorizeRole('admin'),
    updateProductValidation,
    productController.updateProduct.bind(productController)
);

router.delete('/products/:id',
    authenticateToken,
    authorizeRole('admin'),
    productController.deleteProduct.bind(productController)
);

export default router;
