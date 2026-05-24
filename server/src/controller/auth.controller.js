import authService from '../service/auth.service.js';
import { validationResult } from 'express-validator';

class AuthController {
    checkValidationErrors(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        return null;
    }

    // API Đăng ký
    async register(req, res) {
        const validationError = this.checkValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            const { fullName, email, password } = req.body;
            await authService.registerUser(fullName, email, password);

            res.status(201).json({
                success: true,
                message: "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản"
            });
        } catch (error) {
            const status = error.message === "Email đã được sử dụng" ? 409 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    // API Xác thực OTP
    async verifyOTP(req, res) {
        const validationError = this.checkValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            const { email, otp } = req.body;
            await authService.verifyActivationOTP(email, otp);

            res.status(200).json({
                success: true,
                message: "Tài khoản đã được kích hoạt! Bạn có thể đăng nhập"
            });
        } catch (error) {
            const status = error.message === "Email không tồn tại" ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    // API Đăng nhập
    async login(req, res) {
        const validationError = this.checkValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            const { email, password } = req.body;
            const { user, token } = await authService.login(email, password);

            // Set JWT vào HttpOnly cookie (bảo mật chống XSS)
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });

            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                user,
                token,
            });
        } catch (error) {
            const status = error.status || 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    // API Đăng xuất
    async logout(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
    }

    // API Quên mật khẩu - Gửi OTP
    async forgotPassword(req, res) {
        const validationError = this.checkValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            await authService.requestPasswordReset(req.body.email);
            res.status(200).json({ success: true, message: "OTP đã gửi đến email của bạn" });
        } catch (error) {
            const status = error.message === "Email chưa đăng ký" ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }

    // API Xác thực OTP Reset Password
    async verifyResetOTP(req, res) {
        try {
            const { email, otp } = req.body;
            const resetToken = await authService.verifyResetOTP(email, otp);
            res.status(200).json({ success: true, message: "Xác thực thành công", resetToken });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // API Đặt lại mật khẩu
    async resetPassword(req, res) {
        const validationError = this.checkValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            const { email, resetToken, newPassword } = req.body;
            await authService.resetUserPassword(email, resetToken, newPassword);
            res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công!" });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // API Lấy profile
    async getProfile(req, res) {
        try {
            const user = await authService.getUserProfile(req.user.userId);
            res.status(200).json({ success: true, user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // API Cập nhật profile
    async updateProfile(req, res) {
        const validationError = this.checkValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            const updatedUser = await authService.updateUserProfile(req.user.userId, req.body);
            res.status(200).json({
                success: true,
                message: "Cập nhật thông tin thành công",
                user: updatedUser
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // API Admin Profile
    async getAdminProfile(req, res) {
        try {
            const admin = await authService.getUserProfile(req.user.userId);
            res.status(200).json({
                success: true,
                message: "Admin Profile",
                user: admin,
                adminPanel: true
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new AuthController();
