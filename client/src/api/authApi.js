import axiosInstance from './axiosInstance'

const authApi = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  verifyOTP: (data) => axiosInstance.post('/auth/verify-otp', data),
  logout: () => axiosInstance.post('/auth/logout'),
  forgotPassword: (data) => axiosInstance.post('/auth/forgot-password', data),
  verifyResetOTP: (data) => axiosInstance.post('/auth/verify-reset-otp', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  getProfile: () => axiosInstance.get('/user/profile'),
  updateProfile: (data) => axiosInstance.put('/user/profile', data),
}

export default authApi
