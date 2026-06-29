import { api } from './api';

export const mantenimientoDetalleService = {
  getAll: async () => {
    const { data } = await api.get('/mantenimientos/detalles');
    return data;
  },
  create: async (payload: any) => {
    const { data } = await api.post('/mantenimientos/detalles', payload);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/mantenimientos/detalles/${id}`);
  }
};

export const mantenimientoMensualService = {
  getAll: async () => {
    const { data } = await api.get('/mantenimientos/mensual');
    return data;
  },
  create: async (payload: any) => {
    const { data } = await api.post('/mantenimientos/mensual', payload);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/mantenimientos/mensual/${id}`);
  }
};
