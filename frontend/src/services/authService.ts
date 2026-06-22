import { apiClient } from '@/lib/apiClient';
import { RegisterRequest, RegisterResponse, AuthSession } from '@/types';

export const authService = {
  async getCsrfToken(): Promise<string> {
    try {
      const response = await apiClient.get<{ csrfToken: string }>('/api/auth/csrf');
      return response.data.csrfToken;
    } catch {
      return '';
    }
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', data);
    return response.data;
  },

  async login(data: RegisterRequest): Promise<void> {
    const csrfToken = await this.getCsrfToken();
    const formData = new URLSearchParams();
    if (csrfToken) {
      formData.append('csrfToken', csrfToken);
    }
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('redirect', 'false');
    formData.append('json', 'true');

    const response = await apiClient.post<{ error?: string; status?: number; ok?: boolean; url?: string }>(
      '/api/auth/callback/credentials',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.data?.error) {
      const err = response.data.error;
      if (err === 'No user found' || err === 'Password not matched' || err === 'CredentialsSignin') {
        throw new Error('Invalid email or password. Please verify your credentials and try again.');
      }
      throw new Error(err);
    }
  },

  async getSession(): Promise<AuthSession> {
    const response = await apiClient.get<AuthSession>('/api/auth/session');
    if (!response.data || !response.data.user || !response.data.user.email) {
      return {};
    }
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      const csrfToken = await this.getCsrfToken();
      const formData = new URLSearchParams();
      if (csrfToken) {
        formData.append('csrfToken', csrfToken);
      }
      formData.append('json', 'true');

      await apiClient.post('/api/auth/signout', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch {
      // Fallback
    }
  },
};
