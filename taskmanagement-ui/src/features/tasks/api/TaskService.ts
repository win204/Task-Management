import { apiClient } from '@/api/axios';
import { API_ENDPOINTS } from '@/utils/constants';
import type { ApiResponse } from '@/features/auth/types/auth';
import type { PageResponse } from '@/features/users/types/user';
import type {
  Task,
  TaskSearchParams,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '@/features/tasks/types/task';

export const TaskService = {
  /**
   * Fetch a paginated list of tasks (native pagination)
   */
  async getTasks(params: TaskSearchParams): Promise<PageResponse<Task>> {
    const { keyword, status, priority, assigneeId, projectId, dueDate, ...pageParams } = params;
    
    // If any advanced parameter is present, we route to the advanced-search endpoint
    if (keyword || status || priority || assigneeId || projectId || dueDate) {
      const response = await apiClient.post<ApiResponse<PageResponse<Task>>>(
        API_ENDPOINTS.TASKS_ADVANCED_SEARCH,
        {
          title: keyword || undefined,
          status: status || undefined,
          priority: priority || undefined,
          assigneeId: assigneeId || undefined,
          projectId: projectId || undefined,
          dueDate: dueDate || undefined
        },
        { params: pageParams }
      );
      return response.data.data;
    }
    
    // Native paging endpoint (no filters)
    const response = await apiClient.get<ApiResponse<PageResponse<Task>>>(
      API_ENDPOINTS.TASKS_PAGING,
      { params: pageParams }
    );
    return response.data.data;
  },

  /**
   * Create a new task.
   */
  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASKS,
      payload
    );
    return response.data.data;
  },

  /**
   * Update an existing task.
   */
  async updateTask(taskId: number, payload: UpdateTaskPayload): Promise<Task> {
    const response = await apiClient.put<ApiResponse<Task>>(
      API_ENDPOINTS.TASK_BY_ID(taskId),
      payload
    );
    return response.data.data;
  },

  /**
   * Delete a task by ID.
   */
  async deleteTask(taskId: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.TASK_BY_ID(taskId));
  },

  /**
   * Update the status of a task via PATCH (optimized for Kanban).
   */
  async updateTaskStatus(taskId: number, status: string): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `${API_ENDPOINTS.TASK_BY_ID(taskId)}/status`,
      { status }
    );
    return response.data.data;
  },
};
