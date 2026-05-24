import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        brand: { type: String, default: '' },
        image: { type: String, default: '' },
        size: { type: Number, default: null },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        lineTotal: { type: Number, required: true }
    },
    { _id: false }
);

const shippingSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderCode: { type: String, required: true },
        items: [orderItemSchema],
        subtotal: { type: Number, required: true },
        shippingFee: { type: Number, default: 0 },
        total: { type: Number, required: true },
        paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
        status: { type: String, enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'], default: 'pending' },
        shippingAddress: shippingSchema,
        note: { type: String, default: '' }
    },
    { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderCode: 1 }, { unique: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
