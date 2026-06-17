export interface DashboardResponse {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  todoTasks: number;
  inProgressTasks: number;
}

export interface TaskStatusChartResponse {
  status: string;
  count: number;
}

export interface TaskPriorityChartResponse {
  priority: string;
  count: number;
}

export interface TaskMonthlyChartResponse {
  month: string;
  count: number;
}
