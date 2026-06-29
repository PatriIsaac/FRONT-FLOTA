import { api } from './api';

export const tallerService = {
  getAll: async () => {
    const { data } = await api.get('/configuracion/talleres');
    return data;
  },
  create: async (payload: any) => {
    const { data } = await api.post('/configuracion/talleres', payload);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/configuracion/talleres/${id}`);
  }
};
