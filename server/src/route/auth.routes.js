import express from 'express';
import authController from '../controller/auth.controller.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
    loginValidation,
    registerValidation,
    verifyOtpValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    updateProfileValidation
} from '../validation/auth.validation.js';

const router = express.Router();

// ==================== REGISTER & VERIFY OTP ====================
// Pipeline: Rate Limiting (Lớp 2) → Validation (Lớp 1) → Controller
router.post('/register',
    authLimiter,
    registerValidation,
    authController.register.bind(authController)
);

router.post('/verify-otp',
    authLimiter,
    verifyOtpValidation,
    authController.verifyOTP.bind(authController)
);

// ==================== LOGIN & LOGOUT ====================
router.post('/login',
    authLimiter,
    loginValidation,
    authController.login.bind(authController)
);

router.post('/logout',
    authController.logout.bind(authController)
);

// ==================== FORGOT PASSWORD ====================
router.post('/forgot-password',
    authLimiter,
    forgotPasswordValidation,
    authController.forgotPassword.bind(authController)
);

router.post('/verify-reset-otp',
    authLimiter,
    authController.verifyResetOTP.bind(authController)
);

router.post('/reset-password',
    authLimiter,
    resetPasswordValidation,
    authController.resetPassword.bind(authController)
);

export default router;
