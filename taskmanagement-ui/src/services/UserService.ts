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
   * Fetch a paginated list of users.
   */
  async getUsers(params: UserSearchParams): Promise<PageResponse<User>> {
    console.log('[DEBUG - UserService] Fetching all users...');
    const response = await apiClient.get<ApiResponse<User[]>>(
      API_ENDPOINTS.USERS,
      { params }
    );
    
    console.log('[DEBUG - UserService] Raw Axios Response:', response);
    console.log('[DEBUG - UserService] Backend data structure:', response.data.data);

    // ROOT CAUSE FIX: The backend `GET /api/users` returns a flat List (Array).
    // It DOES NOT return a Spring Data `Page` object like the `/search` endpoint does.
    // We must intercept it here in the Adapter layer and shim it into a PageResponse 
    // so that the generic `UsersPage` and `UserTable` do not crash looking for `.content`.
    
    const users = response.data.data;
    const { page = 0, size = 10 } = params;
    
    // Implementing client-side pagination since backend doesn't support it for this endpoint
    const start = page * size;
    const end = start + size;
    const paginatedUsers = users.slice(start, end);

    return {
      content: paginatedUsers,
      totalElements: users.length,
      totalPages: Math.ceil(users.length / size),
      size: size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(users.length / size) - 1,
      numberOfElements: paginatedUsers.length,
      empty: paginatedUsers.length === 0,
      sort: { sorted: false, unsorted: true, empty: true },
      pageable: {
        sort: { sorted: false, unsorted: true, empty: true },
        offset: start,
        pageNumber: page,
        pageSize: size,
        paged: true,
        unpaged: false,
      }
    };
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
