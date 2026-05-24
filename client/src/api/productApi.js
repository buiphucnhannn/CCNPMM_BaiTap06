import axiosInstance from './axiosInstance'

const productApi = {
  getHomeData: () => axiosInstance.get('/products/home'),
  getHomeRanking: (params) => axiosInstance.get('/products/home/rankings', { params }),
  getProducts: (params) => axiosInstance.get('/products', { params }),
  getProductById: (id) => axiosInstance.get(`/products/${id}`),
  searchProducts: (params) => axiosInstance.get('/products/search', { params }),
  getRelatedProducts: (id) => axiosInstance.get(`/products/${id}/related`),
}

export default productApi
