import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface DBOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  productName: string;
  productImage: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  longitude: string | null;
  latitude: string | null;
  note: string | null;
  placedAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: DBOrderItem[];
}

export const orderKeys = {
  all: ["orders"] as const,
  list: (params?: Record<string, any>) => [...orderKeys.all, "list", params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export const useOrderDetailQuery = (id: string, enabled = true) => {
  return useQuery<DBOrder>({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DBOrder }>(`/order/${id}`);
      return response.data.data;
    },
    enabled: enabled && !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useMyOrdersQuery = () => {
  return useQuery<DBOrder[]>({
    queryKey: orderKeys.list(),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DBOrder[] }>("/order/my-orders");
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export interface CreateOrderInput {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  paymentMethod?: string;
  note?: string;
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DBOrder, Error, CreateOrderInput>({
    mutationFn: async (data) => {
      const response = await apiClient.post<{ success: boolean; data: DBOrder }>(
        "/order/checkout",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.list() });
      // Invalidate cart as well because backend creates order from cart,
      // and we probably want cart to refresh (it's empty now).
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
