import { apiClient } from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';
import type { ApiResponse } from '../types/auth';
import type { PageResponse } from '../types/user'; // Reusing generic PageResponse
import type {
  Project,
  ProjectSearchParams,
  CreateProjectPayload,
  UpdateProjectPayload,
} from '../types/project';

export const ProjectService = {
  /**
   * Fetch a paginated list of projects (native pagination)
   */
  async getProjects(params: ProjectSearchParams): Promise<PageResponse<Project>> {
    const { keyword, status, ...pageParams } = params;
    
    // If we have a keyword or status, we route to the search endpoint
    if (keyword || status) {
      const response = await apiClient.get<ApiResponse<PageResponse<Project>>>(
        API_ENDPOINTS.PROJECTS_SEARCH,
        { params: { keyword, status, ...pageParams } }
      );
      return response.data.data;
    }
    
    // Native paging endpoint (no keyword and no status)
    const response = await apiClient.get<ApiResponse<PageResponse<Project>>>(
      API_ENDPOINTS.PROJECTS_PAGING,
      { params: pageParams }
    );
    return response.data.data;
  },

  /**
   * Create a new project.
   */
  async createProject(payload: CreateProjectPayload): Promise<Project> {
    const response = await apiClient.post<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS,
      payload
    );
    return response.data.data;
  },

  /**
   * Update an existing project.
   */
  async updateProject(projectId: number, payload: UpdateProjectPayload): Promise<Project> {
    const response = await apiClient.put<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECT_BY_ID(projectId),
      payload
    );
    return response.data.data;
  },

  /**
   * Delete a project by ID.
   */
  async deleteProject(projectId: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.PROJECT_BY_ID(projectId));
  },
};
