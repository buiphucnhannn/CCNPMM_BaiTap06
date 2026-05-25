import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiChevronRight, FiClock } from 'react-icons/fi'
import { fetchMyOrders, clearOrderError } from '../redux/slices/orderSlice'
import LoadingSpinner from '../components/LoadingSpinner'
import { toast } from 'react-toastify'

const STATUS_LABEL = {
  pending: 'Đơn hàng mới',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị hàng',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao thành công',
  cancelled: 'Đã hủy đơn',
  cancel_requested: 'Đang chờ shop xác nhận hủy',
}

const STATUS_STYLE = {
  pending: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  preparing: 'bg-amber-50 text-amber-700 border-amber-200',
  shipping: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  cancel_requested: 'bg-orange-50 text-orange-700 border-orange-200',
}

const formatPrice = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`
const formatDate = (value) => (value ? new Date(value).toLocaleString('vi-VN') : '-')

const MyOrdersPage = () => {
  const dispatch = useDispatch()
  const { myOrders, loadingOrders, error } = useSelector((state) => state.order)

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearOrderError())
    }
  }, [dispatch, error])

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-600 mt-2">Danh sách đơn hàng gần đây. Bấm vào từng đơn để xem chi tiết.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingOrders ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <LoadingSpinner text="Đang tải danh sách đơn hàng..." />
          </div>
        ) : myOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">
            Bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => (
              <Link
                key={order._id}
                to={`/my-orders/${order._id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{order.orderCode}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                      <FiClock className="text-gray-400" /> {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:grid md:grid-cols-[minmax(0,200px)_100px_140px_16px] md:items-center md:justify-items-end md:gap-4">
                    <span
                      className={`inline-flex items-center justify-center text-xs font-semibold border px-2 py-1 rounded-full w-[150px] md:w-[170px] whitespace-nowrap truncate md:justify-self-end ${STATUS_STYLE[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                    >
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                    <span className="text-sm text-gray-500 md:text-right md:justify-self-end">{order.items?.length || 0} sản phẩm</span>
                    <span className="text-xl font-bold text-gray-900 md:text-right md:justify-self-end">{formatPrice(order.total)}</span>
                    <FiChevronRight className="text-gray-400 md:justify-self-end" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrdersPage
