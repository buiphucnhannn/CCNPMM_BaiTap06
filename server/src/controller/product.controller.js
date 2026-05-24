import productService from '../service/product.service.js';
import { validationResult } from 'express-validator';

class ProductController {
    // API Lấy danh sách sản phẩm (public)
    async getProducts(req, res) {
        try {
            const result = await productService.getProducts(req.query);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // API Lấy dữ liệu trang chủ (public)
    async getHomePageData(req, res) {
        try {
            const data = await productService.getHomePageData();
            res.status(200).json({ success: true, ...data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // API Top 10 bán chạy/xem nhiều có phân trang ngang (public)
    async getHomeRanking(req, res) {
        try {
            const { type = 'best_seller', page = 1, limit = 5 } = req.query;
            const result = await productService.getHomeRanking(type, page, limit);
            res.status(200).json({ success: true, type, ...result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // API Tìm kiếm sản phẩm (public)
    async searchProducts(req, res) {
        try {
            const { keyword, page, limit } = req.query;
            const result = await productService.searchProducts(keyword, page, limit);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // API Lấy chi tiết sản phẩm (public)
    async getProductById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.status(200).json({ success: true, product });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    // Admin: Tạo sản phẩm mới
    async createProduct(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công', product });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // Admin: Cập nhật sản phẩm
    async updateProduct(req, res) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Cập nhật sản phẩm thành công', product });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // Admin: Xóa sản phẩm
    async deleteProduct(req, res) {
        try {
            await productService.deleteProduct(req.params.id);
            res.status(200).json({ success: true, message: 'Xóa sản phẩm thành công' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // API Sản phẩm tương tự (public)
    async getRelatedProducts(req, res) {
        try {
            const products = await productService.getRelatedProducts(req.params.id, parseInt(req.query.limit) || 4);
            res.status(200).json({ success: true, products });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
}

export default new ProductController();
