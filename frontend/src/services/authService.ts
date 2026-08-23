import { apiClient } from '@/lib/apiClient';
import { RegisterRequest, RegisterResponse, AuthSession } from '@/types';

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', data);
    return response.data;
  },

  async login(data: RegisterRequest): Promise<void> {
    const response = await apiClient.post<{ success: boolean; message: string; user?: { id: string; email: string }; token?: string }>(
      '/api/auth/login',
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }

    // Store token in localStorage for Authorization header
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
  },

  async getSession(): Promise<AuthSession> {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await apiClient.get<AuthSession>('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.data || !response.data.user || !response.data.user.email) {
          return {};
        }
        return response.data;
      }
      return {};
    } catch {
      return {};
    }
  },

  async logout(): Promise<void> {
    try {
      localStorage.removeItem('auth_token');
      await apiClient.post('/api/auth/logout');
    } catch {
      // Fallback
    }
  },
};
