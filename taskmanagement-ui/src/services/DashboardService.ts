import { apiClient } from '../api/axios';
import type { ApiResponse } from '../types/auth';
import type { DashboardResponse } from '../types/dashboard';
import { API_ENDPOINTS } from '../utils/constants';

export const DashboardService = {
  getStatistics: async (): Promise<ApiResponse<DashboardResponse>> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_STATS);
    return response.data;
  },
};
