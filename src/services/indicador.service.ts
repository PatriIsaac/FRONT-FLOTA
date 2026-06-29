import { api } from './api';

export const indicadorService = {
  getAll: async () => {
    const { data } = await api.get('/indicadores');
    return data;
  },
  create: async (payload: any) => {
    const { data } = await api.post('/indicadores', payload);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/indicadores/${id}`);
  },
  getDashboard: async () => {
    const { data } = await api.get('/indicadores/dashboard');
    return data;
  }
};
