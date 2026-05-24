import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiShoppingBag, FiCreditCard } from 'react-icons/fi'
import { fetchCart } from '../redux/slices/cartSlice'
import { getProfile, updateProfile } from '../redux/slices/authSlice'
import { createOrder, clearOrderError } from '../redux/slices/orderSlice'
import LoadingSpinner from '../components/LoadingSpinner'

const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { items, totalItems, totalPrice, loading } = useSelector((state) => state.cart)
  const { creating, error } = useSelector((state) => state.order)

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: '',
  })
  const [hasTouched, setHasTouched] = useState(false)

  useEffect(() => {
    dispatch(fetchCart())
    dispatch(getProfile())
  }, [dispatch])

  useEffect(() => {
    if (user && !hasTouched) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }))
    }
  }, [user, hasTouched])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearOrderError())
    }
  }, [error, dispatch])

  const handleChange = (field) => (e) => {
    setHasTouched(true)
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createOrder(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Đặt hàng COD thành công!')
        dispatch(fetchCart())
        if (user) {
          const profilePayload = {
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
          }
          const shouldUpdateProfile =
            profilePayload.fullName !== (user.fullName || '') ||
            profilePayload.phone !== (user.phone || '') ||
            profilePayload.address !== (user.address || '')

          if (shouldUpdateProfile) {
            dispatch(updateProfile(profilePayload))
          }
        }
        navigate('/order-success', { state: { order: res.payload.order } })
      }
    })
  }

  if (loading) {
    return <LoadingSpinner text="Đang tải đơn hàng..." />
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <FiShoppingBag className="text-2xl text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Chưa có sản phẩm để thanh toán</h1>
            <p className="text-gray-500 text-sm mb-6">Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900">
              Xem sản phẩm
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Thanh toán COD</h1>
          <p className="text-gray-500 text-sm mt-1">Xác nhận thông tin và đặt hàng</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-800">Thông tin giao hàng</h2>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Họ và tên</label>
              <input
                type="text"
                value={form.fullName}
                onChange={handleChange('fullName')}
                className="w-full bg-white text-gray-800 rounded-xl py-3 px-4 border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Số điện thoại</label>
              <input
                type="text"
                value={form.phone}
                onChange={handleChange('phone')}
                className="w-full bg-white text-gray-800 rounded-xl py-3 px-4 border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Địa chỉ nhận hàng</label>
              <textarea
                rows={3}
                value={form.address}
                onChange={handleChange('address')}
                className="w-full bg-white text-gray-800 rounded-xl py-3 px-4 border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Ghi chú (tùy chọn)</label>
              <textarea
                rows={3}
                value={form.note}
                onChange={handleChange('note')}
                className="w-full bg-white text-gray-800 rounded-xl py-3 px-4 border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Phương thức thanh toán</p>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <FiCreditCard className="text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-xs text-gray-500">Bạn sẽ thanh toán khi nhận được hàng</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {creating ? 'Đang đặt hàng...' : 'Đặt hàng COD'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800">Tóm tắt đơn hàng</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              {items.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-gray-800 font-medium">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">Size {item.size ?? 'Freesize'} · x{item.quantity}</p>
                  </div>
                  <span className="text-gray-800 font-semibold">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
