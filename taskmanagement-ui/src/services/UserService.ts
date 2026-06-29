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
    console.log(`[UserService.getUsers] page=${params.page} size=${params.size} → totalPages=${response.data.data?.totalPages}`);
    return response.data.data;
  },

  async searchUsers(params: UserSearchParams): Promise<PageResponse<User>> {
    const response = await apiClient.get<ApiResponse<PageResponse<User>>>(
      API_ENDPOINTS.USERS_SEARCH,
      { params: { keyword: params.keyword, page: params.page, size: params.size } }
    );
    console.log(`[UserService.searchUsers] keyword="${params.keyword}" page=${params.page} → totalPages=${response.data.data?.totalPages}`);
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

  async lockUser(id: number): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`/api/users/${id}/lock`);
    return response.data.data;
  },

  async unlockUser(id: number): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`/api/users/${id}/unlock`);
    return response.data.data;
  },

  /**
   * Change password for a user.
   * Requires oldPassword verification on the backend.
   */
  async changePassword(
    userId: number,
    payload: { oldPassword: string; newPassword: string; confirmPassword: string }
  ): Promise<void> {
    await apiClient.post<ApiResponse<void>>(
      API_ENDPOINTS.CHANGE_PASSWORD,
      payload
    );
  },
};
