export type UserStatus = 'silver' | 'gold' | 'platinum';

export type UserPosition = 'kso' | 'rop' | 'manager' | 'director';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  full_name: string;
  email: string;
  phone: string;
  dealer_code: string;
  position: UserPosition;
  status: UserStatus;
  registration_date: string; // ISO 8601 format
  sber_id: string;
  total_points: number;
  volume_points: number;
  deals_points: number;
  share_points: number;
  total_deals: number;
  total_volume: string; // Строковое представление числа
  bank_share: number;
  is_blocked: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  patronymic?: string;
  phone?: string;
}
