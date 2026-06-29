import { api } from './api';
import type { Vehiculo, CreateVehiculoDTO, UpdateVehiculoDTO } from '../types/vehiculo';

export const vehiculoService = {
  getAll: async (): Promise<Vehiculo[]> => {
    const { data } = await api.get('/vehiculos');
    return data;
  },

  getById: async (id: number): Promise<Vehiculo> => {
    const { data } = await api.get(`/vehiculos/${id}`);
    return data;
  },

  create: async (vehiculo: CreateVehiculoDTO): Promise<Vehiculo> => {
    const { data } = await api.post('/vehiculos', vehiculo);
    return data;
  },

  update: async (id: number, vehiculo: UpdateVehiculoDTO): Promise<Vehiculo> => {
    const { data } = await api.patch(`/vehiculos/${id}`, vehiculo);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/vehiculos/${id}`);
  }
};
