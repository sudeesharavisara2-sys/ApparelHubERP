import api from '../api/axiosConfig';

export const supplierService = {
  // Get all suppliers (basic)
  getAll: async () => {
    const response = await api.get('/api/Supplier');
    return response.data;
  },

  // Get filtered suppliers (search + pagination)
  getFiltered: async (params = {}) => {
    const response = await api.get('/api/Supplier/filtered', { params });
    return response.data;
  },

  // Get supplier by ID
  getById: async (id) => {
    const response = await api.get(`/api/Supplier/${id}`);
    return response.data;
  },

  // Create supplier
  create: async (data) => {
    const response = await api.post('/api/Supplier', data);
    return response.data;
  },

  // Update supplier
  update: async (id, data) => {
    const response = await api.put(`/api/Supplier/${id}`, data);
    return response.data;
  },

  // Toggle supplier status
  toggleStatus: async (id) => {
    const response = await api.patch(`/api/Supplier/${id}/toggle-status`);
    return response.data;
  },

  // Soft delete supplier
  softDelete: async (id) => {
    const response = await api.delete(`/api/Supplier/${id}`);
    return response.data;
  },

  // Restore supplier
  restore: async (id) => {
    const response = await api.patch(`/api/Supplier/${id}/restore`);
    return response.data;
  },

  // Bulk delete suppliers
  bulkDelete: async (ids) => {
    const response = await api.delete('/api/Supplier/bulk-delete', { data: { ids } });
    return response.data;
  },

  // Get deleted suppliers
  getDeleted: async () => {
    const response = await api.get('/api/Supplier/deleted');
    return response.data;
  }
};