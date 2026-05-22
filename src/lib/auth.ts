import { userApi, apiConfig } from "../config";
import {
  CatApi,
  FileApi,
  HealthApi,
  PostApi,
  UserApi,
  Configuration,
} from "../client";
import { InternalApiUserLoginRequest } from "../client";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

export const auth = {
  login: async (login: string, password: string): Promise<string> => {
    const request: InternalApiUserLoginRequest = { login, password };
    const response = await userApi.apiV1UserLoginPost({ request });
    const token = response.token;
    if (!token) {
      throw new Error("Login failed - no token received");
    }
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, login);
    return token;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getUser: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_USER_KEY);
  },

  getAuthorizationHeader: (): { Authorization: string } | null => {
    const token = auth.getToken();
    return token ? { Authorization: `Bearer ${token}` } : null;
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },

  getAuthConfig: (): Configuration => {
    const headers = auth.getAuthorizationHeader();
    return new Configuration({
      basePath: apiConfig.basePath,
      headers: headers || undefined,
    });
  },

  getAuthenticatedApis: () => {
    const config = auth.getAuthConfig();
    return {
      catApi: new CatApi(config),
      fileApi: new FileApi(config),
      healthApi: new HealthApi(config),
      postApi: new PostApi(config),
      userApi: new UserApi(config),
    };
  },
};
