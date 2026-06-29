import { api } from './api';
import type { Conductor, CreateConductorDTO, UpdateConductorDTO } from '../types/conductor';

export const conductorService = {
  getAll: async (): Promise<Conductor[]> => {
    const { data } = await api.get('/conductores');
    return data;
  },
  getById: async (id: number): Promise<Conductor> => {
    const { data } = await api.get(`/conductores/${id}`);
    return data;
  },
  create: async (dto: CreateConductorDTO): Promise<Conductor> => {
    const { data } = await api.post('/conductores', dto);
    return data;
  },
  update: async (id: number, dto: UpdateConductorDTO): Promise<Conductor> => {
    const { data } = await api.patch(`/conductores/${id}`, dto);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/conductores/${id}`);
  }
};
