import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: false },

    // Thông tin cá nhân
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    avatar: { type: String, default: "default-avatar.png" },

    // Dành cho chức năng Register (Xác thực OTP)
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    // Dành cho chức năng Quên mật khẩu
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null },
    resetToken: { type: String, default: null }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
