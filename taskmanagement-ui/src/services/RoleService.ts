import { apiClient } from '../api/axios';
import type { ApiResponse } from '../types/auth';
import type { PageResponse } from '../types/user';

export interface Role {
  id: number;
  name: string;
}

export const RoleService = {
  getRoles: async (page: number, size: number): Promise<PageResponse<Role>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Role>>>('/api/roles/paging', {
      params: { page, size }
    });
    return response.data.data;
  },

  createRole: async (name: string): Promise<Role> => {
    const response = await apiClient.post<ApiResponse<Role>>('/api/roles', { name });
    return response.data.data;
  },

  updateRole: async (id: number, name: string): Promise<Role> => {
    const response = await apiClient.put<ApiResponse<Role>>(`/api/roles/${id}`, { name });
    return response.data.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/roles/${id}`);
  }
};
