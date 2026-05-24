import express from 'express';
import productController from '../controller/product.controller.js';
import { apiLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// ==================== PUBLIC PRODUCT ROUTES ====================
// Trang chủ - lấy sản phẩm khuyến mãi, mới nhất, bán chạy nhất
router.get('/home',
    apiLimiter,
    productController.getHomePageData.bind(productController)
);

// Trang chủ - top 10 bán chạy/xem nhiều có phân trang ngang
router.get('/home/rankings',
    apiLimiter,
    productController.getHomeRanking.bind(productController)
);

// Danh sách sản phẩm (có filter, sort, pagination)
router.get('/',
    apiLimiter,
    productController.getProducts.bind(productController)
);

// Tìm kiếm sản phẩm
router.get('/search',
    apiLimiter,
    productController.searchProducts.bind(productController)
);

// Sản phẩm tương tự
router.get('/:id/related',
    apiLimiter,
    productController.getRelatedProducts.bind(productController)
);

// Chi tiết sản phẩm
router.get('/:id',
    apiLimiter,
    productController.getProductById.bind(productController)
);

export default router;
