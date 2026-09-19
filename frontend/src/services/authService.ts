import api from './api';
import { User } from '../types';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('crackit_auth_token', res.data.token);
      localStorage.setItem('crackit_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async register(name: string, email: string, password: string, role?: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/register', { name, email, password, role });
    if (res.data.token) {
      localStorage.setItem('crackit_auth_token', res.data.token);
      localStorage.setItem('crackit_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data.user;
  },

  logout(): void {
    localStorage.removeItem('crackit_auth_token');
    localStorage.removeItem('crackit_user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('crackit_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('crackit_auth_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('crackit_auth_token');
  }
};
