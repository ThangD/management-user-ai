import api from './api';
import * as SecureStore from 'expo-secure-store';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: {
      name: string;
    };
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { access_token } = response.data;
    await SecureStore.setItemAsync('token', access_token);
    return response.data;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('token');
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('token');
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('token');
    return !!token;
  },
};
