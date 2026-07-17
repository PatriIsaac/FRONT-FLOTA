import { api } from './api';
import type { Servicentro, CreateServicentroDTO, UpdateServicentroDTO } from '../types/servicentro';

export const servicentroService = {
  getAll: async (): Promise<Servicentro[]> => {
    const { data } = await api.get('/servicentros');
    return data;
  },
  create: async (payload: CreateServicentroDTO): Promise<Servicentro> => {
    const { data } = await api.post('/servicentros', payload);
    return data;
  },
  update: async (id: number, payload: UpdateServicentroDTO): Promise<Servicentro> => {
    const { data } = await api.patch(`/servicentros/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/servicentros/${id}`);
  }
};
