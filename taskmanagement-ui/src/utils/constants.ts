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
  USER_ME: '/api/auth/me',
  CHANGE_PASSWORD: '/api/auth/change-password',
  USER_BY_ID: (userId: number) => `/api/users/${userId}`,
  USERS: '/api/users',
  USERS_SEARCH: '/api/users/search',
  PROJECTS: '/api/projects',
  PROJECTS_SEARCH: '/api/projects/search',
  PROJECTS_PAGING: '/api/projects/paging',
  PROJECT_BY_ID: (projectId: number) => `/api/projects/${projectId}`,
  TASKS: '/api/tasks',
  TASKS_SEARCH: '/api/tasks/search',
  TASKS_ADVANCED_SEARCH: '/api/tasks/advanced-search',
  TASKS_PAGING: '/api/tasks/paging',
  TASK_BY_ID: (taskId: number) => `/api/tasks/${taskId}`,
  DASHBOARD_STATS: '/api/dashboard',
  DASHBOARD_TASK_STATUS: '/api/dashboard/task-status',
  DASHBOARD_TASK_PRIORITY: '/api/dashboard/task-priority',
  DASHBOARD_TASKS_BY_MONTH: '/api/dashboard/tasks-by-month',
  ACTIVITY_LOGS: '/api/activity-logs',
  ACTIVITY_LOGS_SEARCH: '/api/activity-logs/search',
  EXPORT_ACTIVITY_LOGS_EXCEL: '/api/export/activity-logs/excel',
  EXPORT_ACTIVITY_LOGS_PDF: '/api/export/activity-logs/pdf',
} as const;
