/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },

});


api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const getRefreshToken = (): string | null => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).refreshToken : null;
  } catch {
    return null;
  }
};

// Update stored tokens
const updateTokens = (newToken: string, newRefreshToken: string) => {
  localStorage.setItem("token", newToken);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  localStorage.setItem(
    "user",
    JSON.stringify({
      ...user,
      token: newToken,
      refreshToken: newRefreshToken,
    })
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const res = await axios.post(
          "/api/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { token, refreshToken: newRefreshToken } = res.data.data;

        updateTokens(token, newRefreshToken);

        isRefreshing = false;
        processQueue(null, token);

        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
    });
  }
);

export default api;
