import axios from "axios";

// In browser, use same-origin "/api" proxy to eliminate CORS errors across any domain (www / non-www).
// Fallback to backend URL if running server-side.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "/api" : "https://protien-backend.vercel.app/api");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach authentication token
if (typeof window !== "undefined") {
  apiClient.interceptors.request.use(
    (config) => {
      try {
        const token =
          localStorage.getItem("user_token") || localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error fetching token from localStorage:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
}

export default apiClient;
