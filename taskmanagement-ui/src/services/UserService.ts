import { apiClient } from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';
import type { ApiResponse } from '../types/auth';
import type {
  User,
  PageResponse,
  UserSearchParams,
  CreateUserPayload,
  UpdateUserPayload,
} from '../types/user';

export const UserService = {
  /**
   * Fetch a paginated list of users from server-side paged endpoint.
   */
  async getUsers(params: UserSearchParams): Promise<PageResponse<User>> {
    const response = await apiClient.get<ApiResponse<PageResponse<User>>>(
      API_ENDPOINTS.USERS,
      { params: { page: params.page, size: params.size } }
    );
    return response.data.data;
  },

  /**
   * Search users by keyword with pagination.
   */
  async searchUsers(params: UserSearchParams): Promise<PageResponse<User>> {
    const response = await apiClient.get<ApiResponse<PageResponse<User>>>(
      API_ENDPOINTS.USERS_SEARCH,
      { params }
    );
    return response.data.data;
  },

  /**
   * Create a new user.
   */
  async createUser(payload: CreateUserPayload): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.USERS,
      payload
    );
    return response.data.data;
  },

  /**
   * Update an existing user.
   */
  async updateUser(userId: number, payload: UpdateUserPayload): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USER_BY_ID(userId),
      payload
    );
    return response.data.data;
  },

  /**
   * Delete a user by ID.
   */
  async deleteUser(userId: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.USER_BY_ID(userId));
  },
};
