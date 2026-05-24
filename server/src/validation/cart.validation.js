import { body } from 'express-validator';

export const addCartItemValidation = [
    body('productId')
        .notEmpty().withMessage('Sản phẩm không hợp lệ')
        .isMongoId().withMessage('Sản phẩm không hợp lệ'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0'),
    body('size').optional().isFloat({ gt: 0 }).withMessage('Size không hợp lệ')
];

export const updateCartItemValidation = [
    body('quantity').notEmpty().withMessage('Số lượng không hợp lệ')
        .isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0')
];
