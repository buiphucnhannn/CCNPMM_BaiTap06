import express from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import adminRoutes from './admin.routes.js'
import productRoutes from './product.routes.js'
import cartRoutes from './cart.routes.js'
import orderRoutes from './order.routes.js'

// ====================================================================
// ROUTE AGGREGATOR
// Gom tất cả routes — thêm route modules ở đây
// ====================================================================

const router = express.Router()

// --- Mount routes ---
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/admin', adminRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sneaker Store Server đang hoạt động',
    timestamp: new Date().toISOString(),
  })
})

export default router
