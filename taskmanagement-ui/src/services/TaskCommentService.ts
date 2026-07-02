import { apiClient as api } from '../api/axios';
import type { ApiResponse } from '../types/auth';

export interface TaskCommentResponse {
  id: number;
  taskId: number;
  userId: number;
  username: string;
  fullName: string;
  content: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  replies?: TaskCommentResponse[];
}

export interface CreateTaskCommentRequest {
  content: string;
  parentId?: number;
}

export interface UpdateTaskCommentRequest {
  content: string;
}

export const TaskCommentService = {
  getComments: (taskId: number) => {
    return api.get<ApiResponse<TaskCommentResponse[]>>(`/api/tasks/${taskId}/comments`);
  },
  addComment: (taskId: number, request: CreateTaskCommentRequest) => {
    return api.post<ApiResponse<TaskCommentResponse>>(`/api/tasks/${taskId}/comments`, request);
  },
  deleteComment: (taskId: number, commentId: number) => {
    return api.delete<ApiResponse<void>>(`/api/tasks/${taskId}/comments/${commentId}`);
  },
  updateComment: (taskId: number, commentId: number, request: UpdateTaskCommentRequest) => {
    return api.put<ApiResponse<TaskCommentResponse>>(`/api/tasks/${taskId}/comments/${commentId}`, request);
  }
};
