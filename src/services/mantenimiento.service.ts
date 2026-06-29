import { api } from './api';
import type { OrdenServicio, CreateOrdenServicioDTO, UpdateOrdenServicioDTO } from '../types/mantenimiento';

export const mantenimientoService = {
  getAll: async (): Promise<OrdenServicio[]> => {
    const { data } = await api.get('/mantenimientos');
    return data;
  },
  getById: async (id: number): Promise<OrdenServicio> => {
    const { data } = await api.get(`/mantenimientos/${id}`);
    return data;
  },
  create: async (dto: CreateOrdenServicioDTO): Promise<OrdenServicio> => {
    const { data } = await api.post('/mantenimientos', dto);
    return data;
  },
  update: async (id: number, dto: UpdateOrdenServicioDTO): Promise<OrdenServicio> => {
    const { data } = await api.patch(`/mantenimientos/${id}`, dto);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/mantenimientos/${id}`);
  }
};
