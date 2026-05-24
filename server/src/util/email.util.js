import nodemailer from 'nodemailer';
import env from '../config/environment.js';

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: env.EMAIL_HOST,
            port: env.EMAIL_PORT,
            secure: env.EMAIL_PORT === 465,
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Sneaker Store" <${env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
        console.log('Email sent successfully to:', to);
    } catch (error) {
        console.error('Email sending failed:', error);
        const detail = error?.response || error?.code || error?.message || 'unknown';
        throw new Error(`Không thể gửi email lúc này (${detail})`);
    }
};

export default sendEmail;
