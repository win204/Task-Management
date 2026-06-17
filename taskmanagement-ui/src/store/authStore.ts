import { create } from 'zustand';
import type { User, LoginRequest, AuthTokens } from '../types/auth';
import { AuthService } from '../services/AuthService';
import { storage } from '../utils/storage';
import { decodeJwt, isTokenExpired } from '../utils/jwt';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateSession: (accessToken: string, refreshToken: string) => void;
  logoutState: () => void;
  initialize: () => Promise<void>;
  clearError: () => void;
}

const initialAuthStoreState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialAuthStoreState,

  clearError: () => set({ error: null }),

  /**
   * Performs client authentication, retrieves JWT tokens, decodes roles,
   * queries user details from the server, and persists the session.
   */
  login: async (request: LoginRequest) => {
    console.log('[AuthStore] Login initiated for username:', request.username);
    set({ isLoading: true, error: null });
    
    try {
      // 1. Call login endpoint to fetch tokens
      console.log('[AuthStore] Contacting login endpoint...');
      const response = await AuthService.login(request);
      
      console.log('[AuthStore] Login API returned success. Response payload:', response);
      const { accessToken, refreshToken } = response.data;
      console.log('[AuthStore] Extracted tokens:', { 
        accessToken: accessToken ? `${accessToken.substring(0, 15)}...` : 'null', 
        refreshToken: refreshToken ? `${refreshToken.substring(0, 15)}...` : 'null' 
      });

      // 2. Decode access token to extract username & roles
      console.log('[AuthStore] Decoding access token...');
      const decoded = decodeJwt(accessToken);
      if (!decoded) {
        throw new Error('Invalid authentication token payload returned from server.');
      }
      console.log('[AuthStore] Decoded JWT claims:', decoded);

      // 3. Persist tokens immediately in storage
      console.log('[AuthStore] Persisting tokens to storage...');
      storage.setAccessToken(accessToken);
      storage.setRefreshToken(refreshToken);

      // 4. Fetch full user details from backend using username
      let fullUser: User = {
        id: 0,
        username: decoded.sub,
        email: '',
        fullName: decoded.sub,
        phone: '',
        active: true,
        roles: decoded.roles,
      };

      try {
        console.log('[AuthStore] Fetching full user profile for:', decoded.sub);
        const userSearchResponse = await AuthService.searchUsers(decoded.sub);
        console.log('[AuthStore] User search API returned:', userSearchResponse);
        const matchedUser = userSearchResponse.data.content?.[0];
        if (matchedUser) {
          fullUser = {
            ...matchedUser,
            roles: decoded.roles, // Ensure the roles assigned to the JWT are used
          };
          console.log('[AuthStore] Found profile details:', fullUser);
        } else {
          console.warn('[AuthStore] No profile matched in user search API, using JWT claims fallback.');
        }
      } catch (profileError) {
        console.warn('[AuthStore] Could not fetch user profile details from backend, falling back to token claims.', profileError);
      }

      // 5. Persist user details
      console.log('[AuthStore] Persisting user details to storage...');
      storage.setUser(fullUser);

      // 6. Update Zustand state
      console.log('[AuthStore] Updating Zustand store auth state to Authenticated.');
      set({
        user: fullUser,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      console.log('[AuthStore] Login flow complete. Store status:', {
        isAuthenticated: get().isAuthenticated,
        isLoading: get().isLoading,
        isInitializing: get().isInitializing,
        user: get().user?.username
      });
    } catch (err: unknown) {
      console.error('[AuthStore] Login failed with error:', err);
      const errorResponse = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = errorResponse.response?.data?.message || errorResponse.message || 'Login failed';
      
      set({ error: errorMessage, isLoading: false });
      storage.clearAuth();
      throw err;
    }
  },

  /**
   * Logs out user, calls the backend logout API, and flushes local session state.
   */
  logout: async () => {
    const user = get().user;
    console.log('[AuthStore] Logout initiated for user:', user?.username);
    set({ isLoading: true });
    
    if (user?.id) {
      try {
        console.log('[AuthStore] Informing backend of logout invalidation for user ID:', user.id);
        await AuthService.logout(user.id);
        console.log('[AuthStore] Backend logout call completed successfully.');
      } catch (err) {
        console.error('[AuthStore] Backend logout call encountered an error:', err);
      }
    }

    // Flush credentials regardless of API request status
    console.log('[AuthStore] Purging local session data...');
    storage.clearAuth();
    set({
      ...initialAuthStoreState,
      isInitializing: false, // Ensure we mark initializing as complete
      isLoading: false,
    });
    console.log('[AuthStore] Logout complete. State reset to anonymous.');
  },

  /**
   * Rotates tokens within active memory. Called by the Axios interceptor.
   */
  updateSession: (accessToken: string, refreshToken: string) => {
    console.log('[AuthStore] Rotating session tokens in store memory...');
    const decoded = decodeJwt(accessToken);
    const currentUser = get().user;
    
    let updatedUser: User | null = null;
    if (currentUser && decoded) {
      updatedUser = {
        ...currentUser,
        roles: decoded.roles,
      };
      storage.setUser(updatedUser);
      console.log('[AuthStore] User roles updated after token rotation:', decoded.roles);
    }
    
    set({
      accessToken,
      refreshToken,
      user: updatedUser || currentUser,
    });
    console.log('[AuthStore] Session rotation completed successfully.');
  },

  /**
   * Directly resets state without backend API calls. Used by Axios interceptors for 401s.
   */
  logoutState: () => {
    console.warn('[AuthStore] Logging out client state synchronously due to expired/invalid session interceptor.');
    set({
      ...initialAuthStoreState,
      isInitializing: false,
      isLoading: false,
    });
  },

  /**
   * Restores user session from storage on application boot.
   * Handles expired access tokens using the refresh token automatically.
   */
  initialize: async () => {
    console.log('[AuthStore] Initializing session recovery on boot...');
    set({ isInitializing: true });
    
    const accessToken = storage.getAccessToken();
    const refreshToken = storage.getRefreshToken();
    const cachedUser = storage.getUser();

    console.log('[AuthStore] Loaded credentials from localStorage:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasCachedUser: !!cachedUser,
    });

    // If no tokens are stored, complete initialization immediately
    if (!accessToken || !refreshToken) {
      console.log('[AuthStore] Credentials not found in storage. Booting as anonymous.');
      storage.clearAuth();
      set({
        ...initialAuthStoreState,
        isInitializing: false,
      });
      return;
    }

    // Check if the current access token is expired (or close to expiring)
    if (isTokenExpired(accessToken)) {
      console.log('[AuthStore] Access token is expired. Attempting silent token rotation...');
      try {
        // Attempt token rotation using raw Axios client to avoid intercepter conflicts
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        const axios = await import('axios');
        const response = await axios.default.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        console.log('[AuthStore] Token rotation API returned success payload:', response.data);
        const rotatedTokens: AuthTokens = response.data.data;
        
        storage.setAccessToken(rotatedTokens.accessToken);
        storage.setRefreshToken(rotatedTokens.refreshToken);

        const decoded = decodeJwt(rotatedTokens.accessToken);
        
        let freshUser = cachedUser;
        if (decoded) {
          if (cachedUser) {
            freshUser = { ...cachedUser, roles: decoded.roles };
          } else {
            console.log('[AuthStore] Fetching profile search details for username:', decoded.sub);
            // Re-fetch user details if cache was purged
            const searchRes = await AuthService.searchUsers(decoded.sub);
            const matchedUser = searchRes.data.content?.[0];
            if (matchedUser) {
              freshUser = { ...matchedUser, roles: decoded.roles };
            }
          }
        }

        if (freshUser) {
          storage.setUser(freshUser);
        }

        console.log('[AuthStore] Token rotation complete. User session restored:', freshUser?.username);
        set({
          accessToken: rotatedTokens.accessToken,
          refreshToken: rotatedTokens.refreshToken,
          user: freshUser,
          isAuthenticated: true,
          isInitializing: false,
        });
      } catch (refreshErr) {
        console.error('[AuthStore] Failed to restore session due to expired/invalid refresh token:', refreshErr);
        storage.clearAuth();
        set({
          ...initialAuthStoreState,
          isInitializing: false,
        });
      }
    } else {
      console.log('[AuthStore] Active session tokens are valid. Hydrating state directly.');
      set({
        accessToken,
        refreshToken,
        user: cachedUser,
        isAuthenticated: !!cachedUser,
        isInitializing: false,
      });
    }
    
    console.log('[AuthStore] Initialization complete. Final session state:', {
      isAuthenticated: get().isAuthenticated,
      isInitializing: get().isInitializing,
      isLoading: get().isLoading,
      user: get().user?.username
    });
  },
}));
