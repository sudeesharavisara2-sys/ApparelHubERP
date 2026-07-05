import api from '../api/axiosConfig';

export const purchaseOrderService = {
  // Basic CRUD
  getAll: async () => {
    const response = await api.get('/api/PurchaseOrder');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/PurchaseOrder/${id}`);
    return response.data;
  },
  getBySupplier: async (supplierId) => {
    const response = await api.get(`/api/PurchaseOrder/supplier/${supplierId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/PurchaseOrder', data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/api/PurchaseOrder/${id}/status`, { status });
    return response.data;
  },
  receiveOrder: async (id) => {
    const response = await api.post(`/api/PurchaseOrder/${id}/receive`);
    return response.data;
  },
  getReorderSuggestions: async () => {
    const response = await api.get('/api/PurchaseOrder/reorder/suggestions');
    return response.data;
  },

  // ✅ Advanced methods – MUST HAVE THESE!
  getFiltered: async (params = {}) => {
    const response = await api.get('/api/PurchaseOrder/filtered', { params });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/api/PurchaseOrder/stats');
    return response.data;
  },
  softDelete: async (id) => {
    const response = await api.delete(`/api/PurchaseOrder/${id}`);
    return response.data;
  },
  restore: async (id) => {
    const response = await api.patch(`/api/PurchaseOrder/${id}/restore`);
    return response.data;
  },
  bulkDelete: async (ids) => {
    const response = await api.delete('/api/PurchaseOrder/bulk-delete', { data: { ids } });
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.post(`/api/PurchaseOrder/${id}/cancel`);
    return response.data;
  },
  updateItems: async (id, items) => {
    const response = await api.put(`/api/PurchaseOrder/${id}/items`, { items });
    return response.data;
  },
  removeItem: async (orderId, itemId) => {
    const response = await api.delete(`/api/PurchaseOrder/${orderId}/items/${itemId}`);
    return response.data;
  },
  getDeleted: async () => {
    const response = await api.get('/api/PurchaseOrder/deleted');
    return response.data;
  }
};