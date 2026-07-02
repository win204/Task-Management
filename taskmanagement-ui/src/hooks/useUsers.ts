import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../services/UserService';
import type { User, UserSearchParams, CreateUserPayload, UpdateUserPayload, PageResponse } from '../types/user';
import toast from 'react-hot-toast';

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  // Single key shape including ALL params so page+keyword+size are always part of the cache key
  list: (params: UserSearchParams) => ['users', 'list', params] as const,
};

export const useUsersQuery = (params: UserSearchParams) => {
  return useQuery({
    // Always use the same key structure — params object includes page, size, keyword
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => {
      console.log('[useUsersQuery] Fetching:', params);
      if (params.keyword) {
        return UserService.searchUsers(params);
      }
      return UserService.getUsers(params);
    },
    // Keep previous data visible while next page loads (no flash of empty)
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => UserService.createUser(payload),
    onSuccess: () => {
      toast.success('User created successfully');
      // Invalidate all user queries so any page/search combo refreshes
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create user';
      toast.error(message);
    },
  });
};

/**
 * Update user with Optimistic Updates.
 * Instantly reflects changes in the UI before the server responds.
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: number; payload: UpdateUserPayload }) =>
      UserService.updateUser(userId, payload),
    onMutate: async ({ userId, payload }) => {
      // 1. Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEYS.all });

      // 2. Snapshot the previous queries to roll back if the mutation fails
      const previousUsers = queryClient.getQueriesData<PageResponse<User>>({ queryKey: USER_QUERY_KEYS.all });

      // 3. Optimistically update the cache for all queries containing this user
      queryClient.setQueriesData<PageResponse<User>>({ queryKey: USER_QUERY_KEYS.all }, (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.map(user => 
            user.id === userId 
              ? { ...user, ...payload } // Apply optimistic changes
              : user
          )
        };
      });

      // 4. Return context containing the snapshot
      return { previousUsers };
    },
    onError: (error: any, _variables, context) => {
      // Roll back to the snapshot on failure
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          if (data) {
             queryClient.setQueryData(queryKey, data);
          }
        });
      }
      const message = error?.response?.data?.message || 'Failed to update user';
      toast.error(message);
    },
    onSuccess: () => {
      toast.success('User updated successfully');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure synchronization
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
};

/**
 * Delete user with Optimistic Updates.
 */
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => UserService.deleteUser(userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEYS.all });
      const previousUsers = queryClient.getQueriesData<PageResponse<User>>({ queryKey: USER_QUERY_KEYS.all });

      queryClient.setQueriesData<PageResponse<User>>({ queryKey: USER_QUERY_KEYS.all }, (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.filter(user => user.id !== userId)
        };
      });

      return { previousUsers };
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          if (data) {
             queryClient.setQueryData(queryKey, data);
          }
        });
      }
      const message = error?.response?.data?.message || 'Failed to delete user';
      toast.error(message);
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
};

export const useLockUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => UserService.lockUser(userId),
    onSuccess: () => {
      toast.success('User locked successfully');
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to lock user';
      toast.error(message);
    }
  });
};

export const useUnlockUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => UserService.unlockUser(userId),
    onSuccess: () => {
      toast.success('User unlocked successfully');
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to unlock user';
      toast.error(message);
    }
  });
};

export const useAssignRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      UserService.assignRole(userId, roleId),
    onSuccess: () => {
      toast.success('Role assigned successfully');
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to assign role';
      toast.error(message);
    },
  });
};

export const useAssignPositionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, positionId }: { userId: number; positionId: number }) =>
      UserService.assignPosition(userId, positionId),
    onSuccess: () => {
      toast.success('Position assigned successfully');
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to assign position';
      toast.error(message);
    },
  });
};
