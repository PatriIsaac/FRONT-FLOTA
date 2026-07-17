import { api } from './api';
import type { CategoriaVehiculo, CreateCategoriaVehiculoDTO, UpdateCategoriaVehiculoDTO } from '../types/categoriaVehiculo';

export const categoriaVehiculoService = {
  getAll: async (): Promise<CategoriaVehiculo[]> => {
    const { data } = await api.get('/categorias-vehiculo');
    return data;
  },
  create: async (payload: CreateCategoriaVehiculoDTO): Promise<CategoriaVehiculo> => {
    const { data } = await api.post('/categorias-vehiculo', payload);
    return data;
  },
  update: async (id: number, payload: UpdateCategoriaVehiculoDTO): Promise<CategoriaVehiculo> => {
    const { data } = await api.patch(`/categorias-vehiculo/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias-vehiculo/${id}`);
  }
};
