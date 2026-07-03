export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  active: boolean;
  roles: string[];
  positionNames?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export type LoginResponse = AuthTokens;
export type RefreshTokenResponse = AuthTokens;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface DecodedJwt {
  sub: string; // username
  roles: string[]; // normalized role names, e.g. ["ADMIN", "USER"]
  iat: number;
  exp: number;
}
