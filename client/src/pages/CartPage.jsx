import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../redux/slices/cartSlice'
import LoadingSpinner from '../components/LoadingSpinner'

const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalItems, totalPrice, loading, processing } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleUpdateQuantity = (item, nextQuantity) => {
    if (nextQuantity < 1) return
    dispatch(updateCartItem({ itemId: item._id, quantity: nextQuantity })).then((res) => {
      if (res.meta.requestStatus === 'rejected') {
        toast.error(res.payload?.message || 'Cập nhật giỏ hàng thất bại')
      }
    })
  }

  const handleRemoveItem = (itemId) => {
    dispatch(removeCartItem(itemId)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
      } else {
        toast.error(res.payload?.message || 'Xóa sản phẩm thất bại')
      }
    })
  }

  const handleClearCart = () => {
    dispatch(clearCart()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Đã xóa toàn bộ giỏ hàng')
      } else {
        toast.error(res.payload?.message || 'Không thể xóa giỏ hàng')
      }
    })
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (loading) {
    return <LoadingSpinner text="Đang tải giỏ hàng..." />
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <FiShoppingBag className="text-2xl text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h1>
            <p className="text-gray-500 text-sm mb-6">Khám phá sản phẩm mới và thêm vào giỏ hàng ngay.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900">
              Tiếp tục mua sắm <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Giỏ hàng</h1>
          <p className="text-gray-500 text-sm mt-1">{totalItems} sản phẩm trong giỏ</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product
              const sizeStock = product?.sizes?.find((s) => Number(s.size) === Number(item.size))?.stock
              const canIncrease = sizeStock ? item.quantity < sizeStock : true
              const lineTotal = item.lineTotal ?? item.unitPrice * item.quantity

              return (
                <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-28 h-28 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={product?.images?.[0] || 'https://via.placeholder.com/150x150?text=Sneaker'}
                      alt={product?.name || 'Sneaker'}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=Sneaker' }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{product?.brand}</p>
                        <Link to={`/product/${product?._id}`} className="font-semibold text-gray-800 hover:text-black">
                          {product?.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size ?? 'Freesize'}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 inline-flex items-center justify-center"
                        aria-label="Xóa sản phẩm"
                        disabled={processing}
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-lg font-bold text-gray-900">{formatPrice(item.unitPrice)}</div>
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden">
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            disabled={processing || item.quantity <= 1}
                            className="w-9 h-9 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                          >
                            <FiMinus />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            disabled={processing || !canIncrease}
                            className="w-9 h-9 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                          >
                            <FiPlus />
                          </button>
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">{formatPrice(lineTotal)}</div>
                      </div>
                    </div>
                    {sizeStock !== undefined && sizeStock !== null && (
                      <p className="text-xs text-gray-400 mt-2">Tồn kho size {item.size}: {sizeStock}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800">Tóm tắt đơn hàng</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="font-medium text-gray-800">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vận chuyển</span>
                  <span className="font-medium text-gray-800">Miễn phí</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-5 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
              >
                Thanh toán
              </button>

              <button
                onClick={handleClearCart}
                disabled={processing}
                className="w-full mt-3 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Xóa giỏ hàng
              </button>

              <Link
                to="/products"
                className="mt-4 inline-flex items-center justify-center w-full text-sm text-gray-600 hover:text-black font-semibold"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
