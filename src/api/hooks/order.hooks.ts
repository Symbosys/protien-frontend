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
  cashfreeOrderId?: string | null;
  cashfreePaymentId?: string | null;
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
  addressId?: string;
}

export interface CreateOrderResponse {
  order: DBOrder;
  razorpayOrder?: {
    id: string;
    amount: number;
    currency: string;
    key?: string;
  };
  cashfreeOrder?: {
    paymentSessionId: string;
    cfOrderId: string;
    orderId: string;
    orderAmount: number;
    orderCurrency: string;
    sandbox: boolean;
  };
}

export interface VerifyPaymentInput {
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  cashfreeOrderId?: string;
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateOrderResponse, Error, CreateOrderInput>({
    mutationFn: async (data) => {
      const response = await apiClient.post<{
        success: boolean;
        data: DBOrder | CreateOrderResponse;
      }>("/order/checkout", data);
      
      const result = response.data.data;
      if (result && "order" in result) {
        return result as CreateOrderResponse;
      }
      return { order: result as DBOrder };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      // Invalidate cart as well because backend creates order from cart
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useVerifyPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DBOrder, Error, VerifyPaymentInput>({
    mutationFn: async (data) => {
      const response = await apiClient.post<{ success: boolean; data: DBOrder }>(
        "/order/verify-payment",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DBOrder, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.put<{ success: boolean; data: DBOrder }>(
        `/order/${id}/cancel`
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

