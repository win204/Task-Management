import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/features/tasks/api/TaskService';
import type { Task, TaskSearchParams, CreateTaskPayload, UpdateTaskPayload } from '@/features/tasks/types/task';
import type { PageResponse } from '@/features/users/types/user';
import toast from 'react-hot-toast';

export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  list: (params: TaskSearchParams) => ['tasks', 'list', params] as const,
};

export const useTasksQuery = (params: TaskSearchParams) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(params),
    queryFn: () => TaskService.getTasks(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => TaskService.createTask(payload),
    onSuccess: () => {
      toast.success('Task created successfully');
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create task';
      toast.error(message);
    },
  });
};

/**
 * Update task with Optimistic Updates.
 */
export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: number; payload: UpdateTaskPayload }) =>
      TaskService.updateTask(taskId, payload),
    onMutate: async ({ taskId, payload }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.all });
      const previousTasks = queryClient.getQueriesData<PageResponse<Task>>({ queryKey: TASK_QUERY_KEYS.all });

      // In a real optimistic update for relational data, we can't reliably update `projectName` and `assigneeName` 
      // locally because the payload only has `projectId` and `assigneeId`. So we invalidate heavily on settle.
      queryClient.setQueriesData<PageResponse<Task>>({ queryKey: TASK_QUERY_KEYS.all }, (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.map(task => 
            task.id === taskId 
              ? { ...task, title: payload.title, description: payload.description, status: payload.status, priority: payload.priority } 
              : task
          )
        };
      });

      return { previousTasks };
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          if (data) {
             queryClient.setQueryData(queryKey, data);
          }
        });
      }
      const message = error?.response?.data?.message || 'Failed to update task';
      toast.error(message);
    },
    onSuccess: () => {
      toast.success('Task updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
};

/**
 * Delete task with Optimistic Updates.
 */
export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => TaskService.deleteTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.all });
      const previousTasks = queryClient.getQueriesData<PageResponse<Task>>({ queryKey: TASK_QUERY_KEYS.all });

      queryClient.setQueriesData<PageResponse<Task>>({ queryKey: TASK_QUERY_KEYS.all }, (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.filter(task => task.id !== taskId)
        };
      });

      return { previousTasks };
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          if (data) {
             queryClient.setQueryData(queryKey, data);
          }
        });
      }
      const message = error?.response?.data?.message || 'Failed to delete task';
      toast.error(message);
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
};
