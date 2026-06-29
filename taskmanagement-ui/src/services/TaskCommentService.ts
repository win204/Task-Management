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

export const TaskCommentService = {
  getComments: (taskId: number) => {
    return api.get<ApiResponse<TaskCommentResponse[]>>(`/tasks/${taskId}/comments`);
  },
  addComment: (taskId: number, request: CreateTaskCommentRequest) => {
    return api.post<ApiResponse<TaskCommentResponse>>(`/tasks/${taskId}/comments`, request);
  },
  deleteComment: (taskId: number, commentId: number) => {
    return api.delete<ApiResponse<void>>(`/tasks/${taskId}/comments/${commentId}`);
  }
};
