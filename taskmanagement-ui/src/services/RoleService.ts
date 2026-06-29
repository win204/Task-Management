import { apiClient } from '../api/axios';
import type { ApiResponse } from '../types/auth';
import type { PageResponse } from '../types/user';

export interface Role {
  id: number;
  roleName: string;
}

export const RoleService = {
  getRoles: async (page: number, size: number): Promise<PageResponse<Role>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Role>>>('/api/roles/paging', {
      params: { page, size }
    });
    return response.data.data;
  },

  createRole: async (roleName: string): Promise<Role> => {
    const response = await apiClient.post<ApiResponse<Role>>('/api/roles', { roleName });
    return response.data.data;
  },

  updateRole: async (id: number, roleName: string): Promise<Role> => {
    const response = await apiClient.put<ApiResponse<Role>>(`/api/roles/${id}`, { roleName });
    return response.data.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/roles/${id}`);
  }
};
