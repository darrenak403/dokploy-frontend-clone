import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { clearAuth, setAccessToken } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:6789/v1/api";

const AUTH_BASE = `${BASE_URL}/iam`;
const PATIENT_BASE = `${BASE_URL}`;
const RESULT_BASE = `${BASE_URL}/testorder`;
const ORDER_BASE = `${BASE_URL}`;
const COMMENT_BASE = `${BASE_URL}`;
const INSTRUMENT_BASE = `${BASE_URL}`;
const WAREHOSE_BASE = `${BASE_URL}`;
const ROLE_BASE = `${BASE_URL}/iam`;

const SERVICE_ROUTES: Record<string, string> = {
  "/auth": AUTH_BASE,
  "/patient": PATIENT_BASE,
  "/orders": ORDER_BASE,
  "/results": RESULT_BASE,
  "/comments": COMMENT_BASE,
  "/instrument": INSTRUMENT_BASE,
  "/warehouse": WAREHOSE_BASE,
  "/roles": ROLE_BASE,
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

// Extend InternalAxiosRequestConfig to include _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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

  // Response interceptor - handle 401
  axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) return Promise.reject(error);

      const originalRequest = error.config as CustomAxiosRequestConfig;
      if (!originalRequest) return Promise.reject(error);

      // Skip refresh calls
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        console.warn("Refresh token request failed:", error);
        store.dispatch(clearAuth());
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
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/signin"
        ) {
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
  // const body = arg ?? {};
  // console.log("[PATCH] Request:", url, "payload:", body);
  const response: AxiosResponse<TResponse> = await axiosInstance.patch(
    url,
    arg
  );
  // console.log("[PATCH] Success:", response.status, response.data);
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

// =================== HL7 SPECIFIC FETCHER ===================
export const postHL7Fetcher = async <TResponse>(
  url: string,
  { arg }: { arg: { hl7Message: string } }
): Promise<TResponse> => {
  const baseURL = getServiceURL(url);
  const token = store.getState().auth.data?.accessToken;

  try {
    const response = await fetch(`${baseURL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: arg.hl7Message,
    });

    // Handle 401 - Token expired
    if (response.status === 401) {
      const refreshToken = store.getState().auth.data?.refreshToken;

      if (refreshToken) {
        try {
          // Try to refresh token
          const refreshResponse = await axiosNoAuth.post(
            "/auth/refresh-token",
            {
              refreshToken,
            }
          );

          if (refreshResponse.data?.data?.accessToken) {
            store.dispatch(
              setAccessToken(refreshResponse.data.data.accessToken)
            );

            // Retry request with new token
            const retryResponse = await fetch(`${baseURL}${url}`, {
              method: "POST",
              headers: {
                "Content-Type": "text/plain",
                Authorization: `Bearer ${refreshResponse.data.data.accessToken}`,
              },
              body: arg.hl7Message,
            });

            if (!retryResponse.ok) {
              const errorData = await retryResponse.json().catch(() => ({
                message: `HTTP Error ${retryResponse.status}: ${retryResponse.statusText}`,
              }));
              throw new Error(
                errorData.message || "Failed to send HL7 message"
              );
            }

            return retryResponse.json();
          }
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          store.dispatch(clearAuth());
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/signin"
          ) {
            window.location.href = "/signin";
          }
          throw refreshError;
        }
      }

      store.dispatch(clearAuth());
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/signin"
      ) {
        window.location.href = "/signin";
      }
      throw new Error("Unauthorized - Please login again");
    }

    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP Error ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.message || "Failed to send HL7 message");
    }

    return response.json();
  } catch (error) {
    console.error("HL7 Fetcher Error:", error);
    throw error;
  }
};

export default createAxiosInstance("/auth");
