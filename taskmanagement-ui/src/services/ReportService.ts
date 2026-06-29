import { apiClient } from '../api/axios';
import type { ActivityLogSearchParams } from './ActivityLogService';

export const ReportService = {
  async exportTasksToExcel(): Promise<Blob> {
    const response = await apiClient.get('/api/reports/tasks/excel', {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportProjectsToExcel(): Promise<Blob> {
    const response = await apiClient.get('/api/reports/projects/excel', {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportUsersToExcel(): Promise<Blob> {
    const response = await apiClient.get('/api/reports/users/excel', {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportTasksToPdf(): Promise<Blob> {
    const response = await apiClient.get('/api/reports/tasks/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportActivityLogsToExcel(params?: ActivityLogSearchParams): Promise<Blob> {
    const response = await apiClient.get('/api/export/activity-logs/excel', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  async exportActivityLogsToPdf(params?: ActivityLogSearchParams): Promise<Blob> {
    const response = await apiClient.get('/api/export/activity-logs/pdf', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
