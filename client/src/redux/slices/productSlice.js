import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productApi from '../../api/productApi'

export const fetchHomeData = createAsyncThunk('product/fetchHomeData', async (_, { rejectWithValue }) => {
  try {
    const response = await productApi.getHomeData()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const fetchHomeRanking = createAsyncThunk('product/fetchHomeRanking', async (params, { rejectWithValue }) => {
  try {
    const response = await productApi.getHomeRanking(params)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error.response?.data || { message: 'Lỗi kết nối server' }), type: params?.type })
  }
})

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (params = {}, { rejectWithValue }) => {
  try {
    const { append, ...apiParams } = params
    const response = await productApi.getProducts(apiParams)
    return { ...response.data, append: Boolean(append) }
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const fetchProductById = createAsyncThunk('product/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    const response = await productApi.getProductById(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const searchProducts = createAsyncThunk('product/searchProducts', async (params, { rejectWithValue }) => {
  try {
    const response = await productApi.searchProducts(params)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

export const fetchRelatedProducts = createAsyncThunk('product/fetchRelatedProducts', async (id, { rejectWithValue }) => {
  try {
    const response = await productApi.getRelatedProducts(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi kết nối server' })
  }
})

const initialRankState = {
  products: [],
  page: 1,
  totalPages: 1,
  total: 0,
  loading: false,
}

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    homeData: {
      saleProducts: [],
      newestProducts: [],
      bestSellers: [],
    },
    homeRankings: {
      best_seller: { ...initialRankState },
      most_viewed: { ...initialRankState },
    },
    selectedProduct: null,
    relatedProducts: [],
    loading: false,
    loadingMore: false,
    error: null,
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      hasMore: false,
    },
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
      state.relatedProducts = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false
        state.homeData = {
          saleProducts: action.payload.saleProducts,
          newestProducts: action.payload.newestProducts,
          bestSellers: action.payload.bestSellers,
        }
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      .addCase(fetchHomeRanking.pending, (state, action) => {
        const type = action.meta.arg?.type || 'best_seller'
        if (state.homeRankings[type]) {
          state.homeRankings[type].loading = true
        }
      })
      .addCase(fetchHomeRanking.fulfilled, (state, action) => {
        const type = action.payload.type || 'best_seller'
        if (state.homeRankings[type]) {
          state.homeRankings[type] = {
            products: action.payload.products,
            page: action.payload.page,
            totalPages: action.payload.totalPages,
            total: action.payload.total,
            loading: false,
          }
        }
      })
      .addCase(fetchHomeRanking.rejected, (state, action) => {
        const type = action.payload?.type || action.meta.arg?.type || 'best_seller'
        if (state.homeRankings[type]) {
          state.homeRankings[type].loading = false
        }
        state.error = action.payload?.message
      })

      .addCase(fetchProducts.pending, (state, action) => {
        state.error = null
        if (action.meta.arg?.append) {
          state.loadingMore = true
        } else {
          state.loading = true
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.loadingMore = false
        state.products = action.payload.append
          ? [...state.products, ...action.payload.products]
          : action.payload.products
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          hasMore: action.payload.page < action.payload.totalPages,
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.loadingMore = false
        state.error = action.payload?.message
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload.product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      .addCase(searchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          hasMore: action.payload.page < action.payload.totalPages,
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload.products
      })
  },
})

export const { clearSelectedProduct } = productSlice.actions
export default productSlice.reducer
