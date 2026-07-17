import { api } from './api';
import type { Taller, CreateTallerDTO, UpdateTallerDTO } from '../types/taller';

export const tallerService = {
  getAll: async (): Promise<Taller[]> => {
    const { data } = await api.get('/talleres');
    return data;
  },
  create: async (payload: CreateTallerDTO): Promise<Taller> => {
    const { data } = await api.post('/talleres', payload);
    return data;
  },
  update: async (id: number, payload: UpdateTallerDTO): Promise<Taller> => {
    const { data } = await api.patch(`/talleres/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/talleres/${id}`);
  }
};
