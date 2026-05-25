import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiAlertTriangle, FiArrowLeft, FiClock, FiMapPin, FiPhone, FiUser, FiXCircle } from 'react-icons/fi'
import { cancelOrder, clearCurrentOrder, clearOrderError, fetchOrderById } from '../redux/slices/orderSlice'
import LoadingSpinner from '../components/LoadingSpinner'
import { toast } from 'react-toastify'

const STATUS_CONFIG = {
  pending: { label: 'Đơn hàng mới', step: 1 },
  confirmed: { label: 'Đã xác nhận đơn hàng', step: 2 },
  preparing: { label: 'Shop đang chuẩn bị hàng', step: 3 },
  shipping: { label: 'Đang giao hàng', step: 4 },
  delivered: { label: 'Đã giao thành công', step: 5 },
  cancelled: { label: 'Đã hủy đơn hàng', step: 6 },
  cancel_requested: { label: 'Đã gửi yêu cầu hủy cho shop', step: 6 },
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

const TRACKING_STEPS = ['Đơn mới', 'Đã xác nhận', 'Chuẩn bị hàng', 'Đang giao', 'Thành công']

const formatPrice = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`
const formatDate = (value) => (value ? new Date(value).toLocaleString('vi-VN') : '-')

const MyOrderDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentOrder, loadingCurrentOrder, cancellingOrderId, error } = useSelector((state) => state.order)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchOrderById(id))
    return () => dispatch(clearCurrentOrder())
  }, [dispatch, id])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearOrderError())
    }
  }, [dispatch, error])

  const handleConfirmCancel = async () => {
    if (!currentOrder) return

    const result = await dispatch(cancelOrder(currentOrder._id))
    if (cancelOrder.fulfilled.match(result)) {
      const status = result.payload?.order?.status
      if (status === 'cancel_requested') {
        toast.success('Đã gửi yêu cầu hủy đơn cho shop')
      } else {
        toast.success('Hủy đơn hàng thành công')
      }
      setShowCancelDialog(false)
    }
  }

  if (loadingCurrentOrder) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Đang tải chi tiết đơn hàng..." />
      </div>
    )
  }

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-600">Không tìm thấy đơn hàng.</p>
          <button onClick={() => navigate('/my-orders')} className="mt-4 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    )
  }

  const cfg = STATUS_CONFIG[currentOrder.status] || { label: currentOrder.status, step: 1 }
  const currentStep = cfg.step > 5 ? 5 : cfg.step
  const canCancel = !['shipping', 'delivered', 'cancelled', 'cancel_requested'].includes(currentOrder.status)

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/my-orders" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
          <FiArrowLeft /> Quay lại danh sách đơn hàng
        </Link>

        <div className="mt-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 md:p-7">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-5 border-b border-gray-100">
            <div>
              <p className="text-xl font-bold text-gray-900">Mã đơn: {currentOrder.orderCode}</p>
              <p className="text-sm text-gray-500 mt-1">Đặt lúc: {formatDate(currentOrder.createdAt)}</p>
            </div>
            <div className="lg:text-right">
              <p className="text-sm text-gray-500">Trạng thái hiện tại</p>
              <span className={`inline-flex text-xs font-semibold border px-3 py-1 rounded-full mt-1 ${STATUS_STYLE[currentOrder.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {cfg.label}
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(currentOrder.total)}</p>
            </div>
          </div>

          <div className="mt-6 hidden md:grid grid-cols-5 gap-2 max-w-5xl mx-auto">
            {TRACKING_STEPS.map((label, index) => {
              const stepNumber = index + 1
              const active = stepNumber <= currentStep
              const connectorActive = stepNumber < currentStep

              return (
                <div key={label} className="relative flex flex-col items-center text-center">
                  {index < TRACKING_STEPS.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full px-3">
                      <div className={`h-[2px] rounded-full ${connectorActive ? 'bg-black' : 'bg-gray-200'}`} />
                    </div>
                  )}
                  <span className={`relative z-10 w-8 h-8 rounded-full inline-flex items-center justify-center text-xs font-semibold border ${active ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-300'}`}>
                    {stepNumber}
                  </span>
                  <p className={`mt-2 text-sm ${active ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{label}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-4 md:hidden grid grid-cols-1 gap-2">
            {TRACKING_STEPS.map((label, index) => {
              const stepNumber = index + 1
              const active = stepNumber <= currentStep
              return (
                <div key={label} className={`rounded-xl border px-3 py-2 text-sm ${active ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-500'}`}>
                  Bước {stepNumber}: {label}
                </div>
              )
            })}
          </div>

          {(currentOrder.status === 'cancelled' || currentOrder.status === 'cancel_requested') && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              <FiXCircle />
              {currentOrder.status === 'cancel_requested' ? 'Đơn đang chờ shop xác nhận hủy' : 'Đơn đã được hủy'}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="font-semibold text-gray-900 mb-3">Thông tin nhận hàng</p>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="flex items-center gap-2"><FiUser /> {currentOrder.shippingAddress?.fullName || '-'}</p>
                <p className="flex items-center gap-2"><FiPhone /> {currentOrder.shippingAddress?.phone || '-'}</p>
                <p className="flex items-center gap-2"><FiMapPin /> {currentOrder.shippingAddress?.address || '-'}</p>
                <p className="flex items-center gap-2"><FiClock /> Cập nhật: {formatDate(currentOrder.updatedAt)}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="font-semibold text-gray-900 mb-3">Sản phẩm</p>
              <div className="space-y-2">
                {currentOrder.items?.map((item, idx) => (
                  <div key={`${item.product}-${idx}`} className="flex items-center justify-between gap-3 rounded-lg bg-white border border-gray-100 px-3 py-2.5 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No image</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-800 font-medium leading-tight line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Số lượng: <span className="font-medium text-gray-700">{item.quantity}</span>
                          {item.size ? (
                            <>
                              <br />
                              Size: <span className="font-medium text-gray-700">{item.size}</span>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {canCancel && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={() => setShowCancelDialog(true)}
                disabled={cancellingOrderId === currentOrder._id}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 px-4 py-2 font-semibold shadow-sm disabled:opacity-60"
              >
                {cancellingOrderId === currentOrder._id ? 'Đang xử lý...' : 'Hủy đơn hàng'}
              </button>
              <p className="text-xs text-gray-500 mt-2">Chỉ cho phép hủy trong 30 phút đầu sau khi đặt đơn.</p>
            </div>
          )}
        </div>
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 inline-flex items-center justify-center shrink-0 mt-0.5">
                <FiAlertTriangle />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Xác nhận hủy đơn hàng</p>
                <p className="text-sm text-gray-600 mt-1">Bạn có chắc chắn muốn hủy đơn <span className="font-semibold text-gray-900">{currentOrder.orderCode}</span> không?</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancellingOrderId === currentOrder._id}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {cancellingOrderId === currentOrder._id ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrderDetailPage
