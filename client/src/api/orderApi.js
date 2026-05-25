import axiosInstance from './axiosInstance'

const orderApi = {
  checkout: (data) => axiosInstance.post('/orders/checkout', data),
  getMyOrders: () => axiosInstance.get('/orders/my'),
  getOrderById: (id) => axiosInstance.get(`/orders/${id}`),
  cancelOrder: (id) => axiosInstance.patch(`/orders/${id}/cancel`),
}

export default orderApi
