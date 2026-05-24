import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword, verifyResetOTP, resetPassword, clearError } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'
import { FiMail, FiLock, FiShoppingBag } from 'react-icons/fi'

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error, dispatch])

  const handleSendOTP = (e) => {
    e.preventDefault()
    dispatch(forgotPassword({ email })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('OTP đã gửi đến email của bạn')
        setStep(2)
      }
    })
  }

  const handleVerifyOTP = (e) => {
    e.preventDefault()
    dispatch(verifyResetOTP({ email, otp })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setResetToken(res.payload.resetToken)
        toast.success('Xác thực OTP thành công')
        setStep(3)
      }
    })
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return toast.error('Mật khẩu không khớp')
    dispatch(resetPassword({ email, resetToken, newPassword, confirmPassword })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Đặt lại mật khẩu thành công!')
        navigate('/login')
      }
    })
  }

  const steps = [{ num: 1, label: 'Email' }, { num: 2, label: 'OTP' }, { num: 3, label: 'Mật khẩu mới' }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8"><Link to="/" className="inline-flex items-center gap-2"><FiShoppingBag className="text-3xl text-black" /><span className="text-2xl font-bold text-gray-900"><span className="text-black">SNEAKER</span> STORE</span></Link></div>
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Quên mật khẩu</h2>

          <div className="flex items-center justify-center gap-2 mb-8 mt-4">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.num ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>{s.num}</div>
                <span className={`text-xs hidden sm:block ${step >= s.num ? 'text-black' : 'text-gray-500'}`}>{s.label}</span>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 ${step > s.num ? 'bg-black' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <p className="text-gray-500 text-sm text-center">Nhập email đã đăng ký để nhận mã OTP</p>
              <div className="relative"><FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" required /></div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50">{loading ? 'Đang gửi...' : 'Gửi mã OTP'}</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <p className="text-gray-500 text-sm text-center">Nhập mã OTP đã gửi đến <strong className="text-black">{email}</strong></p>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="Nhập OTP 6 số" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-4 px-4 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-center text-2xl tracking-[0.5em] font-bold" required />
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50">{loading ? 'Đang xác thực...' : 'Xác nhận OTP'}</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-gray-500 text-sm text-center">Nhập mật khẩu mới cho tài khoản của bạn</p>
              <div className="relative"><FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" required /></div>
              <div className="relative"><FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Xác nhận mật khẩu mới" className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" required /></div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-black to-gray-700 hover:from-gray-900 hover:to-black text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50">{loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}</button>
            </form>
          )}

          <p className="text-center text-gray-500 text-sm mt-6"><Link to="/login" className="text-black hover:text-gray-700 font-semibold">← Quay lại đăng nhập</Link></p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
