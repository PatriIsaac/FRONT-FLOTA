import { api } from './api';
import type { CostoFijoMensual } from '../types/costo';

export const costoService = {
  getAll: async (): Promise<CostoFijoMensual[]> => {
    const { data } = await api.get('/costos-fijos-mensuales');
    return data;
  },
  create: async (costo: Omit<CostoFijoMensual, 'cfmId' | 'vehiculo'>): Promise<CostoFijoMensual> => {
    const { data } = await api.post('/costos-fijos-mensuales', costo);
    return data;
  },
  update: async (id: number, costo: Partial<CostoFijoMensual>): Promise<CostoFijoMensual> => {
    const { data } = await api.patch(`/costos-fijos-mensuales/${id}`, costo);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/costos-fijos-mensuales/${id}`);
  }
};
