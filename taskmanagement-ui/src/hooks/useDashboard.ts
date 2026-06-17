import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/DashboardService';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await DashboardService.getStatistics();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useTaskStatusChart = () => {
  return useQuery({
    queryKey: ['dashboard', 'taskStatusChart'],
    queryFn: async () => {
      const response = await DashboardService.getTaskStatusChart();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTaskPriorityChart = () => {
  return useQuery({
    queryKey: ['dashboard', 'taskPriorityChart'],
    queryFn: async () => {
      const response = await DashboardService.getTaskPriorityChart();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTaskMonthlyChart = () => {
  return useQuery({
    queryKey: ['dashboard', 'taskMonthlyChart'],
    queryFn: async () => {
      const response = await DashboardService.getTaskMonthlyChart();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
