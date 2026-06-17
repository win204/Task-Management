import type { User } from './auth';

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface UserSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  password?: string;
  roles: string[];
  active?: boolean;
}

export interface UpdateUserPayload {
  email: string;
  fullName: string;
  phone: string;
  roles: string[];
  active: boolean;
}

// Re-export User for convenience in the users module
export type { User };
