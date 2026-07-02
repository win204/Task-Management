import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';
import { API_ENDPOINTS } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Flag to track whether token refresh is in progress
let isRefreshing = false;
// Queue to hold failed requests that will be retried after a successful refresh
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Iterates through the queue of failed requests, resolving them with the new token or rejecting on failure.
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  console.log(`[Axios Interceptor] Processing failed requests queue. Count: ${failedQueue.length}, Success: ${!error}`);
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Inject Access Token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = storage.getAccessToken();
    console.log(`[Axios Request] Outgoing request to ${config.url}. Found token in storage: ${!!accessToken}`);
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('[Axios Request] Error in request config builder:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Automatically handle 401 errors & token refresh rotation
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Axios Response] Successful response from ${response.config.url} (Status: ${response.status})`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    console.warn(`[Axios Response] API returned error from ${originalRequest?.url} (Status: ${error.response?.status})`);
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Prevent interceptor loop by marking custom retry configuration
    const customConfig = originalRequest as InternalAxiosRequestConfig & { _retry?: boolean };

    // Ignore interceptor logic for direct authentication endpoints (login, password reset etc.)
    const isAuthRequest = 
      originalRequest.url?.includes(API_ENDPOINTS.LOGIN) ||
      originalRequest.url?.includes(API_ENDPOINTS.FORGOT_PASSWORD) ||
      originalRequest.url?.includes(API_ENDPOINTS.RESET_PASSWORD);

    // If response is 401, not an auth endpoint, and hasn't been retried yet
    if (error.response?.status === 401 && !isAuthRequest && !customConfig._retry) {
      console.log(`[Axios Interceptor] Intercepted 401 on secure endpoint: ${originalRequest.url}. Starting recovery...`);
      
      if (isRefreshing) {
        console.log('[Axios Interceptor] Token rotation already in progress. Queueing this request:', originalRequest.url);
        // If a refresh is already underway, queue this request to be retried
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log('[Axios Interceptor] Retrying queued request with rotated token:', originalRequest.url);
            customConfig.headers.Authorization = `Bearer ${token}`;
            return apiClient(customConfig);
          })
          .catch((err) => {
            console.error('[Axios Interceptor] Queued request retry aborted:', err);
            return Promise.reject(err);
          });
      }

      customConfig._retry = true;
      isRefreshing = true;

      const refreshToken = storage.getRefreshToken();
      console.log('[Axios Interceptor] Retrieving refresh token from storage. Found:', !!refreshToken);
      
      if (!refreshToken) {
        console.error('[Axios Interceptor] Refresh token missing from storage. Aborting recovery.');
        handleSessionExpiration();
        return Promise.reject(error);
      }

      try {
        console.log('[Axios Interceptor] Firing background POST to token refresh endpoint...');
        // Call the raw axios endpoint directly to avoid request interceptor interception/looping
        const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {
          refreshToken,
        });

        console.log('[Axios Interceptor] Background token refresh succeeded. Rotating credentials...');
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        // Persist the rotated tokens
        storage.setAccessToken(newAccessToken);
        storage.setRefreshToken(newRefreshToken);

        // Dynamically import Zustand store to update session state (avoids circular dependency issues)
        const { updateSession } = (await import('../store/authStore')).useAuthStore.getState();
        updateSession(newAccessToken, newRefreshToken);

        console.log('[Axios Interceptor] Store state updated. Releasing queued requests...');
        processQueue(null, newAccessToken);

        // Retry the original request with the fresh accessToken
        console.log('[Axios Interceptor] Retrying original intercepted request:', originalRequest.url);
        customConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(customConfig);
      } catch (refreshError) {
        console.error('[Axios Interceptor] Background token refresh failed. Forcing logout.', refreshError);
        processQueue(refreshError as Error, null);
        handleSessionExpiration();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Centralized handler for clearing expired tokens and state, notifying the state manager.
 */
const handleSessionExpiration = () => {
  console.warn('[Axios Interceptor] Session expired or invalid. Flashing localStorage and informing Store.');
  storage.clearAuth();
  import('../store/authStore').then(({ useAuthStore }) => {
    useAuthStore.getState().logoutState();
  });
};
