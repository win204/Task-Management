import { apiClient } from '../api/axios';
import type { ApiResponse } from '../types/auth';
import type { PageResponse } from '../types/user';

export interface Position {
  id: number;
  name: string;
  description?: string;
}

export const PositionService = {
  getPositions: async (page: number, size: number): Promise<PageResponse<Position>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Position>>>('/api/positions/paging', {
      params: { page, size }
    });
    return response.data.data;
  },

  searchPositions: async (keyword: string, page: number, size: number): Promise<PageResponse<Position>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Position>>>('/api/positions/search', {
      params: { keyword, page, size }
    });
    return response.data.data;
  },

  getAllPositions: async (): Promise<Position[]> => {
    const response = await apiClient.get<ApiResponse<Position[]>>('/api/positions');
    return response.data.data;
  },

  createPosition: async (name: string): Promise<Position> => {
    const response = await apiClient.post<ApiResponse<Position>>('/api/positions', { name });
    return response.data.data;
  },

  updatePosition: async (id: number, name: string): Promise<Position> => {
    const response = await apiClient.put<ApiResponse<Position>>(`/api/positions/${id}`, { name });
    return response.data.data;
  },

  deletePosition: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/positions/${id}`);
  },

  assignPositionToUser: async (userId: number, positionId: number): Promise<void> => {
    await apiClient.post(`/api/users/${userId}/positions/${positionId}`);
  }
};
