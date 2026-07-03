import api from '../api/axiosConfig';

export const purchaseOrderService = {
  // Get all purchase orders
  getAll: async () => {
    const response = await api.get('/api/PurchaseOrder');
    return response.data;
  },

  // Get purchase order by ID
  getById: async (id) => {
    const response = await api.get(`/api/PurchaseOrder/${id}`);
    return response.data;
  },

  // Get orders by supplier ID
  getBySupplier: async (supplierId) => {
    const response = await api.get(`/api/PurchaseOrder/supplier/${supplierId}`);
    return response.data;
  },

  // Create purchase order
  create: async (data) => {
    const response = await api.post('/api/PurchaseOrder', data);
    return response.data;
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await api.put(`/api/PurchaseOrder/${id}/status`, { status });
    return response.data;
  },

  // Receive order (updates stock)
  receiveOrder: async (id) => {
    const response = await api.post(`/api/PurchaseOrder/${id}/receive`);
    return response.data;
  },

  // Get reorder suggestions
  getReorderSuggestions: async () => {
    const response = await api.get('/api/PurchaseOrder/reorder/suggestions');
    return response.data;
  }
};