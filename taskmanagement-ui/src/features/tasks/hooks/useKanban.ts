import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/features/tasks/api/TaskService';
import type { Task } from '@/features/tasks/types/task';

interface UpdateStatusPayload {
  taskId: number;
  newStatus: string;
}

export const useKanban = () => {
  const queryClient = useQueryClient();

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, newStatus }: UpdateStatusPayload) =>
      TaskService.updateTaskStatus(taskId, newStatus),
    
    // When mutate is called:
    onMutate: async ({ taskId, newStatus }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update the task's status in all cached pages
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old: any) => {
        if (!old) return old;
        
        // If it's a paginated structure
        if (old.content) {
          return {
            ...old,
            content: old.content.map((task: Task) => 
              task.id === taskId ? { ...task, status: newStatus } : task
            ),
          };
        }
        
        // If it's an array structure
        if (Array.isArray(old)) {
          return old.map((task: Task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          );
        }
        
        return old;
      });

      // Return a context with the previous data to rollback if necessary
      return { previousTasks };
    },
    
    // If the mutation fails, use the context we returned above
    onError: (err, _variables, context) => {
      console.error('Optimistic update failed, rolling back.', err);
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    
    // Always refetch after error or success to ensure server sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // Refresh dashboard stats
    },
  });

  return {
    updateTaskStatus: updateTaskStatusMutation.mutate,
    isUpdating: updateTaskStatusMutation.isPending,
  };
};
