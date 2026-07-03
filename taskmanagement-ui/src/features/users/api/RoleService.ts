import { apiClient } from '@/api/axios';
import type { ApiResponse } from '@/features/auth/types/auth';
import type { PageResponse } from '@/features/users/types/user';

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export const RoleService = {
  getRoles: async (page: number, size: number): Promise<PageResponse<Role>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Role>>>('/api/roles/paging', {
      params: { page, size }
    });
    return response.data.data;
  },

  searchRoles: async (keyword: string, page: number, size: number): Promise<PageResponse<Role>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Role>>>('/api/roles/search', {
      params: { keyword, page, size }
    });
    return response.data.data;
  },

  getAllRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get<ApiResponse<Role[]>>('/api/roles');
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
  },

  assignRoleToUser: async (userId: number, roleId: number): Promise<void> => {
    await apiClient.post(`/api/users/${userId}/roles/${roleId}`);
  }
};
