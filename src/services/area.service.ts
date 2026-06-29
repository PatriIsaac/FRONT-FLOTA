import { api } from './api';

export const areaService = {
  getAll: async () => {
    const { data } = await api.get('/configuracion/areas');
    return data;
  },
  create: async (payload: any) => {
    const { data } = await api.post('/configuracion/areas', payload);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/configuracion/areas/${id}`);
  }
};
