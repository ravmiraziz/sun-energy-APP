// src/api/api.ts
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL as string;

/* ===============================
AXIOS INSTANCE
================================ */
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.data?.error === "invalid token" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 🔁 AGAR REFRESH BO‘LYAPGAN BO‘LSA — KUTAMIZ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (!originalRequest.headers) {
                originalRequest.headers = {};
              }
              console.log(token);

              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${API_URL}/admin-refresh-token`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access_token;

        // 🔐 SAQLAYMIZ
        localStorage.setItem("access_token", newAccessToken);

        // 🔥 ENG MUHIM QATOR
        api.defaults.headers.common.Authorization = "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers.Authorization = "Bearer " + newAccessToken;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ===============================
   UNIVERSAL API METHODS
================================ */

// GET LIST
export const get = <T>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.get<T>(url, { params, ...config });
};

// GET ONE
export const getOne = <T>(
  url: string,
  id: string | number,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.get<T>(`${url}/${id}`, config);
};

// POST
export const post = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.post<T>(url, data, config);
};

// PATCH
export const patch = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.patch<T>(url, data, config);
};

// PUT with ID
export const put = <T, D = unknown>(
  url: string,
  id: string | number,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.put<T>(`${url}/${id}`, data, config);
};

// PUT without ID
export const putData = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.put<T>(url, data, config);
};

// DELETE
export const remove = <T>(
  url: string,
  id: string | number,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.delete<T>(`${url}/${id}`, config);
};

export default api;
