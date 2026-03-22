// features/auth/hooks/useAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { AuthApi } from '../api/authApi';
import type { AuthResponse, LoginRequest, User } from '../api/authTypes';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 автологин при старте
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const savedUser = await AsyncStorage.getItem(USER_KEY);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          try {
            const u = await AuthApi.getProfile(savedToken);
            setUser(u);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
          } catch (e) {
            console.log('bootstrap getProfile', e);
          }
        }
      } catch (e) {
        console.log('Ошибка загрузки auth', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AuthResponse = await AuthApi.login(credentials);

      setUser(response.user);
      setToken(response.token);

      // 💾 сохраняем
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);

    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  };

  const refreshProfile = useCallback(async (): Promise<User | null> => {
    if (!token?.trim()) {
      return null;
    }
    try {
      const u = await AuthApi.getProfile(token);
      setUser(u);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
      return u;
    } catch (e) {
      console.log('refreshProfile', e);
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (!token?.trim() || isLoading) {
      return;
    }
    const onChange = (state: AppStateStatus) => {
      if (state === 'active') {
        void refreshProfile();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [token, isLoading, refreshProfile]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, error, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 👇 хук для использования
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
