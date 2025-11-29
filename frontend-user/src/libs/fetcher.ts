import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { clearAuth, setAccessToken } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

const AUTH_BASE = `${BASE_URL}/iam`;
const PATIENT_BASE = `${BASE_URL}`;
const ORDER_BASE = `${BASE_URL}`;

const SERVICE_ROUTES: Record<string, string> = {
  "/auth": AUTH_BASE,
  "/patient": PATIENT_BASE,
  "/orders": ORDER_BASE,
};

const getServiceURL = (url: string): string => {
  if (/^https?:\/\//i.test(url)) return "";

  for (const [prefix, baseURL] of Object.entries(SERVICE_ROUTES)) {
    if (url.startsWith(prefix)) {
      return baseURL;
    }
  }
  return BASE_URL;
};

// Create axios instance với dynamic baseURL
const createAxiosInstance = (url: string): AxiosInstance => {
  return axios.create({
    baseURL: getServiceURL(url),
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
  });
};

// No auth instance (luôn dùng AUTH_BASE)
export const axiosNoAuth: AxiosInstance = axios.create({
  baseURL: AUTH_BASE,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const isPublicPage = (): boolean => {
  if (typeof window === "undefined") return false;
  const publicPages = [
    "/signin",
    "/signup",
    "/reset-password",
    "/forgot-password",
    "/forgot-password/reset",
  ];
  return publicPages.includes(window.location.pathname);
};

// Setup interceptors cho instance
const setupAuth = (axiosInstance: AxiosInstance): void => {
  // Request interceptor - add token
  axiosInstance.interceptors.request.use((config: CustomAxiosRequestConfig) => {
    const token = store.getState().auth.data?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) return Promise.reject(error);

      const originalRequest = error.config as CustomAxiosRequestConfig;
      if (!originalRequest) return Promise.reject(error);

      // Skip refresh calls
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }

      const publicEndpoints = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh-token",
        "/auth/password/reset",
        "/auth/password/forgot",
        "/auth/google/social",
        "/auth/google/social/callback",
      ];
      if (
        publicEndpoints.some((endpoint) =>
          originalRequest.url?.includes(endpoint)
        )
      ) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = store.getState().auth.data?.refreshToken;
        if (refreshToken) {
          try {
            const { data } = await axiosNoAuth.post("/auth/refresh-token", {
              refreshToken,
            });

            if (data?.data?.accessToken) {
              store.dispatch(setAccessToken(data.data.accessToken));

              // Retry với token mới
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

              // Tạo instance mới với correct service URL
              const retryInstance = createAxiosInstance(
                originalRequest.url || ""
              );
              setupAuth(retryInstance);
              return retryInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
          }
        }

        // Logout
        store.dispatch(clearAuth());

        if (typeof window !== "undefined" && !isPublicPage()) {
          window.location.href = "/signin";
        }
      }

      return Promise.reject(error);
    }
  );
};

// =================== UPDATED FETCHERS ===================
export const fetcher = async <T>(url: string): Promise<T> => {
  const axiosInstance = createAxiosInstance(url);
  setupAuth(axiosInstance);
  const response: AxiosResponse<T> = await axiosInstance.get(url);
  return response.data;
};

export const postFetcher = async <TResponse, TBody = unknown>(
  url: string,
  { arg }: { arg: TBody }
): Promise<TResponse> => {
  const axiosInstance = createAxiosInstance(url);
  setupAuth(axiosInstance);
  const response: AxiosResponse<TResponse> = await axiosInstance.post(url, arg);
  return response.data;
};

export const postFormDataFetcher = async <TResponse>(
  url: string,
  { arg }: { arg: FormData }
): Promise<TResponse> => {
  const axiosInstance = createAxiosInstance(url);
  setupAuth(axiosInstance);

  try {
    if (axiosInstance.defaults && axiosInstance.defaults.headers) {
      const d: unknown = axiosInstance.defaults;
      if (typeof d === "object" && d !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dd = d as any;
        if (dd.headers) delete dd.headers["Content-Type"];
        if (dd.headers && dd.headers.common)
          delete dd.headers.common["Content-Type"];
      }
    }
  } catch {
    // swallow - header cleanup best-effort
  }

  const response: AxiosResponse<TResponse> = await axiosInstance.post(
    url,
    arg as unknown as FormData
  );
  return response.data;
};

export const putFetcher = async <TResponse, TBody = unknown>(
  url: string,
  { arg }: { arg: TBody }
): Promise<TResponse> => {
  const axiosInstance = createAxiosInstance(url);
  setupAuth(axiosInstance);
  const response: AxiosResponse<TResponse> = await axiosInstance.put(url, arg);
  return response.data;
};

export const patchFetcher = async <TResponse, TBody = unknown>(
  url: string,
  { arg }: { arg: TBody }
): Promise<TResponse> => {
  const axiosInstance = createAxiosInstance(url);
  setupAuth(axiosInstance);
  const response: AxiosResponse<TResponse> = await axiosInstance.patch(
    url,
    arg
  );
  return response.data;
};

export const deleteFetcher = async <TResponse, TBody = unknown>(
  url: string,
  { arg }: { arg?: TBody } = { arg: undefined }
): Promise<TResponse> => {
  const axiosInstance = createAxiosInstance(url);
  setupAuth(axiosInstance);
  const response: AxiosResponse<TResponse> = await axiosInstance.delete(
    url,
    arg ? { data: arg } : {}
  );
  return response.data;
};

export default createAxiosInstance("/auth");
