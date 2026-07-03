import { apiClient as api } from '@/api/axios';
import type { ApiResponse } from '@/features/auth/types/auth';

export interface ProjectMemberResponse {
  projectId: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AddProjectMemberRequest {
  userId: number;
  role: string;
}

export const ProjectMemberService = {
  getMembers: (projectId: number) => {
    return api.get<ApiResponse<ProjectMemberResponse[]>>(`/projects/${projectId}/members`);
  },
  addMember: (projectId: number, request: AddProjectMemberRequest) => {
    return api.post<ApiResponse<ProjectMemberResponse>>(`/projects/${projectId}/members`, request);
  },
  updateRole: (projectId: number, userId: number, role: string) => {
    return api.put<ApiResponse<ProjectMemberResponse>>(`/projects/${projectId}/members/${userId}/role`, { role });
  },
  removeMember: (projectId: number, userId: number) => {
    return api.delete<ApiResponse<void>>(`/projects/${projectId}/members/${userId}`);
  }
};
