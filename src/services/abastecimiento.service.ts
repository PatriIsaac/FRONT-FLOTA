import { api } from './api';
import type { Abastecimiento, CreateAbastecimientoDTO, UpdateAbastecimientoDTO } from '../types/abastecimiento';

export const abastecimientoService = {
  getAll: async (): Promise<Abastecimiento[]> => {
    const { data } = await api.get('/abastecimientos');
    return data;
  },
  getById: async (id: number): Promise<Abastecimiento> => {
    const { data } = await api.get(`/abastecimientos/${id}`);
    return data;
  },
  create: async (dto: CreateAbastecimientoDTO): Promise<Abastecimiento> => {
    const { data } = await api.post('/abastecimientos', dto);
    return data;
  },
  update: async (id: number, dto: UpdateAbastecimientoDTO): Promise<Abastecimiento> => {
    const { data } = await api.patch(`/abastecimientos/${id}`, dto);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/abastecimientos/${id}`);
  }
};
