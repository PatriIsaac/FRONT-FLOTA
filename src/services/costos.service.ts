import { api } from './api';

export const costosService = {
  // Fijos
  getAllFijos: async () => {
    const { data } = await api.get('/costos/fijos');
    return data;
  },
  createFijo: async (payload: any) => {
    const { data } = await api.post('/costos/fijos', payload);
    return data;
  },
  deleteFijo: async (id: number) => {
    await api.delete(`/costos/fijos/${id}`);
  },

  // Operacion
  getAllOperacion: async () => {
    const { data } = await api.get('/costos/operacion');
    return data;
  },
  createOperacion: async (payload: any) => {
    const { data } = await api.post('/costos/operacion', payload);
    return data;
  },
  deleteOperacion: async (id: number) => {
    await api.delete(`/costos/operacion/${id}`);
  },

  // Promedio Anual
  getAllPromedioAnual: async () => {
    const { data } = await api.get('/costos/promedio-anual');
    return data;
  },
  createPromedioAnual: async (payload: any) => {
    const { data } = await api.post('/costos/promedio-anual', payload);
    return data;
  },
};
