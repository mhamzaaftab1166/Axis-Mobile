import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { useEffect } from "react";
import {
  bookInspectionService, completeInspectionPendingPayment, completeInspectionQuotationPayment,
  fetchAllServices, fetchAssignedServices, fetchMyInspectionService,
  fetchTopInspectionServices, rejectQuotation, submitQuotation,
  terminateService
} from "../services/inspectionService";
import useAuthStore from "../store/useAuthStore";
import { useSupServicesStore } from "../store/useSupServicesStore";

// fetch top (popular) services
export const useGetInspectionServices = (role,addressId) => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["inspection-services",addressId],
    queryFn: () => fetchTopInspectionServices(addressId),
    staleTime: ()=>{},
    enabled: !!token && hasHydrated && role === "tenant" && !!addressId,
  });

  return {
    data: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useGetAllInspectionServices = (role, addressId) => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["all-inspection-services",addressId],
    queryFn: () => fetchAllServices(addressId),
    staleTime: () => {},
    enabled: !!token && hasHydrated && role === "tenant" && !!addressId,
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
      if (response?.status === HttpStatusCode.Ok) {
        const outcome = response?.data?.case;
        if (outcome === "success") {
          // successful payment
          onSuccessCallback?.();
        } else if (outcome === "requires_action") {
          // requires OTP / 3DS
          onRequireAction?.(
            response?.data?.clientSecret,
            response?.data?.paymentMethod,
            response?.data?.intentId
          );
        } else if (outcome === "failed") {
          // failed
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

// fetch top (popular) services
export const useGetMyInspectionBookings = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["my-inspection-bookings"],
    queryFn: () => fetchMyInspectionService(),
    staleTime: 1000 * 5,
    enabled: !!token && hasHydrated
  });

  return {
    services: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// Supervisor fetch and update inspection services
export const useGetMyInspeServices = () => {
  const { token, hasHydrated } = useAuthStore();

  const setServices = useSupServicesStore((s) => s.setInspectionServices);

  const query = useQuery({
    queryKey: ["assigned-inspection-services"],
    queryFn: () => fetchAssignedServices(),
    staleTime: 1000 * 60 * 15,
    enabled: !!token && hasHydrated
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

// Supervisor fetch and update inspection services
export const useSubmitQuotation = ({ onSuccessCallback, onErrorCallback } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => submitQuotation(data),
    onSuccess: (response,variables) => {
      if (response?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.(variables);
        qc.invalidateQueries(["assigned-inspection-services"]);
      }
      else {
        // fallback error case (non-200 from backend)
        onErrorCallback?.(response?.error || "Inspection Service Booking Failed!",response?.data?.serviceId);
      }
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || error?.message || "Something went wrong while booking service!";
      onErrorCallback?.(msg);
    },
  });
};

// Complete inspection service payment
export const useCompleteInspectionPayment = ({ onSuccessCallback, onErrorCallback, onRequireAction } = {}) => {
  return useMutation({
    mutationFn: (data) => completeInspectionQuotationPayment(data),
    onSuccess: (response) => {
      console.log(response);
      if (response?.status === HttpStatusCode.Ok) {
        const outcome = response?.data?.case;

        if (outcome === "success") {
          onSuccessCallback?.();
        } else if (outcome === "requires_action") {
          // requires OTP / 3DS
          onRequireAction?.(
            response?.data?.clientSecret,
            response?.data?.paymentMethod,
            response?.data?.intentId
          );
        } else if (outcome === "failed") {
          // failed
          onErrorCallback?.(response?.data?.message || "Payment failed!");
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
      console.log(error);
      const msg = error?.response?.data?.error || error?.message || "Something went wrong while booking service!";
      onErrorCallback?.(msg);
    },
  });
};

// Supervisor fetch and update inspection services
export const useRejectQuotation = ({ onSuccessCallback, onErrorCallback } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => rejectQuotation(id),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.();
        qc.invalidateQueries(["inspection-services"]);
      }
      else {
        onErrorCallback?.(response?.error || "Inspection Service Booking Failed!",response?.data?.serviceId);
      }
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || error?.message || "Something went wrong while booking service!";
      onErrorCallback?.(msg);
    },
  });
};

// Supervisor fetch and update inspection services
export const useTerminateService = ({ onSuccessCallback, onErrorCallback } = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => terminateService(id),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.();
        qc.invalidateQueries(["inspection-services"]);
      }
      else {
        onErrorCallback?.(response?.error || "Inspection Service Booking Failed!",response?.data?.serviceId);
      }
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || error?.message || "Something went wrong while booking service!";
      onErrorCallback?.(msg);
    },
  });
};

// pay for service
export const usePayForPendingService = ({ onSuccessCallback, onErrorCallback, onRequireAction } = {}) => {
  return useMutation({
    mutationFn: (data) => completeInspectionPendingPayment(data),
    onSuccess: (response) => {
      console.log(response);
      if (response?.status === HttpStatusCode.Ok) {
        const outcome = response?.data?.case;

        if (outcome === "success") {
          onSuccessCallback?.();
        } else if (outcome === "requires_action") {
          // requires OTP / 3DS
          onRequireAction?.(response?.data?.clientSecret, response?.data?.paymentMethod, response?.data?.intentId);
        } else if (outcome === "failed") {
          // failed
          onErrorCallback?.(response?.data?.message || "Payment failed!");
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
      const msg = error?.response?.data?.error || error?.message || "Something went wrong while booking service!";
      onErrorCallback?.(msg);
    },
  });
};