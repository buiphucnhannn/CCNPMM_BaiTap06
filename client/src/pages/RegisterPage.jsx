import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, verifyOTP, clearError } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi'

const RegisterPage = () => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [otp, setOtp] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => { if (isAuthenticated) navigate('/') }, [isAuthenticated, navigate])
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error, dispatch])

  const handleRegister = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return toast.error('Mật khẩu xác nhận không khớp')
    dispatch(registerUser(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.')
        setStep(2)
      }
    })
  }

  const handleVerifyOTP = (e) => {
    e.preventDefault()
    dispatch(verifyOTP({ email: form.email, otp })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Kích hoạt tài khoản thành công! Bạn có thể đăng nhập.')
        navigate('/login')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2"><FiShoppingBag className="text-3xl text-black" /><span className="text-2xl font-bold text-gray-900"><span className="text-black">SNEAKER</span> STORE</span></Link>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Đăng ký</h2>
              <p className="text-gray-500 text-center text-sm mb-8">Tạo tài khoản mới</p>
              <form onSubmit={handleRegister} className="space-y-4">
                <div><label className="block text-sm text-gray-600 mb-1.5 font-medium">Họ và tên</label><div className="relative"><FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nhập họ và tên" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" required /></div></div>
                <div><label className="block text-sm text-gray-600 mb-1.5 font-medium">Email</label><div className="relative"><FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Nhập email" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" required /></div></div>
                <div><label className="block text-sm text-gray-600 mb-1.5 font-medium">Mật khẩu</label><div className="relative"><FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Tối thiểu 6 ký tự, có chữ hoa, chữ thường, số" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-12 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" required /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">{showPass ? <FiEyeOff /> : <FiEye />}</button></div></div>
                <div><label className="block text-sm text-gray-600 mb-1.5 font-medium">Xác nhận mật khẩu</label><div className="relative"><FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showConfirmPass ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Nhập lại mật khẩu" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-12 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" required /><button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">{showConfirmPass ? <FiEyeOff /> : <FiEye />}</button></div></div>
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-black/20 mt-2">{loading ? 'Đang xử lý...' : 'Đăng ký'}</button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Xác thực OTP</h2>
              <p className="text-gray-500 text-center text-sm mb-8">Nhập mã OTP 6 số đã gửi đến <strong className="text-black">{form.email}</strong></p>
              <form onSubmit={handleVerifyOTP} className="space-y-5 max-w-sm mx-auto">
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="Nhập mã OTP 6 số" className="w-full bg-white text-gray-900 placeholder:text-gray-400 placeholder:font-medium placeholder:tracking-[0.12em] rounded-xl py-4 px-4 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-center text-2xl tracking-[0.35em] font-bold" required />
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-black to-gray-700 hover:from-gray-900 hover:to-black text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 hover:shadow-lg">{loading ? 'Đang xác thực...' : 'Xác nhận OTP'}</button>
              </form>
            </>
          )}
          <p className="text-center text-gray-500 text-sm mt-6">Đã có tài khoản? <Link to="/login" className="text-black hover:text-gray-700 font-semibold transition-colors">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
