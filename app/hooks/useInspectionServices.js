import { useMutation, useQuery } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { bookInspectionService, fetchAllServices, fetchTopInspectionServices } from "../services/inspectionService";
import useAuthStore from "../store/useAuthStore";

// fetch top (popular) services
export const useGetInspectionServices = (role) => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["inspection-services"],
    queryFn: () => fetchTopInspectionServices(),
    staleTime: () => {},
    enabled: !!token && hasHydrated && role === "tenant",
  });

  return {
    services: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useGetAllInspectionServices = (role) => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["all-inspection-services"],
    queryFn: () => fetchAllServices(),
    staleTime: () => {},
    enabled: !!token && hasHydrated && role === "tenant",
  });

  return {
    services: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useBookInspectionService = ({ onSuccessCallback, onErrorCallback, onRequireAction } = {}) => {
  return useMutation({
    mutationFn: (data) => bookInspectionService(data),
    onSuccess: (response) => {
      console.log(response);
      if (response?.status === HttpStatusCode.Ok) {
        const outcome = response?.data?.case;
        if (outcome === "success") {
          // ✅ successful payment
          onSuccessCallback?.();
        } else if (outcome === "requires_action") {
          // ⚠️ requires OTP / 3DS
          onRequireAction?.(
            response?.data?.clientSecret,
            response?.data?.paymentMethod,
            response?.data?.intentId
          );
        } else if (outcome === "failed") {
          // ❌ failed
          onErrorCallback?.(response?.data?.message || "Payment failed!");
        } else {
          // fallback
          onErrorCallback?.("Unexpected booking outcome!");
        }
      } else if(response?.status === HttpStatusCode.Created){
        onSuccessCallback?.();
      }
      else {
        // fallback error case (non-200 from backend)
        onErrorCallback?.(response?.error || "Inspection Service Booking Failed!",response?.data?.serviceId);
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