import { api } from './api';
import type { Asignacion } from '../types/asignacion';

export const asignacionService = {
  getAll: async (): Promise<Asignacion[]> => {
    const { data } = await api.get('/asignaciones');
    return data;
  },
  create: async (asignacion: Omit<Asignacion, 'asignacionId' | 'vehiculo' | 'area' | 'conductor'>): Promise<Asignacion> => {
    const { data } = await api.post('/asignaciones', asignacion);
    return data;
  },
  update: async (id: number, asignacion: Partial<Asignacion>): Promise<Asignacion> => {
    const { data } = await api.patch(`/asignaciones/${id}`, asignacion);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/asignaciones/${id}`);
  }
};
