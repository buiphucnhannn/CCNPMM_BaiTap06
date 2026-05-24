import express from 'express';
import authController from '../controller/auth.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';
import { updateProfileValidation } from '../validation/auth.validation.js';

const router = express.Router();

// ==================== USER PROFILE ====================
// Pipeline: Authentication (Lớp 3) → Authorization user (Lớp 4) → Controller
router.get('/profile',
    authenticateToken,
    authorizeRole('user'),
    authController.getProfile.bind(authController)
);

router.put('/profile',
    authenticateToken,
    authorizeRole('user'),
    updateProfileValidation,
    authController.updateProfile.bind(authController)
);

export default router;
