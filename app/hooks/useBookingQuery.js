import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import {
  bookService,
  fetchMyService,
  terminateService
} from "../services/bookingService";

import useAuthStore from "../store/useAuthStore";

// =====================
// Fetch My Services
// =====================
export const useGetMyServices = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["my-services"],
    queryFn: fetchMyService,
    staleTime: () => {},
    enabled: !!token && hasHydrated,
  });

  return {
    data: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// =====================
// Book a Service
// =====================
export const useCreateBooking = ({
  onSuccessCallback,
  onErrorCallback,
  onRequireAction,
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => bookService(data),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        const outcome = response?.data?.case;

        if (outcome === "success") {
          // ✅ successful payment
          queryClient.invalidateQueries(["my-services"]);
          onSuccessCallback?.();
        } else if (outcome === "requires_action") {
          // ⚠️ requires OTP / 3DS
          onRequireAction?.(response?.data?.clientSecret,response?.data?.paymentMethod,response?.data?.intentId);
        } else if (outcome === "failed") {
          // ❌ failed
          onErrorCallback?.(
            response?.data?.message || "Payment failed!"
          );
        } else {
          // fallback
          onErrorCallback?.("Unexpected booking outcome!");
        }
      } else {
        // fallback error case (non-200 from backend)
        onErrorCallback?.(response?.error || "Service Booking Failed!");
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong while booking service!";
      onErrorCallback?.(msg);
    },
  });
};

// =====================
// Terminate Service
// =====================
export const useTerminateService = ({
  onSuccessCallback,
  onErrorCallback,
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => terminateService(id),
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
