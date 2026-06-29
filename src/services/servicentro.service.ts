import { api } from './api';

export const servicentroService = {
  getAll: async () => {
    const { data } = await api.get('/configuracion/servicentros');
    return data;
  },
  create: async (payload: any) => {
    const { data } = await api.post('/configuracion/servicentros', payload);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/configuracion/servicentros/${id}`);
  }
};
