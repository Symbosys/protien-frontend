import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface DBAddress {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  pincode: string;
  locality: string | null;
  address: string;
  city: string;
  state: string;
  longitude: number | null;
  latitude: number | null;
  type: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const addressKeys = {
  all: ["addresses"] as const,
  list: () => [...addressKeys.all, "list"] as const,
  detail: (id: string) => [...addressKeys.all, "detail", id] as const,
};

// 1. Hook to fetch all user addresses
export const useAddressesQuery = () => {
  return useQuery<DBAddress[]>({
    queryKey: addressKeys.list(),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DBAddress[] }>("/address");
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// 2. Hook to fetch a single address by ID
export const useAddressDetailQuery = (id: string, enabled = true) => {
  return useQuery<DBAddress>({
    queryKey: addressKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DBAddress }>(`/address/${id}`);
      return response.data.data;
    },
    enabled: enabled && !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// 3. Hook to add a new address
export const useAddAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<DBAddress, "id" | "userId" | "createdAt" | "updatedAt">) => {
      const response = await apiClient.post<{ success: boolean; data: DBAddress }>("/address", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};

// 4. Hook to update an address
export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Omit<DBAddress, "id" | "userId" | "createdAt" | "updatedAt">> }) => {
      const response = await apiClient.put<{ success: boolean; data: DBAddress }>(`/address/${id}`, payload);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({ queryKey: addressKeys.detail(data.id) });
    },
  });
};

// 5. Hook to delete an address
export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<{ success: boolean; data: null }>(`/address/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};

// 6. Hook to set an address as default
export const useSetDefaultAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.put<{ success: boolean; data: DBAddress }>(`/address/${id}/default`);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({ queryKey: addressKeys.detail(data.id) });
    },
  });
};
