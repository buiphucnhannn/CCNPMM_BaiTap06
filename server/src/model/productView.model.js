import mongoose from 'mongoose';

const productViewSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        date: { type: Date, required: true },
        count: { type: Number, default: 0 }
    },
    { timestamps: true }
);

productViewSchema.index({ product: 1, date: 1 }, { unique: true });
productViewSchema.index({ date: 1 });

const ProductView = mongoose.model('ProductView', productViewSchema);
export default ProductView;
