export interface Project {
  id: number;
  projectCode: string;
  projectName: string;
  description: string;
  startDate: string; // ISO format YYYY-MM-DD
  endDate: string | null;
  status: string;
}

export interface ProjectSearchParams {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface CreateProjectPayload {
  projectCode: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  status: string;
}

export interface UpdateProjectPayload extends CreateProjectPayload {}
