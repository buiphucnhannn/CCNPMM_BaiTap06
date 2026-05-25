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

export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await orderApi.getMyOrders()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const fetchOrderById = createAsyncThunk('order/fetchById', async (orderId, { rejectWithValue }) => {
  try {
    const response = await orderApi.getOrderById(orderId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const cancelOrder = createAsyncThunk('order/cancel', async (orderId, { rejectWithValue }) => {
  try {
    const response = await orderApi.cancelOrder(orderId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    creating: false,
    loadingOrders: false,
    loadingCurrentOrder: false,
    cancellingOrderId: null,
    lastOrder: null,
    myOrders: [],
    currentOrder: null,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null
    },
    clearLastOrder: (state) => {
      state.lastOrder = null
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null
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
      .addCase(fetchMyOrders.pending, (state) => {
        state.loadingOrders = true
        state.error = null
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loadingOrders = false
        state.myOrders = action.payload.orders || []
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loadingOrders = false
        state.error = getErrorMessage(action.payload, 'Không thể tải danh sách đơn hàng')
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loadingCurrentOrder = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loadingCurrentOrder = false
        state.currentOrder = action.payload.order || null
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loadingCurrentOrder = false
        state.error = getErrorMessage(action.payload, 'Không thể tải chi tiết đơn hàng')
      })
      .addCase(cancelOrder.pending, (state, action) => {
        state.cancellingOrderId = action.meta.arg
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancellingOrderId = null
        const updatedOrder = action.payload.order
        state.myOrders = state.myOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
        if (state.currentOrder?._id === updatedOrder._id) {
          state.currentOrder = updatedOrder
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancellingOrderId = null
        state.error = getErrorMessage(action.payload, 'Không thể hủy đơn hàng')
      })
  },
})

export const { clearOrderError, clearLastOrder, clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
