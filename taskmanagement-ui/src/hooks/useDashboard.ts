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
