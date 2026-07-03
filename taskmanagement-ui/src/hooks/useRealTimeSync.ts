import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wsService } from '@/services/WebSocketService';
import { useAuthStore } from '@/features/auth/store/authStore';

export const useRealTimeSync = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      wsService.disconnect();
      return;
    }

    // Connect to WebSocket
    wsService.connect();

    // 1. Projects Broadcast
    wsService.subscribe('/topic/projects', (payload) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // If payload is an object with projectName, we can optionally show a toast
    });

    // 2. Tasks Broadcast
    wsService.subscribe('/topic/tasks', (payload) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project'] }); // Tasks are inside projects too
    });

    // 3. Users Broadcast
    wsService.subscribe('/topic/users', (payload) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    });

    // 4. Dashboard Stats Broadcast
    wsService.subscribe('/topic/dashboard', (action) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    });

    // 5. Personal Notifications Queue
    wsService.subscribe('/user/queue/notifications', (notification) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      // If it's a new notification (not just a read receipt), toast it!
      if (notification && typeof notification === 'object' && notification.title && !notification.isRead) {
        toast.success(`New Notification: ${notification.title}`, {
          position: 'top-right',
          duration: 4000,
        });
      }
    });

    // 6. Personal Profile Updates Queue
    wsService.subscribe('/user/queue/profile', (updatedUser) => {
      if (updatedUser && typeof updatedUser === 'object') {
        // Update the global auth store smoothly without logging out
        useAuthStore.setState({ user: updatedUser as any });
        toast('Your profile was updated by an admin', { icon: 'ℹ️' });
      }
    });

    return () => {
      // We don't necessarily disconnect here because strict mode mounts/unmounts.
      // But we DO unsubscribe to prevent leak.
      wsService.unsubscribe('/topic/projects');
      wsService.unsubscribe('/topic/tasks');
      wsService.unsubscribe('/topic/users');
      wsService.unsubscribe('/topic/dashboard');
      wsService.unsubscribe('/user/queue/notifications');
      wsService.unsubscribe('/user/queue/profile');
    };
  }, [isAuthenticated, user, queryClient]);
};
