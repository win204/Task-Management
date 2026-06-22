import { apiClient } from '../api/axios';
import type { ApiResponse } from '../types/auth';
import type { Notification } from '../types/notification';

export const NotificationService = {
  getUnreadNotifications: async (userId: number): Promise<ApiResponse<Notification[]>> => {
    const response = await apiClient.get(`/notifications/unread?userId=${userId}`);
    return response.data;
  },

  markAsRead: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },
};
