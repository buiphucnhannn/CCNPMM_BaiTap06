import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, updateProfile, clearError } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiShield } from 'react-icons/fi'

const EditProfilePage = () => {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' })

  useEffect(() => { dispatch(getProfile()) }, [dispatch])

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName || '', phone: user.phone || '', address: user.address || '' })
  }, [user])

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateProfile(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') toast.success('Cập nhật thông tin thành công!')
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Thông tin cá nhân</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-black mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{user?.fullName}</h3>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                <FiShield className="text-xs" />
                {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                Tham gia: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Chỉnh sửa thông tin</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={user?.email || ''} disabled className="w-full bg-gray-50 text-gray-500 rounded-xl py-3 pl-10 pr-4 border border-gray-200 cursor-not-allowed" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">Họ và tên</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nhập họ và tên" className="w-full bg-white text-gray-800 rounded-xl py-3 pl-10 pr-4 border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">Số điện thoại</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Nhập số điện thoại" className="w-full bg-white text-gray-800 rounded-xl py-3 pl-10 pr-4 border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">Địa chỉ</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3.5 top-3 text-gray-400" />
                    <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Nhập địa chỉ" rows={3} className="w-full bg-white text-gray-800 rounded-xl py-3 pl-10 pr-4 border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-black/20">
                  <FiSave />
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage
