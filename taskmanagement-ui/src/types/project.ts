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
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
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
