import { apiClient } from '../api/axios';
import type { ApiResponse } from '../types/auth';
import type { PageResponse } from '../types/user';

export interface Position {
  id: number;
  positionName: string;
}

export const PositionService = {
  getPositions: async (page: number, size: number): Promise<PageResponse<Position>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Position>>>('/api/positions/paging', {
      params: { page, size }
    });
    return response.data.data;
  },

  createPosition: async (positionName: string): Promise<Position> => {
    const response = await apiClient.post<ApiResponse<Position>>('/api/positions', { positionName });
    return response.data.data;
  },

  updatePosition: async (id: number, positionName: string): Promise<Position> => {
    const response = await apiClient.put<ApiResponse<Position>>(`/api/positions/${id}`, { positionName });
    return response.data.data;
  },

  deletePosition: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/positions/${id}`);
  }
};
