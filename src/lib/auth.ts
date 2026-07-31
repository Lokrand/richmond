import { userApi } from "../config";
import {
  InternalApiUserLoginRequest,
  InternalApiUserTokenResponse,
} from "../client";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_REFRESH_TOKEN_KEY = "auth_refresh_token";
const AUTH_TOKEN_EXPIRY_KEY = "auth_token_expiry";
const AUTH_USER_KEY = "auth_user";
const REFRESH_BEFORE_MS = 60_000;

const storeTokens = (response: InternalApiUserTokenResponse): string => {
  const { token, refreshToken, expiresAt } = response;
  if (!token || !refreshToken || !expiresAt) {
    throw new Error("Authentication response is incomplete");
  }
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, expiresAt);
  return token;
};

export const auth = {
  login: async (login: string, password: string): Promise<string> => {
    const request: InternalApiUserLoginRequest = { login, password };
    const response = await userApi.apiV1UserLoginPost({ request });
    const token = storeTokens(response);
    localStorage.setItem(AUTH_USER_KEY, login);
    return token;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  },

  getUser: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_USER_KEY);
  },

  refresh: async (): Promise<string | null> => {
    const refreshToken = auth.getRefreshToken();
    if (!refreshToken) return null;
    try {
      return storeTokens(
        await userApi.apiV1UserRefreshPost({
          request: { refreshToken },
        }),
      );
    } catch {
      auth.logout();
      return null;
    }
  },

  getAuthorizationHeader: async (): Promise<{ Authorization: string } | null> => {
    if (typeof window === "undefined") return null;
    const token = auth.getToken();
    const expiresAt = localStorage.getItem(AUTH_TOKEN_EXPIRY_KEY);
    if (token && expiresAt && Date.parse(expiresAt) > Date.now() + REFRESH_BEFORE_MS) {
      return { Authorization: `Bearer ${token}` };
    }
    const refreshedToken = await auth.refresh();
    return refreshedToken ? { Authorization: `Bearer ${refreshedToken}` } : null;
  },

};
