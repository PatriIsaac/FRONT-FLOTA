import { api } from './api';
import type { User } from '../context/AuthContext';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  register: async (credentials: any): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  }
};
