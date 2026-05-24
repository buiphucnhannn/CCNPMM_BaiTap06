import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    images: [{ type: String }],
    category: {
        type: String,
        enum: ['running', 'lifestyle', 'basketball', 'skateboarding', 'training'],
        default: 'lifestyle'
    },
    sizes: [{
        size: { type: Number, required: true },
        stock: { type: Number, default: 0 }
    }],
    tags: [{
        type: String,
        enum: ['new', 'best-seller', 'sale', 'limited']
    }],
    soldCount: { type: Number, default: 0 },
    viewedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Search index
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
