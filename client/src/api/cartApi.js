import axiosInstance from './axiosInstance'

const cartApi = {
  getCart: () => axiosInstance.get('/cart'),
  addItem: (data) => axiosInstance.post('/cart/items', data),
  updateItem: (itemId, data) => axiosInstance.patch(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => axiosInstance.delete(`/cart/items/${itemId}`),
  clearCart: () => axiosInstance.delete('/cart'),
}

export default cartApi
