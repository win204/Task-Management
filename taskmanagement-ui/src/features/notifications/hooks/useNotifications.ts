import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/features/notifications/api/NotificationService';
import { useAuthStore } from '@/features/auth/store/authStore';

export const useUnreadNotifications = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['notifications', 'unread', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await NotificationService.getUnreadNotifications(user.id);
      return response.data;
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useAllNotifications = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['notifications', 'all', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await NotificationService.getAllNotifications(user.id);
      return response.data;
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (id: number) => NotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', user?.id] });
    },
  });
};
