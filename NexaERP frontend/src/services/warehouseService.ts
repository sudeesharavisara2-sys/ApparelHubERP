import api from './api';
import type { PageResponse } from './employeeService';

export interface Warehouse {
  id: number;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  country?: string;
  isActive?: boolean;
}

const warehouseService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<Warehouse>> {
    const res = await api.get('/warehouses', { params });
    return res.data.data;
  },
  async getById(id: number): Promise<Warehouse> {
    const res = await api.get(`/warehouses/${id}`);
    return res.data.data;
  },
};

export default warehouseService;
