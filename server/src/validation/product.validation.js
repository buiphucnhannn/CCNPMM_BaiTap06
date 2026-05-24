import { body } from 'express-validator';

// Validation cho tạo sản phẩm mới
export const createProductValidation = [
    body('name').notEmpty().withMessage('Tên sản phẩm không được để trống').trim(),
    body('brand').notEmpty().withMessage('Thương hiệu không được để trống').trim(),
    body('price').isNumeric().withMessage('Giá phải là số').custom(value => {
        if (value <= 0) throw new Error('Giá phải lớn hơn 0');
        return true;
    }),
    body('salePrice').optional({ nullable: true }).isNumeric().withMessage('Giá khuyến mãi phải là số'),
    body('category').optional().isIn(['running', 'lifestyle', 'basketball', 'skateboarding', 'training'])
        .withMessage('Danh mục không hợp lệ'),
];

// Validation cho cập nhật sản phẩm
export const updateProductValidation = [
    body('name').optional().notEmpty().withMessage('Tên sản phẩm không được để trống').trim(),
    body('price').optional().isNumeric().withMessage('Giá phải là số'),
    body('salePrice').optional({ nullable: true }).isNumeric().withMessage('Giá khuyến mãi phải là số'),
];
