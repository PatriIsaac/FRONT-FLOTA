import { api } from './api';

export const almacenService = {
  // --- Materiales ---
  getAllMateriales: async () => {
    const { data } = await api.get('/almacen/materiales');
    return data;
  },
  createMaterial: async (payload: any) => {
    const { data } = await api.post('/almacen/materiales', payload);
    return data;
  },
  deleteMaterial: async (id: number) => {
    await api.delete(`/almacen/materiales/${id}`);
  },

  // --- Solicitudes ---
  getAllSolicitudes: async () => {
    const { data } = await api.get('/almacen/solicitudes');
    return data;
  },
  createSolicitud: async (payload: any) => {
    const { data } = await api.post('/almacen/solicitudes', payload);
    return data;
  },
  deleteSolicitud: async (id: number) => {
    await api.delete(`/almacen/solicitudes/${id}`);
  }
};
