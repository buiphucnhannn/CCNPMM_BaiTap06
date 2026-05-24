import rateLimit from 'express-rate-limit';

// Rate limiter cho auth routes (login, register, ...)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 10,
    message: { success: false, message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter cho API chung
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
    standardHeaders: true,
    legacyHeaders: false,
});
