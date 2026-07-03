import { STORAGE_KEYS } from './constants';
import type { User } from '@/features/auth/types/auth';

/**
 * Storage helper class wrapping browser localStorage with type-safety
 * and structured exception handling.
 */
export const storage = {
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  removeAccessToken(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  removeRefreshToken(): void {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) {
      return null;
    }
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      this.removeUser();
      return null;
    }
  },

  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  clearAuth(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  },
};
