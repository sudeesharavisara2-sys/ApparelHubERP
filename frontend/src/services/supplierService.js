import api from '../api/axiosConfig';

export const supplierService = {
  getAll: async () => {
    const response = await api.get('/api/Supplier');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/Supplier', data);
    return response.data;
  },
  toggleStatus: async (id) => {
    const response = await api.patch(`/api/Supplier/${id}/toggle-status`);
    return response.data;
  }
};