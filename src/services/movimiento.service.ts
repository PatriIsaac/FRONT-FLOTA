import { api } from './api';
import type { MovimientoDiario, CreateMovimientoDiarioDTO, UpdateMovimientoDiarioDTO } from '../types/movimiento';

export const movimientoService = {
  getAll: async (): Promise<MovimientoDiario[]> => {
    const { data } = await api.get('/movimientos');
    return data;
  },
  getById: async (id: number): Promise<MovimientoDiario> => {
    const { data } = await api.get(`/movimientos/${id}`);
    return data;
  },
  create: async (dto: CreateMovimientoDiarioDTO): Promise<MovimientoDiario> => {
    const { data } = await api.post('/movimientos', dto);
    return data;
  },
  update: async (id: number, dto: UpdateMovimientoDiarioDTO): Promise<MovimientoDiario> => {
    const { data } = await api.patch(`/movimientos/${id}`, dto);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/movimientos/${id}`);
  }
};
