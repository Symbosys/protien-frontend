import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface RequestOtpParams {
  phoneNumber: string;
}

export interface RequestOtpResponse {
  success: boolean;
  message: string;
  data: {
    phoneNumber: string;
    otp: string;
  };
}

export interface VerifyOtpParams {
  phoneNumber: string;
  otp: string;
}

export interface UserProfile {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  role: "CUSTOMER" | "ADMIN";
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserProfile;
}

export interface AdminRegisterParams {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface AdminLoginParams {
  email: string;
  password?: string;
}

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserProfile;
}

// 1. Hook: Request OTP
export const useRequestOtpMutation = () => {
  return useMutation<RequestOtpResponse, Error, RequestOtpParams>({
    mutationFn: async (data) => {
      const response = await apiClient.post<RequestOtpResponse>("/user/request-otp", data);
      return response.data;
    },
  });
};

// 2. Hook: Verify OTP
export const useVerifyOtpMutation = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpParams>({
    mutationFn: async (data) => {
      const response = await apiClient.post<VerifyOtpResponse>("/user/verify-otp", data);
      return response.data;
    },
  });
};

// 3. Hook: Logout
export const useLogoutMutation = () => {
  return useMutation<{ success: boolean; message: string }, Error, void>({
    mutationFn: async () => {
      const response = await apiClient.post<{ success: boolean; message: string }>("/user/logout");
      return response.data;
    },
  });
};

// 4. Hook: Admin Register
export const useAdminRegisterMutation = () => {
  return useMutation<AdminAuthResponse, Error, AdminRegisterParams>({
    mutationFn: async (data) => {
      const response = await apiClient.post<AdminAuthResponse>("/user/admin/register", data);
      return response.data;
    },
  });
};

// 5. Hook: Admin Login
export const useAdminLoginMutation = () => {
  return useMutation<AdminAuthResponse, Error, AdminLoginParams>({
    mutationFn: async (data) => {
      const response = await apiClient.post<AdminAuthResponse>("/user/admin/login", data);
      return response.data;
    },
  });
};
