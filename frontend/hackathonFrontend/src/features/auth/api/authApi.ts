// features/auth/api/authApi.ts
import { API_ROUTES } from '@constants/API_ROUTES';
import type { AuthResponse, LoginRequest } from './authTypes';

export const AuthApi = {
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
