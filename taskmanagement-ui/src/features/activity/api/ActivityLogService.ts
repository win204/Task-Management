import { apiClient as api } from '@/api/axios';
import { API_ENDPOINTS } from '@/utils/constants';
import type { ApiResponse } from '@/features/auth/types/auth';
import type { PageResponse } from '@/features/users/types/user';

export interface ActivityLogResponse {
  id: number;
  action: string;
  description: string;
  username: string;
  taskTitle: string;
  module: string;
  entityId: number;
  ipAddress?: string;
  result?: string;
  createdAt: string;
}

export interface ActivityLogSearchParams {
  username?: string;
  module?: string;
  action?: string;
  result?: string;
  ipAddress?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export const ActivityLogService = {
  searchLogs: async (params: ActivityLogSearchParams): Promise<PageResponse<ActivityLogResponse>> => {
    const response = await api.get<ApiResponse<PageResponse<ActivityLogResponse>>>(API_ENDPOINTS.ACTIVITY_LOGS_SEARCH, { params });
    return response.data.data;
  }
};
