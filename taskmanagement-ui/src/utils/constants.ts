export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'task_management_access_token',
  REFRESH_TOKEN: 'task_management_refresh_token',
  USER: 'task_management_user',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  ROOT: '/',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REFRESH: '/api/auth/refresh',
  LOGOUT: (userId: number) => `/api/auth/logout/${userId}`,
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  USER_BY_ID: (userId: number) => `/api/users/${userId}`,
} as const;
