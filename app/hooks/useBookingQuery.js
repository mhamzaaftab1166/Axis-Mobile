import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { useEffect } from "react";
import {
  bookService,
  fetchMyService,
  fetchMyServices,
  fetchSubService,
  fetchSupServiceStats,
  terminateService,
  updateSubService
} from "../services/bookingService";
import useAuthStore from "../store/useAuthStore";
import { useSupServicesStore } from "../store/useSupServicesStore";

// =====================r
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
        onErrorCallback?.(response?.error || "Service Booking Failed!",response?.data?.serviceId);
      }
    },
    onError: (error) => {
      console.log(error);
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
        queryClient.invalidateQueries(["my-services"]);
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

// =====================
// Fetch My Services
// =====================
export const useGetSubServices = (serviceId) => {
  const query = useQuery({
    queryKey: ["subservices",serviceId],
    queryFn: ()=>fetchSubService(serviceId),
    staleTime: () => {},
    enabled: !!serviceId,
  });

  return {
    data: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// =====================
// Fetch My Services
// =====================
export const useGetSupServices = () => {
  const setServices = useSupServicesStore((s) => s.setServices);

  const query = useQuery({
    queryKey: ["supervisor-services"],
    queryFn: fetchMyServices,
    staleTime: 1000 * 60 * 15,
  });

  useEffect(() => {
    if (query.data) {
      setServices(query.data?.data || []);
    }
  }, [query.data, setServices]);

  return {
    data: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// =====================
// Fetch My Stats
// =====================
export const useGetSupervisorStats = () => {
  const query = useQuery({
    queryKey: ["supervisor-stats"],
    queryFn: fetchSupServiceStats,
    staleTime: 1000 * 60 * 15,
  });

  return {
    data: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// =====================
// Update a Sub-Service
// =====================
export const useUpdateSubServiceStatus = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: (data) => updateSubService(data),
    onSuccess: (response, variables) => {
      if (response?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.(variables);
      } else {
        onErrorCallback?.(response?.error || "Failed to update sub-service status");
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