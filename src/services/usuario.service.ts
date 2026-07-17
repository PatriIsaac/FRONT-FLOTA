import { api } from './api';

export const usuarioService = {
  getAllUsuarios: async () => {
    const { data } = await api.get('/usuarios');
    return data;
  },
  createUsuario: async (payload: any) => {
    const { data } = await api.post('/usuarios', payload);
    return data;
  },
  updateUsuario: async (id: number, payload: any) => {
    const { data } = await api.patch(`/usuarios/${id}`, payload);
    return data;
  },
  deleteUsuario: async (id: number) => {
    await api.delete(`/usuarios/${id}`);
  },

  getAllRoles: async () => {
    const { data } = await api.get('/usuarios/roles');
    return data;
  },
  createRol: async (payload: any) => {
    const { data } = await api.post('/usuarios/roles', payload);
    return data;
  },
  deleteRol: async (id: number) => {
    await api.delete(`/usuarios/roles/${id}`);
  }
};
