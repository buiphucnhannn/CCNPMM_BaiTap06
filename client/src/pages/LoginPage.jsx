import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, clearError } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'
import { FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => { if (isAuthenticated) navigate('/') }, [isAuthenticated, navigate])
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Đăng nhập thành công!')
        navigate('/')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <FiShoppingBag className="text-3xl text-black" />
            <span className="text-2xl font-bold text-gray-900"><span className="text-black">SNEAKER</span> STORE</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Đăng nhập</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Chào mừng bạn trở lại!</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Nhập email của bạn" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" required />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Mật khẩu</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Nhập mật khẩu" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-12 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">{showPass ? <FiEyeOff /> : <FiEye />}</button>
              </div>
            </div>

            <div className="flex justify-end"><Link to="/forgot-password" className="text-sm text-gray-700 hover:text-black transition-colors">Quên mật khẩu?</Link></div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-black/20">
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">Chưa có tài khoản? <Link to="/register" className="text-black hover:text-gray-700 font-semibold transition-colors">Đăng ký ngay</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
