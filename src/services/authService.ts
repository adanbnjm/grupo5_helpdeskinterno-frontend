import { api } from '../lib/axios';
import type { LoginCredenciales, LoginResponse } from '../types/users';

export const authService = {
  login: async (credentials: LoginCredenciales): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },
};