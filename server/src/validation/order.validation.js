import { body } from 'express-validator';

export const createOrderValidation = [
    body('fullName').notEmpty().withMessage('Họ và tên không được để trống').trim(),
    body('phone').matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
    body('address').notEmpty().withMessage('Địa chỉ không được để trống').trim(),
    body('note').optional().isLength({ max: 500 }).withMessage('Ghi chú tối đa 500 ký tự')
];
