import axios from "axios";

const API_BASE_URL = "https://protien-backend.vercel.app/api";
// const API_BASE_URL = "http://192.168.1.2:4000/api";

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
