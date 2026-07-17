import { api } from './api';
import type { Area } from '../types/area';

export const areaService = {
  getAll: async (): Promise<Area[]> => {
    const { data } = await api.get('/areas');
    return data;
  },
  create: async (payload: Omit<Area, 'areaId'>): Promise<Area> => {
    const { data } = await api.post('/areas', payload);
    return data;
  },
  update: async (id: number, payload: Partial<Omit<Area, 'areaId'>>): Promise<Area> => {
    const { data } = await api.patch(`/areas/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/areas/${id}`);
  }
};
