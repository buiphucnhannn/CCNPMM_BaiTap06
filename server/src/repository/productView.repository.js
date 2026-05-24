import ProductView from '../model/productView.model.js';

const startOfDay = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

const endOfDay = (date) => {
    const normalized = new Date(date);
    normalized.setHours(23, 59, 59, 999);
    return normalized;
};

class ProductViewRepository {
    async incrementDaily(productId, date = new Date()) {
        const day = startOfDay(date);
        return await ProductView.updateOne(
            { product: productId, date: day },
            { $inc: { count: 1 } },
            { upsert: true }
        );
    }

    async findTopViewed(days = 7, page = 1, limit = 4, maxItems = 10) {
        const safePage = Math.max(parseInt(page, 10) || 1, 1);
        const safeLimit = Math.max(parseInt(limit, 10) || 4, 1);
        const safeMaxItems = Math.max(parseInt(maxItems, 10) || 10, 1);
        const now = new Date();
        const startDate = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1)));
        const endDate = endOfDay(now);

        const basePipeline = [
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$product', totalViews: { $sum: '$count' } } },
            { $sort: { totalViews: -1 } },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' },
            { $match: { 'product.isActive': true } }
        ];

        const countResult = await ProductView.aggregate([...basePipeline, { $count: 'total' }]);
        const totalRaw = countResult?.[0]?.total || 0;
        const total = Math.min(totalRaw, safeMaxItems);
        const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

        if (total === 0) {
            return { products: [], total, page: safePage, totalPages };
        }

        const skip = (safePage - 1) * safeLimit;
        if (skip >= total) {
            return { products: [], total, page: safePage, totalPages };
        }

        const products = await ProductView.aggregate([
            ...basePipeline,
            { $limit: safeMaxItems },
            { $skip: skip },
            { $limit: safeLimit },
            { $replaceRoot: { newRoot: '$product' } }
        ]);

        return { products, total, page: safePage, totalPages };
    }
}

export default new ProductViewRepository();
