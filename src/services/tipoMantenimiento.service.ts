import { api } from './api';
import type { TipoMantenimiento } from '../types/tipoMantenimiento';

export const tipoMantenimientoService = {
  getAll: async (): Promise<TipoMantenimiento[]> => {
    const { data } = await api.get('/tipos-mantenimiento');
    return data;
  },
  create: async (payload: Omit<TipoMantenimiento, 'tipoId' | 'activo'>): Promise<TipoMantenimiento> => {
    const { data } = await api.post('/tipos-mantenimiento', payload);
    return data;
  },
  update: async (id: number, payload: Partial<Omit<TipoMantenimiento, 'tipoId'>>): Promise<TipoMantenimiento> => {
    const { data } = await api.patch(`/tipos-mantenimiento/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tipos-mantenimiento/${id}`);
  }
};
