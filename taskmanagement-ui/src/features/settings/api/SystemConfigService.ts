import { apiClient } from '@/api/axios';
import type { ApiResponse } from '@/features/auth/types/auth';

export interface SystemConfigResponse {
  configKey: string;
  configValue: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
}

export const SystemConfigService = {
  getAllConfigs: async (): Promise<SystemConfigResponse[]> => {
    const response = await apiClient.get<ApiResponse<SystemConfigResponse[]>>('/api/config');
    return response.data.data;
  },

  updateConfig: async (key: string, configValue: string): Promise<SystemConfigResponse> => {
    const response = await apiClient.put<ApiResponse<SystemConfigResponse>>(`/api/config/${key}`, { configValue });
    return response.data.data;
  }
};
