import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export const usersService = {
  async getUsers(page = 1, limit = 10, search = ''): Promise<PaginatedUsers> {
    const response = await api.get('/users', {
      params: { page, limit, search },
    });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: { email?: string; name?: string }): Promise<User> {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },
};
