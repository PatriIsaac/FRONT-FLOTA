import { api } from './api';

export const inventarioService = {
  // --- Inventario Físico ---
  getAllInventarioFisico: async () => {
    const { data } = await api.get('/inventario/fisico');
    return data;
  },
  createInventarioFisico: async (payload: any) => {
    const { data } = await api.post('/inventario/fisico', payload);
    return data;
  },
  deleteInventarioFisico: async (id: number) => {
    await api.delete(`/inventario/fisico/${id}`);
  },

  // --- Llantas ---
  getAllLlantas: async () => {
    const { data } = await api.get('/inventario/llantas');
    return data;
  },
  createLlanta: async (payload: any) => {
    const { data } = await api.post('/inventario/llantas', payload);
    return data;
  },
  deleteLlanta: async (id: number) => {
    await api.delete(`/inventario/llantas/${id}`);
  },

  // --- Conjuntos ---
  getAllConjuntos: async () => {
    const { data } = await api.get('/inventario/conjuntos');
    return data;
  },
  createConjunto: async (payload: any) => {
    const { data } = await api.post('/inventario/conjuntos', payload);
    return data;
  },
  deleteConjunto: async (id: number) => {
    await api.delete(`/inventario/conjuntos/${id}`);
  }
};
