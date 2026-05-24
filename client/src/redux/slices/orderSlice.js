import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderApi from '../../api/orderApi'

const getErrorMessage = (payload, fallback) => {
  if (!payload) return fallback
  if (payload.message) return payload.message
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    return payload.errors.map((err) => err.msg).join('\n') || fallback
  }
  return fallback
}

export const createOrder = createAsyncThunk('order/create', async (data, { rejectWithValue }) => {
  try {
    const response = await orderApi.checkout(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    creating: false,
    lastOrder: null,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null
    },
    clearLastOrder: (state) => {
      state.lastOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false
        state.lastOrder = action.payload.order
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false
        state.error = getErrorMessage(action.payload, 'Đặt hàng thất bại')
      })
  },
})

export const { clearOrderError, clearLastOrder } = orderSlice.actions
export default orderSlice.reducer
