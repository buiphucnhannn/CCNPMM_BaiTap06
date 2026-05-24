import { useLocation, Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'

const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const OrderSuccessPage = () => {
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h1>
            <p className="text-gray-500 text-sm mb-6">Vui lòng quay lại trang giỏ hàng để đặt lại đơn.</p>
            <Link to="/cart" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900">
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Đặt hàng thành công</h1>
          <p className="text-gray-500 text-sm mt-1">Cảm ơn bạn đã mua sắm tại Sneaker Store</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <FiCheckCircle className="text-3xl text-emerald-500" />
            <div>
              <p className="text-lg font-bold text-gray-900">Mã đơn hàng: {order.orderCode}</p>
              <p className="text-sm text-gray-500">Tổng thanh toán: {formatPrice(order.total)}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            {order.items.map((item, index) => (
              <div key={`${item.product}-${index}`} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-500">Size {item.size ?? 'Freesize'} · x{item.quantity}</p>
                </div>
                <span className="text-gray-800 font-semibold">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/" className="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-center hover:bg-gray-900">
              Về trang chủ
            </Link>
            <Link to="/products" className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-center hover:bg-gray-50">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
