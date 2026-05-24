import { body } from 'express-validator';

// Validation cho Register
export const registerValidation = [
    body('fullName').notEmpty().withMessage('Tên không được để trống').trim(),
    body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')
        .matches(/[A-Z]/).withMessage('Phải chứa ít nhất 1 chữ hoa')
        .matches(/[a-z]/).withMessage('Phải chứa ít nhất 1 chữ thường')
        .matches(/[0-9]/).withMessage('Phải chứa ít nhất 1 số'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Mật khẩu xác nhận không khớp');
        }
        return true;
    })
];

// Validation cho Login
export const loginValidation = [
    body('email')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
];

// Validation cho Verify OTP
export const verifyOtpValidation = [
    body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
    body('otp').notEmpty().withMessage('Vui lòng nhập mã OTP')
];

// Validation cho Forgot Password
export const forgotPasswordValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email không hợp lệ')
];

// Validation cho Reset Password
export const resetPasswordValidation = [
    body('newPassword')
        .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')
        .matches(/\d/).withMessage('Phải chứa ít nhất 1 số'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) throw new Error('Mật khẩu xác nhận không khớp');
        return true;
    })
];

// Validation cho Update Profile
export const updateProfileValidation = [
    body('fullName').optional().notEmpty().withMessage('Tên không được để trống').trim(),
    body('phone').optional().matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
    body('address').optional().trim()
];
