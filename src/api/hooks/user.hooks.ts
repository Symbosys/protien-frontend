import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface UserDetail {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: UserDetail[];
    totalUsers: number;
    pagination: {
      totalPage: number;
      currentPage: number;
      count: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: UserDetail;
}

export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
}

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: { page?: number; limit?: number; search?: string }) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 1. Hook: Get All Users (with search and pagination)
export const useUsersQuery = (params: { page?: number; limit?: number; search?: string } = {}) => {
  return useQuery<UsersResponse>({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<UsersResponse>("/user/all", {
        params,
      });
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// 2. Hook: Get Single User details by ID
export const useUserQuery = (id: string, enabled = true) => {
  return useQuery<UserResponse>({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<UserResponse>(`/user/${id}`);
      return response.data;
    },
    enabled: !!id && enabled,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// 3. Hook: Update User Profile Details
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse, Error, { id: string; data: UpdateUserParams }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put<UserResponse>(`/user/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Refresh user caches
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
};
