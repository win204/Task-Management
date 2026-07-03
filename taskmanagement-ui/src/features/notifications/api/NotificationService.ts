import { apiClient } from '@/api/axios';
import type { ApiResponse } from '@/features/auth/types/auth';
import type { Notification } from '@/features/notifications/types/notification';

export const NotificationService = {
  getUnreadNotifications: async (userId: number): Promise<ApiResponse<Notification[]>> => {
    const response = await apiClient.get(`/api/notifications/unread?userId=${userId}`);
    return response.data;
  },

  getAllNotifications: async (userId: number): Promise<ApiResponse<Notification[]>> => {
    const response = await apiClient.get(`/api/notifications?userId=${userId}`);
    return response.data;
  },

  markAsRead: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response.data;
  },
};
