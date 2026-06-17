import { apiClient } from '../api/axios';
import type { ApiResponse } from '../types/auth';
import type { 
  DashboardResponse, 
  TaskStatusChartResponse, 
  TaskPriorityChartResponse, 
  TaskMonthlyChartResponse 
} from '../types/dashboard';
import { API_ENDPOINTS } from '../utils/constants';

export const DashboardService = {
  getStatistics: async (): Promise<ApiResponse<DashboardResponse>> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_STATS);
    return response.data;
  },

  getTaskStatusChart: async (): Promise<ApiResponse<TaskStatusChartResponse[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_TASK_STATUS);
    return response.data;
  },

  getTaskPriorityChart: async (): Promise<ApiResponse<TaskPriorityChartResponse[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_TASK_PRIORITY);
    return response.data;
  },

  getTaskMonthlyChart: async (): Promise<ApiResponse<TaskMonthlyChartResponse[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_TASKS_BY_MONTH);
    return response.data;
  },
};
