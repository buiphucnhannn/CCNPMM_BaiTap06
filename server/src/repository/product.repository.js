import Product from '../model/product.model.js';

class ProductRepository {
    // Get product list with filter, sort, pagination
    async findAll(filter = {}, sort = { createdAt: -1 }, page = 1, limit = 12) {
        const skip = (page - 1) * limit;
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        const total = await Product.countDocuments(filter);
        return { products, total, page, totalPages: Math.ceil(total / limit) };
    }

    // Get product list sorted by effective price (salePrice when available)
    async findAllSortedByEffectivePrice(filter = {}, sortDirection = 1, page = 1, limit = 12) {
        const safePage = Math.max(parseInt(page) || 1, 1);
        const safeLimit = Math.max(parseInt(limit) || 12, 1);
        const skip = (safePage - 1) * safeLimit;
        const safeSortDirection = sortDirection === -1 ? -1 : 1;

        const pipeline = [
            { $match: filter },
            {
                $addFields: {
                    effectivePrice: {
                        $cond: [{ $gt: ['$salePrice', 0] }, '$salePrice', '$price']
                    }
                }
            },
            { $sort: { effectivePrice: safeSortDirection, createdAt: -1, _id: 1 } },
            { $skip: skip },
            { $limit: safeLimit },
        ];

        const [products, total] = await Promise.all([
            Product.aggregate(pipeline),
            Product.countDocuments(filter),
        ]);

        return { products, total, page: safePage, totalPages: Math.ceil(total / safeLimit) };
    }

    async findById(id) {
        return await Product.findById(id);
    }

    async findByIdAndIncreaseViewCount(id) {
        return await Product.findByIdAndUpdate(
            id,
            { $inc: { viewedCount: 1 } },
            { new: true }
        );
    }

    // Best selling products
    async findBestSellers(limit = 8) {
        return await Product.find({ isActive: true })
            .sort({ soldCount: -1 })
            .limit(limit);
    }

    // Newest products
    async findNewest(limit = 8) {
        return await Product.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    // On-sale products (salePrice exists)
    async findOnSale(limit = 8) {
        const safeLimit = Math.max(parseInt(limit) || 8, 1);
        return await Product.aggregate([
            {
                $match: {
                    isActive: true,
                    salePrice: { $ne: null, $gt: 0 }
                }
            },
            {
                $addFields: {
                    discountValue: { $subtract: ['$price', '$salePrice'] },
                    discountPercent: {
                        $cond: [
                            { $gt: ['$price', 0] },
                            {
                                $multiply: [
                                    { $divide: [{ $subtract: ['$price', '$salePrice'] }, '$price'] },
                                    100
                                ]
                            },
                            0
                        ]
                    }
                }
            },
            { $sort: { discountPercent: -1, discountValue: -1, soldCount: -1, createdAt: -1 } },
            { $limit: safeLimit }
        ]);
    }

    async findTopRanked(type = 'best_seller', page = 1, limit = 5, maxItems = 10) {
        const safePage = Math.max(parseInt(page) || 1, 1);
        const safeLimit = Math.max(parseInt(limit) || 5, 1);
        const skip = (safePage - 1) * safeLimit;

        const sortOption = type === 'most_viewed'
            ? { viewedCount: -1, soldCount: -1, createdAt: -1 }
            : { soldCount: -1, viewedCount: -1, createdAt: -1 };

        const totalActive = await Product.countDocuments({ isActive: true });
        const total = Math.min(totalActive, maxItems);
        const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

        if (skip >= total) {
            return { products: [], total, page: safePage, totalPages };
        }

        const products = await Product.find({ isActive: true })
            .sort(sortOption)
            .skip(skip)
            .limit(Math.min(safeLimit, total - skip));

        return { products, total, page: safePage, totalPages };
    }

    // Search products
    async search(keyword, page = 1, limit = 12) {
        const skip = (page - 1) * limit;
        const filter = {
            isActive: true,
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { brand: { $regex: keyword, $options: 'i' } }
            ]
        };
        const products = await Product.find(filter).skip(skip).limit(limit);
        const total = await Product.countDocuments(filter);
        return { products, total, page, totalPages: Math.ceil(total / limit) };
    }

    async create(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async update(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }

    // Related products (same category or brand)
    async findRelated(productId, category, brand, limit = 4) {
        return await Product.find({
            _id: { $ne: productId },
            isActive: true,
            $or: [
                { category: category },
                { brand: { $regex: brand, $options: 'i' } }
            ]
        })
            .sort({ soldCount: -1 })
            .limit(limit);
    }
}

export default new ProductRepository();
