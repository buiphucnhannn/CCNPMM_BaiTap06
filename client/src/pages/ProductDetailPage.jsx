import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, fetchRelatedProducts, clearSelectedProduct } from '../redux/slices/productSlice'
import { addCartItem } from '../redux/slices/cartSlice'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductCard from '../components/ProductCard'
import { FiArrowLeft, FiTruck, FiRefreshCw, FiShield, FiTrendingUp, FiPackage, FiChevronLeft, FiChevronRight, FiShoppingCart } from 'react-icons/fi'
import { toast } from 'react-toastify'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/pagination'

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const ProductDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedProduct: product, relatedProducts, loading } = useSelector((state) => state.product)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    dispatch(fetchProductById(id))
    dispatch(fetchRelatedProducts(id))
    return () => dispatch(clearSelectedProduct())
  }, [dispatch, id])

  const hasSale = product?.salePrice && product?.salePrice < product?.price
  const discountPercent = hasSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0
  const images = product?.images?.length > 0 ? product.images : ['https://via.placeholder.com/600x600?text=Sneaker']

  // Tính tổng tồn kho
  const totalStock = product?.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0
  const selectedSizeStock = product?.sizes?.find((s) => s.size === selectedSize)?.stock ?? 0
  const maxQuantity = product?.sizes?.length > 0 ? selectedSizeStock : totalStock
  const isAddDisabled = maxQuantity <= 0 || (product?.sizes?.length > 0 && !selectedSize)

  useEffect(() => {
    if (maxQuantity <= 0) {
      setQuantity(1)
      return
    }
    setQuantity((prev) => Math.min(Math.max(prev, 1), maxQuantity))
  }, [maxQuantity])

  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))
  const increaseQuantity = () => {
    if (maxQuantity > 0) setQuantity((prev) => Math.min(maxQuantity, prev + 1))
  }

  const handleAddToCart = (redirect = false) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng')
      navigate('/login')
      return
    }

    if (product?.sizes?.length > 0 && !selectedSize) {
      toast.error('Vui lòng chọn size phù hợp')
      return
    }

    if (maxQuantity <= 0 || quantity > maxQuantity) {
      toast.error('Số lượng vượt quá tồn kho')
      return
    }

    dispatch(addCartItem({ productId: product._id, size: selectedSize, quantity })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Đã thêm sản phẩm vào giỏ hàng')
        navigate('/cart')
      } else {
        toast.error(res.payload?.message || 'Không thể thêm vào giỏ hàng')
      }
    })
  }

  if (loading || !product) return <LoadingSpinner text="Đang tải chi tiết sản phẩm..." />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-black transition-colors">Sản phẩm</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6 group text-sm">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Quay lại danh sách
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* =============== IMAGE GALLERY (SWIPER) =============== */}
          <div className="space-y-4">
            {/* Main Swiper */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden relative group">
              {hasSale && (
                <div className="absolute top-4 left-4 z-10 bg-black text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                  -{discountPercent}% OFF
                </div>
              )}
              <Swiper
                modules={[Navigation, Thumbs, Pagination]}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                navigation={{
                  prevEl: '.swiper-btn-prev',
                  nextEl: '.swiper-btn-next',
                }}
                pagination={{ clickable: true }}
                spaceBetween={0}
                slidesPerView={1}
                className="aspect-square"
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <img
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=Sneaker' }}
                      />
                    </div>
                  </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button className="swiper-btn-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiChevronLeft className="text-gray-800" />
                    </button>
                    <button className="swiper-btn-next absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiChevronRight className="text-gray-800" />
                    </button>
                  </>
                )}
              </Swiper>
            </div>

            {/* Thumbnails Swiper */}
            {images.length > 1 && (
              <div className="max-w-[420px]">
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={Math.min(images.length, 4)}
                  watchSlidesProgress
                  className="thumbs-swiper"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index} className="cursor-pointer">
                      <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-black transition-colors">
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=Thumb' }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* =============== PRODUCT INFO =============== */}
          <div className="animate-fade-in-up">
            {/* Brand + Tags */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-black font-semibold uppercase tracking-wider">{product.brand}</span>
              {product.tags?.length > 0 && (
                <div className="flex gap-1.5">
                  {product.tags.map((tag) => (
                    <span key={tag} className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      tag === 'sale' ? 'bg-red-100 text-red-700' :
                      tag === 'new' ? 'bg-emerald-100 text-emerald-700' :
                      tag === 'best-seller' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-800 text-white'
                    }`}>
                      {tag === 'sale' ? 'Giảm giá' : tag === 'new' ? 'Mới' : tag === 'best-seller' ? 'Bán chạy' : tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              {hasSale ? (
                <>
                  <span className="text-3xl font-bold text-red-600">{formatPrice(product.salePrice)}</span>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="bg-red-100 text-red-700 text-sm font-bold px-2.5 py-1 rounded-full">Tiết kiệm {discountPercent}%</span>
                </>
              ) : <span className="text-3xl font-bold text-gray-800">{formatPrice(product.price)}</span>}
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
              {product.soldCount > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <FiTrendingUp className="text-emerald-600" />
                  <span>Đã bán <strong className="text-gray-800">{product.soldCount}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FiPackage className="text-blue-600" />
                <span>Tồn kho: <strong className={`${totalStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{totalStock > 0 ? `${totalStock} sản phẩm` : 'Hết hàng'}</strong></span>
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">Danh mục:
                <Link to={`/products?category=${product.category}`} className="ml-1 text-black font-medium capitalize hover:underline">
                  {product.category}
                </Link>
              </p>
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Kích cỡ có sẵn:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                      disabled={s.stock <= 0}
                      className={`w-14 h-14 border-2 rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                        selectedSize === s.size
                          ? 'border-black bg-black text-white shadow-lg shadow-black/20'
                          : s.stock > 0
                            ? 'border-gray-300 text-gray-700 hover:border-black hover:text-black cursor-pointer'
                            : 'border-gray-200 text-gray-300 cursor-not-allowed line-through bg-gray-50'
                      }`}
                    >
                      <span className="font-semibold">{s.size}</span>
                      {s.stock > 0 && <span className="text-[10px] opacity-60">{s.stock}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}            {/* Quantity */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Số lượng:</p>
                <p className="text-xs text-gray-500">
                  {product.sizes?.length > 0
                    ? selectedSize
                      ? `Tối đa ${maxQuantity}`
                      : 'Vui lòng chọn size'
                    : `Tối đa ${maxQuantity}`}
                </p>
              </div>
              <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-11 h-11 text-xl text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <div className="w-14 h-11 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                  {quantity}
                </div>
                <button
                  onClick={increaseQuantity}
                  disabled={maxQuantity <= 0 || quantity >= maxQuantity || (product.sizes?.length > 0 && !selectedSize)}
                  className="w-11 h-11 text-xl text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
            {/* Add to cart */}
            <div className="mb-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleAddToCart(true)}
                disabled={isAddDisabled}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart /> Thêm vào giỏ hàng
              </button>
              <button
                onClick={() => handleAddToCart(true)}
                disabled={isAddDisabled}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-800 py-3.5 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mua ngay
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-2">Mô tả sản phẩm:</p>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <FiTruck />, label: 'Miễn phí giao hàng', sub: 'Đơn > 2tr' },
                { icon: <FiRefreshCw />, label: 'Đổi trả 30 ngày', sub: 'Miễn phí' },
                { icon: <FiShield />, label: 'Chính hãng 100%', sub: 'Cam kết' },
              ].map((f, i) => (
                <div key={i} className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-black text-xl flex justify-center mb-2">{f.icon}</div>
                  <p className="text-xs text-gray-700 font-semibold">{f.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =============== RELATED PRODUCTS =============== */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Sản phẩm tương tự</h2>
                <p className="text-gray-500 text-sm mt-1">Có thể bạn cũng thích</p>
              </div>
              <Link to={`/products?category=${product.category}`} className="text-sm text-black font-semibold hover:underline">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <div key={p._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage

