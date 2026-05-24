import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authApi from '../../api/authApi'

// ==================== ASYNC THUNKS ====================
const getErrorMessage = (payload, fallback) => {
  if (!payload) return fallback
  if (payload.message) return payload.message
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const fieldLabels = {
      fullName: 'Họ và tên',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      otp: 'Mã OTP',
      newPassword: 'Mật khẩu mới',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
    }

    const details = payload.errors
      .map((err) => {
        const field = err.path || err.param
        const label = fieldLabels[field] || field || 'Trường dữ liệu'
        return `${label}: ${err.msg}`
      })
      .join('\n')

    return details || fallback
  }
  return fallback
}

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await authApi.register(userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.verifyOTP(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.forgotPassword(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const verifyResetOTP = createAsyncThunk('auth/verifyResetOTP', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.verifyResetOTP(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.resetPassword(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getProfile()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.updateProfile(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.logout()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

// ==================== SLICE ====================

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.message = action.payload.message
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload, 'Đăng nhập thất bại')
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload, 'Đăng ký thất bại')
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload, 'Xác thực OTP thất bại')
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload, 'Gửi OTP thất bại')
      })

      // Verify Reset OTP
      .addCase(verifyResetOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyResetOTP.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message
      })
      .addCase(verifyResetOTP.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload, 'Xác thực OTP thất bại')
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload, 'Đặt lại mật khẩu thất bại')
      })

      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.message = action.payload.message
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload, 'Cập nhật thất bại')
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.message = 'Đăng xuất thành công'
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      })
  },
})

export const { clearError, clearMessage } = authSlice.actions
export default authSlice.reducer
