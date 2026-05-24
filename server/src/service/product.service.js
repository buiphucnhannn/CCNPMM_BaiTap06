import productRepository from '../repository/product.repository.js';
import productViewRepository from '../repository/productView.repository.js';

class ProductService {
    // Get product list with filters and pagination
    async getProducts(query) {
        const { keyword, category, brand, sort, page = 1, limit = 12, minPrice, maxPrice } = query;

        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 12;

        const filter = { isActive: true };
        if (category) filter.category = category;
        if (brand) filter.brand = { $regex: brand, $options: 'i' };
        if (keyword && keyword.trim()) {
            filter.$or = [
                { name: { $regex: keyword.trim(), $options: 'i' } },
                { brand: { $regex: keyword.trim(), $options: 'i' } }
            ];
        }
        if (sort === 'sale') {
            filter.salePrice = { $ne: null, $gt: 0 };
        }

        // Filter by effective price: salePrice when > 0, otherwise base price.
        if (minPrice || maxPrice) {
            const effectivePrice = {
                $cond: [{ $gt: ['$salePrice', 0] }, '$salePrice', '$price']
            };
            const exprConditions = [];

            if (minPrice) exprConditions.push({ $gte: [effectivePrice, parseInt(minPrice)] });
            if (maxPrice) exprConditions.push({ $lte: [effectivePrice, parseInt(maxPrice)] });

            if (exprConditions.length > 0) {
                filter.$expr = exprConditions.length === 1
                    ? exprConditions[0]
                    : { $and: exprConditions };
            }
        }

        if (sort === 'price_asc' || sort === 'price_desc') {
            const sortDirection = sort === 'price_desc' ? -1 : 1;
            return await productRepository.findAllSortedByEffectivePrice(filter, sortDirection, parsedPage, parsedLimit);
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'best_seller') sortOption = { soldCount: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };
        if (sort === 'sale') sortOption = { createdAt: -1 };

        return await productRepository.findAll(filter, sortOption, parsedPage, parsedLimit);
    }

    // Get product details and increase view count
    async getProductById(id) {
        const product = await productRepository.findByIdAndIncreaseViewCount(id);
        if (!product) throw new Error('Product not found');
        try {
            await productViewRepository.incrementDaily(product._id, new Date());
        } catch (error) {
            console.warn('Failed to record product view:', error.message);
        }
        return product;
    }

    // Get homepage data: on-sale, newest, best seller
    async getHomePageData() {
        const [saleProducts, newestProducts, bestSellers] = await Promise.all([
            productRepository.findOnSale(12),
            productRepository.findNewest(12),
            productRepository.findBestSellers(12)
        ]);

        return { saleProducts, newestProducts, bestSellers };
    }

    // Top 10 by ranking type with horizontal pagination
    async getHomeRanking(type, page = 1, limit = 5) {
        const normalizedType = type === 'most_viewed' ? 'most_viewed' : 'best_seller';
        if (normalizedType === 'most_viewed') {
            return await productViewRepository.findTopViewed(7, page, limit, 10);
        }
        return await productRepository.findTopRanked(normalizedType, parseInt(page), parseInt(limit), 10);
    }

    // Search products
    async searchProducts(keyword, page, limit) {
        if (!keyword || keyword.trim() === '') {
            throw new Error('Please enter a search keyword');
        }
        return await productRepository.search(keyword.trim(), parseInt(page) || 1, parseInt(limit) || 12);
    }

    // Admin: Create product
    async createProduct(data) {
        return await productRepository.create(data);
    }

    // Admin: Update product
    async updateProduct(id, data) {
        const product = await productRepository.update(id, data);
        if (!product) throw new Error('Product not found');
        return product;
    }

    // Admin: Delete product
    async deleteProduct(id) {
        const product = await productRepository.delete(id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    // Related products
    async getRelatedProducts(productId, limit = 4) {
        const product = await productRepository.findById(productId);
        if (!product) throw new Error('Product not found');
        return await productRepository.findRelated(productId, product.category, product.brand, limit);
    }
}

export default new ProductService();
