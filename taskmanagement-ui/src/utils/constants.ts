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
  USERS: '/api/users',
  USERS_SEARCH: '/api/users/search',
  PROJECTS: '/api/projects',
  PROJECTS_SEARCH: '/api/projects/search',
  PROJECTS_PAGING: '/api/projects/paging',
  PROJECT_BY_ID: (projectId: number) => `/api/projects/${projectId}`,
  TASKS: '/api/tasks',
  TASKS_SEARCH: '/api/tasks/search',
  TASKS_PAGING: '/api/tasks/paging',
  TASK_BY_ID: (taskId: number) => `/api/tasks/${taskId}`,
} as const;
