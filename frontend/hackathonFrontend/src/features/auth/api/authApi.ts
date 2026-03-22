// features/auth/api/authApi.ts
import { API_ROUTES } from '@constants/API_ROUTES';
import type { AuthResponse, LoginRequest, User } from './authTypes';

export const AuthApi = {
  getProfile: async (accessToken: string | null): Promise<User> => {
    if (!accessToken?.trim()) {
      throw new Error('Учетные данные не были предоставлены.');
    }
    const response = await fetch(`${API_ROUTES.local}/api/users/profile/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Token ${accessToken.trim()}`,
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg =
        typeof data === 'object' &&
        data !== null &&
        'detail' in data &&
        typeof (data as { detail: unknown }).detail === 'string'
          ? (data as { detail: string }).detail
          : `Ошибка ${response.status}`;
      throw new Error(msg);
    }
    return data as User;
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_ROUTES.local}/api/users/auth/login/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Login failed',
          errors: data.errors,
        };
      }

      return data;
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message === 'Network request failed'
      ) {
        throw {
          status: 0,
          message: 'Нет подключения к интернету',
        };
      }
      throw error;
    }
  },
};
