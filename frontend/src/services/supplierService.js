import api from '../api/axiosConfig';

export const supplierService = {
  getAll: async () => {
    const response = await api.get('/api/Supplier');
    return response.data;
  },
  getFiltered: async (params = {}) => {
    const response = await api.get('/api/Supplier/filtered', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/Supplier/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/Supplier', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/Supplier/${id}`, data);
    return response.data;
  },
  toggleStatus: async (id) => {
    const response = await api.patch(`/api/Supplier/${id}/toggle-status`);
    return response.data;
  },
  softDelete: async (id) => {
    const response = await api.delete(`/api/Supplier/${id}`);
    return response.data;
  },
  restore: async (id) => {
    const response = await api.patch(`/api/Supplier/${id}/restore`);
    return response.data;
  },
  bulkDelete: async (ids) => {
    const response = await api.delete('/api/Supplier/bulk-delete', { data: { ids } });
    return response.data;
  },
  getDeleted: async () => {
    const response = await api.get('/api/Supplier/deleted');
    return response.data;
  }
};