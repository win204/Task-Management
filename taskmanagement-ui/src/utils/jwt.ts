import type { DecodedJwt } from '@/features/auth/types/auth';

/**
 * Decodes a JWT token payload using native browser APIs.
 * Handles UTF-8 base64url encoding safely.
 */
export const decodeJwt = (token: string): DecodedJwt | null => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload) as DecodedJwt;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired.
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  const decoded = decodeJwt(token);
  if (!decoded) return true;
  
  // exp and iat are in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Add a 10 second buffer to prevent race conditions during request flight
  return decoded.exp < (currentTime + 10);
};
