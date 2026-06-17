import { apiClient } from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
  User,
} from '../types/auth';

/**
 * Service Layer responsible strictly for HTTP communication with backend auth endpoints.
 * decoupled from state management, storage, or component layouts.
 */
export const AuthService = {
  /**
   * Log in user using credentials, returning token details.
   */
  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.LOGIN,
      request
    );
    return response.data;
  },

  /**
   * Log out user from system, invalidating refresh tokens on the backend.
   */
  async logout(userId: number): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      API_ENDPOINTS.LOGOUT(userId)
    );
    return response.data;
  },

  /**
   * Request password reset token to email.
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      API_ENDPOINTS.FORGOT_PASSWORD,
      request
    );
    return response.data;
  },

  /**
   * Complete password reset flow using token and new password.
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      API_ENDPOINTS.RESET_PASSWORD,
      request
    );
    return response.data;
  },

  /**
   * Fetch full user profile details by ID.
   */
  async getUserProfile(userId: number): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USER_BY_ID(userId)
    );
    return response.data;
  },

  /**
   * Search users by keyword (e.g. username) to fetch profile details before we have the ID.
   */
  async searchUsers(keyword: string): Promise<ApiResponse<{ content: User[] }>> {
    const response = await apiClient.get<ApiResponse<{ content: User[] }>>(
      '/api/users/search',
      {
        params: { keyword, page: 0, size: 1 },
      }
    );
    return response.data;
  },
};
