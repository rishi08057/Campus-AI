import axios from "axios";

const FALLBACK_API_BASE_URL = "http://localhost:8000";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  FALLBACK_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear browser-visible auth state
        document.cookie =
          "logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

        // Attempt to clear token cookie (works if not HttpOnly)
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const isAxiosError = axios.isAxiosError;