import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { addPaymentMethod, getPaymentMethods, removePaymentMethod, } from "../services/paymentMethodService";
import useAuthStore from "../store/useAuthStore";

// =====================
// Fetch Payment Methods
// =====================
export const useGetPaymentMethods = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
    staleTime: 10 * 60 * 1000, 
    enabled: !!token && hasHydrated,
  });

  return {
    data: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  }
};

// =====================
// Add Payment Method
// =====================
export const useSavePaymentMethod = ({ onSuccessCallback, onErrorCallback } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => addPaymentMethod(data),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        queryClient.invalidateQueries(["payment-methods"]);
        onSuccessCallback?.();
      } else {
        onErrorCallback?.(response?.error || "Payment Method Creation Failed!");
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};

// =====================
// Remove Payment Method
// =====================
export const useRemovePaymentMethod = ({ onSuccessCallback, onErrorCallback } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => removePaymentMethod(id),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        queryClient.invalidateQueries(["payment-methods"]);
        onSuccessCallback?.();
      } else {
        onErrorCallback?.(response?.error || "Failed to remove payment method");
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};