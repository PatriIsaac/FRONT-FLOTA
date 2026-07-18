import { api } from './api';

export const inventarioService = {
  // --- Inventario Físico ---
  getAllInventarioFisico: async () => {
    const { data } = await api.get('/inventario-unidad');
    return data;
  },
  createInventarioFisico: async (payload: any) => {
    const { data } = await api.post('/inventario-unidad', payload);
    return data;
  },
  deleteInventarioFisico: async (id: number) => {
    await api.delete(`/inventario-unidad/${id}`);
  },

  // --- Llantas ---
  getAllLlantas: async () => {
    const { data } = await api.get('/llantas');
    return data;
  },
  createLlanta: async (payload: any) => {
    const { data } = await api.post('/llantas', payload);
    return data;
  },
  deleteLlanta: async (id: number) => {
    await api.delete(`/llantas/${id}`);
  },

  // --- Conjuntos ---
  getAllConjuntos: async () => {
    const { data } = await api.get('/conjuntos');
    return data;
  },
  createConjunto: async (payload: any) => {
    const { data } = await api.post('/conjuntos', payload);
    return data;
  },
  deleteConjunto: async (id: number) => {
    await api.delete(`/conjuntos/${id}`);
  }
};
