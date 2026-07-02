import { apiClient } from '../api/axios';
import type { ApiResponse } from '../types/auth';

export interface AttachmentResponse {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedAt: string;
  taskId: number;
  taskTitle: string;
  uploadedById?: number;
  uploadedByName?: string;
}

export const AttachmentService = {
  getAttachmentsByTask: async (taskId: number): Promise<AttachmentResponse[]> => {
    const response = await apiClient.get<ApiResponse<AttachmentResponse[]>>(`/api/attachments/task/${taskId}`);
    return response.data.data;
  },

  uploadFile: async (taskId: number, file: File): Promise<AttachmentResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Pass taskId as query param as expected by backend
    const response = await apiClient.post<ApiResponse<AttachmentResponse>>(
      `/api/attachments/upload?taskId=${taskId}`, 
      formData
    );
    return response.data.data;
  },

  deleteAttachment: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/attachments/${id}`);
  },

  getDownloadUrl: (id: number): string => {
    // Assuming backend runs on the same domain or proxy setup
    return `${apiClient.defaults.baseURL || ''}/api/attachments/${id}/download`;
  }
};
