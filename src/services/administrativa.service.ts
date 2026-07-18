import { api } from './api';

export const administrativaService = {
  // Materiales
  getMateriales: async () => {
    const { data } = await api.get('/materiales');
    return data;
  },
  createMaterial: async (payload: any) => {
    const { data } = await api.post('/materiales', payload);
    return data;
  },
  updateMaterial: async (id: number, payload: any) => {
    const { data } = await api.patch(`/materiales/${id}`, payload);
    return data;
  },
  deleteMaterial: async (id: number) => {
    await api.delete(`/materiales/${id}`);
  },

  // Solicitudes
  getSolicitudes: async () => {
    const { data } = await api.get('/solicitudes-material');
    return data;
  },
  createSolicitud: async (payload: any) => {
    const { data } = await api.post('/solicitudes-material', payload);
    return data;
  },
  updateEstadoSolicitud: async (id: number, estado: string) => {
    const { data } = await api.patch(`/solicitudes-material/${id}/estado`, { estado });
    return data;
  },
  deleteSolicitud: async (id: number) => {
    await api.delete(`/solicitudes-material/${id}`);
  },

  // Documentos Personales
  getDocumentos: async () => {
    const { data } = await api.get('/documentos-personales');
    return data;
  },
  createDocumento: async (payload: any) => {
    const { data } = await api.post('/documentos-personales', payload);
    return data;
  },
  deleteDocumento: async (id: number) => {
    await api.delete(`/documentos-personales/${id}`);
  }
};
