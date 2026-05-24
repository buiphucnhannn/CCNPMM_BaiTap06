import userRepository from '../repository/user.repository.js';
import sendEmail from '../util/email.util.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/environment.js';

class AuthService {

    // Logic dang ky tai khoan
    async registerUser(fullName, email, password) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) throw new Error("Email đã được sử dụng");

        // Hash mat khau
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tao OTP 6 so va han 5 phut
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        // Luu thong tin nguoi dung (isActive: false)
        await userRepository.createUser({
            fullName,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            role: "user",
            isActive: false
        });

        try {
            const message = `Mã OTP kích hoạt tài khoản Sneaker Store của bạn là: ${otp}\nMã có hiệu lực trong 5 phút.`;
            await sendEmail(email, "Kích hoạt tài khoản Sneaker Store", message);
        } catch (error) {
            await userRepository.deleteByEmail(email);
            throw error;
        }
    }

    // Logic xac thuc OTP kich hoat
    async verifyActivationOTP(email, otp) {
        const user = await userRepository.findByEmail(email);

        if (!user) throw new Error("Email không tồn tại");
        if (user.isActive) throw new Error("Tài khoản đã được kích hoạt");
        if (!user.otp || user.otp !== otp) throw new Error("OTP không chính xác");
        if (Date.now() > user.otpExpiry) throw new Error("OTP đã hết hạn");

        // Cap nhat trang thai va xoa OTP
        await userRepository.updateUserByEmail(email, {
            isActive: true,
            otp: null,
            otpExpiry: null
        });
    }

    async login(email, password) {
        // Tim user theo email
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw { status: 401, message: 'Email hoặc mật khẩu không đúng' };
        }

        // So sanh password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw { status: 401, message: 'Email hoặc mật khẩu không đúng' };
        }

        // Kiem tra tai khoan da kich hoat chua
        if (!user.isActive) {
            throw { status: 403, message: 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt.' };
        }

        // Tao JWT token (chua id va role)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN }
        );

        // An password truoc khi tra ve
        const userObj = user.toObject();
        delete userObj.password;

        return { user: userObj, token };
    }

    async requestPasswordReset(email) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new Error("Email chưa đăng ký");

        // Tao OTP 6 so ngau nhien
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        await userRepository.updateUserByEmail(email, {
            resetOTP: otp,
            resetOTPExpiry: otpExpiry,
            resetToken: null
        });

        const message = `Mã OTP đặt lại mật khẩu Sneaker Store của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`;
        await sendEmail(email, "Đặt lại mật khẩu - Sneaker Store", message);
    }

    async verifyResetOTP(email, otp) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new Error("Email không tồn tại");

        if (!user.resetOTP && user.resetToken) {
            throw new Error("Mã OTP này đã được sử dụng");
        }

        if (!user.resetOTP || user.resetOTP !== otp) {
            throw new Error("OTP không chính xác");
        }

        if (Date.now() > user.resetOTPExpiry) {
            throw new Error("OTP đã hết hạn");
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        await userRepository.updateUserByEmail(email, {
            resetToken,
            resetOTP: null,
            resetOTPExpiry: null
        });

        return resetToken;
    }

    async resetUserPassword(email, resetToken, newPassword) {
        const user = await userRepository.findByEmail(email);
        if (!user || user.resetToken !== resetToken) {
            throw new Error("Phiên không hợp lệ hoặc đã hết hạn");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userRepository.updateUserByEmail(email, {
            password: hashedPassword,
            resetOTP: null,
            resetOTPExpiry: null,
            resetToken: null
        });
    }

    async getUserProfile(userId) {
        return await userRepository.findById(userId);
    }

    async updateUserProfile(userId, updateData) {
        // Chi cho phep cap nhat cac truong an toan
        const allowedFields = ['fullName', 'phone', 'address', 'avatar'];
        const filteredData = {};
        for (const key of allowedFields) {
            if (updateData[key] !== undefined) {
                filteredData[key] = updateData[key];
            }
        }

        if (Object.keys(filteredData).length === 0) {
            throw new Error("Không có thông tin nào để cập nhật");
        }

        return await userRepository.updateUserById(userId, filteredData);
    }
}

export default new AuthService();
