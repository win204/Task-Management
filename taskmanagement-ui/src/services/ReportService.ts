import { apiClient } from '../api/axios';

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
};
