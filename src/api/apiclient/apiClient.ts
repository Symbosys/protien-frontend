import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://localhost:4000/api",
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
