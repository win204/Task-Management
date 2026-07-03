export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  startDate: string; // ISO format YYYY-MM-DD
  dueDate: string;   // ISO format YYYY-MM-DD
  projectName: string;
  assigneeName: string;
}

export interface TaskSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
  priority?: string;
  assigneeId?: number;
  projectId?: number;
  dueDate?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: string;
  status: string;
  startDate: string;
  dueDate: string;
  projectId: number;
  assigneeId: number;
}

export interface UpdateTaskPayload extends CreateTaskPayload {}
