import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectService } from '../services/ProjectService';
import type { Project, ProjectSearchParams, CreateProjectPayload, UpdateProjectPayload } from '../types/project';
import type { PageResponse } from '../types/user';
import toast from 'react-hot-toast';

export const PROJECT_QUERY_KEYS = {
  all: ['projects'] as const,
  list: (params: ProjectSearchParams) => ['projects', 'list', params] as const,
};

export const useProjectsQuery = (params: ProjectSearchParams) => {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.list(params),
    queryFn: () => ProjectService.getProjects(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => ProjectService.createProject(payload),
    onSuccess: () => {
      toast.success('Project created successfully');
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create project';
      toast.error(message);
    },
  });
};

/**
 * Update project with Optimistic Updates.
 */
export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: number; payload: UpdateProjectPayload }) =>
      ProjectService.updateProject(projectId, payload),
    onMutate: async ({ projectId, payload }) => {
      await queryClient.cancelQueries({ queryKey: PROJECT_QUERY_KEYS.all });
      const previousProjects = queryClient.getQueriesData<PageResponse<Project>>({ queryKey: PROJECT_QUERY_KEYS.all });

      queryClient.setQueriesData<PageResponse<Project>>({ queryKey: PROJECT_QUERY_KEYS.all }, (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.map(project => 
            project.id === projectId 
              ? { ...project, ...payload } 
              : project
          )
        };
      });

      return { previousProjects };
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousProjects) {
        context.previousProjects.forEach(([queryKey, data]) => {
          if (data) {
             queryClient.setQueryData(queryKey, data);
          }
        });
      }
      const message = error?.response?.data?.message || 'Failed to update project';
      toast.error(message);
    },
    onSuccess: () => {
      toast.success('Project updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
    },
  });
};

/**
 * Delete project with Optimistic Updates.
 */
export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) => ProjectService.deleteProject(projectId),
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: PROJECT_QUERY_KEYS.all });
      const previousProjects = queryClient.getQueriesData<PageResponse<Project>>({ queryKey: PROJECT_QUERY_KEYS.all });

      queryClient.setQueriesData<PageResponse<Project>>({ queryKey: PROJECT_QUERY_KEYS.all }, (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.filter(project => project.id !== projectId)
        };
      });

      return { previousProjects };
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousProjects) {
        context.previousProjects.forEach(([queryKey, data]) => {
          if (data) {
             queryClient.setQueryData(queryKey, data);
          }
        });
      }
      const message = error?.response?.data?.message || 'Failed to delete project';
      toast.error(message);
    },
    onSuccess: () => {
      toast.success('Project deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
    },
  });
};
