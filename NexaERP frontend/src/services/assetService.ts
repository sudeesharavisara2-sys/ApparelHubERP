import api from './api';
import type { PageResponse } from './employeeService';

export interface Asset {
  id: number;
  assetCode: string;
  name: string;
  category?: string;
  description?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  location?: string;
  assignedTo?: { id: number; fullName: string };
  serialNumber?: string;
  status: string;
}

export interface AssetMaintenance {
  id: number;
  asset?: { id: number; name: string; assetCode: string };
  maintenanceType?: string;
  description?: string;
  scheduledDate?: string;
  completedDate?: string;
  cost?: number;
  performedBy?: string;
  status: string;
}

export interface AssetTransfer {
  id: number;
  asset?: { id: number; name: string; assetCode: string };
  fromEmployee?: { id: number; fullName: string };
  toEmployee?: { id: number; fullName: string };
  fromLocation?: string;
  toLocation?: string;
  transferDate: string;
  reason?: string;
  status: string;
}

export interface AssetDepreciation {
  id: number;
  asset?: { id: number; name: string };
  periodYear: number;
  periodMonth: number;
  openingValue?: number;
  depreciation?: number;
  closingValue?: number;
  method?: string;
}

const assetService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<Asset>> {
    const res = await api.get('/assets', { params });
    return res.data.data;
  },
  async create(data: Partial<Asset>): Promise<Asset> {
    const res = await api.post('/assets', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<Asset>): Promise<Asset> {
    const res = await api.put(`/assets/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/assets/${id}`);
  },

  async getMaintenance(params?: { page?: number; size?: number }): Promise<PageResponse<AssetMaintenance>> {
    const res = await api.get('/assets/maintenance', { params });
    return res.data.data;
  },
  async createMaintenance(data: Partial<AssetMaintenance>): Promise<AssetMaintenance> {
    const res = await api.post('/assets/maintenance', data);
    return res.data.data;
  },
  async updateMaintenance(id: number, data: Partial<AssetMaintenance>): Promise<AssetMaintenance> {
    const res = await api.put(`/assets/maintenance/${id}`, data);
    return res.data.data;
  },
  async deleteMaintenance(id: number): Promise<void> {
    await api.delete(`/assets/maintenance/${id}`);
  },

  async getTransfers(params?: { page?: number; size?: number }): Promise<PageResponse<AssetTransfer>> {
    const res = await api.get('/assets/transfers', { params });
    return res.data.data;
  },
  async createTransfer(data: Partial<AssetTransfer>): Promise<AssetTransfer> {
    const res = await api.post('/assets/transfers', data);
    return res.data.data;
  },
  async updateTransfer(id: number, data: Partial<AssetTransfer>): Promise<AssetTransfer> {
    const res = await api.put(`/assets/transfers/${id}`, data);
    return res.data.data;
  },
  async deleteTransfer(id: number): Promise<void> {
    await api.delete(`/assets/transfers/${id}`);
  },

  async getDepreciation(params?: { page?: number; size?: number }): Promise<PageResponse<AssetDepreciation>> {
    const res = await api.get('/assets/depreciation', { params });
    return res.data.data;
  },
  async createDepreciation(data: Partial<AssetDepreciation>): Promise<AssetDepreciation> {
    const res = await api.post('/assets/depreciation', data);
    return res.data.data;
  },
};

export default assetService;
