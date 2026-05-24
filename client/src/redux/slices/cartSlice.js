import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import cartApi from '../../api/cartApi'
import { logoutUser } from './authSlice'

const getErrorMessage = (payload, fallback) => {
  if (!payload) return fallback
  if (payload.message) return payload.message
  return fallback
}

const applyCartState = (state, payload) => {
  const cart = payload?.cart || payload || {}
  state.items = cart.items || []
  state.totalItems = cart.totalItems || 0
  state.totalPrice = cart.totalPrice || 0
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartApi.getCart()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const addCartItem = createAsyncThunk('cart/addItem', async (data, { rejectWithValue }) => {
  try {
    const response = await cartApi.addItem(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const response = await cartApi.updateItem(itemId, { quantity })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const removeCartItem = createAsyncThunk('cart/removeItem', async (itemId, { rejectWithValue }) => {
  try {
    const response = await cartApi.removeItem(itemId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartApi.clearCart()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  processing: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: () => ({ ...initialState }),
    clearCartError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        applyCartState(state, action.payload)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload, 'Không thể tải giỏ hàng')
      })

      .addCase(addCartItem.pending, (state) => {
        state.processing = true
        state.error = null
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.processing = false
        applyCartState(state, action.payload)
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.processing = false
        state.error = getErrorMessage(action.payload, 'Không thể thêm vào giỏ hàng')
      })

      .addCase(updateCartItem.pending, (state) => {
        state.processing = true
        state.error = null
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.processing = false
        applyCartState(state, action.payload)
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.processing = false
        state.error = getErrorMessage(action.payload, 'Không thể cập nhật giỏ hàng')
      })

      .addCase(removeCartItem.pending, (state) => {
        state.processing = true
        state.error = null
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.processing = false
        applyCartState(state, action.payload)
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.processing = false
        state.error = getErrorMessage(action.payload, 'Không thể xóa sản phẩm')
      })

      .addCase(clearCart.pending, (state) => {
        state.processing = true
        state.error = null
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.processing = false
        applyCartState(state, action.payload)
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.processing = false
        state.error = getErrorMessage(action.payload, 'Không thể xóa giỏ hàng')
      })

      .addCase(logoutUser.fulfilled, () => ({ ...initialState }))
  },
})

export const { resetCart, clearCartError } = cartSlice.actions
export default cartSlice.reducer
