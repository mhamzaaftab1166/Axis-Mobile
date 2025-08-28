import { useMutation, useQuery } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { addAddress, fetchAddress, fetchBuildingsInformation, removeAddress, updateAddress } from "../services/addressService";
import useAuthStore from "../store/useAuthStore";

// ✅ Get all addresses
export const useGetAllAddress = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["addresses"],
    queryFn: () => fetchAddress(),
    staleTime: 10 * 60 * 1000,
    enabled: !!token && hasHydrated
  });

  return {
    allAddresses: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// ✅ Add new address
export const useAddNewAddress = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: (data) => addAddress(data),
    onSuccess: (response) => {
      const resData = response?.data;
      if (resData?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.(resData?.data);
      } else {
        onErrorCallback?.(resData?.error || "Failed to add address");
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error || error?.message || "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};

// ✅ Update address
export const useUpdateAddress = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateAddress(id, data),
    onSuccess: (response) => {
      const resData = response?.data;
      if (resData?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.(resData?.data);
      } else if (resData?.status === HttpStatusCode.Forbidden) {
        onSuccessCallback?.(null);
      } else {
        onErrorCallback?.(resData?.error || "Update failed");
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error || error?.message || "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};

// ✅ Remove address
export const useRemoveAddress = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: (id) => removeAddress(id),
    onSuccess: (response) => {
      const resData = response?.data;
      if (resData?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.(resData?.data);
      } else if (resData?.status === HttpStatusCode.Forbidden) {
        onSuccessCallback?.(null);
      } else {
        onErrorCallback?.(resData?.error || "Remove failed");
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error || error?.message || "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};

// fetch building information
export const useGetAllBuildingInfo = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["buildings-info"],
    queryFn: () => fetchBuildingsInformation(),
    staleTime: 10 * 60 * 1000,
    enabled: !!token && hasHydrated
  });

  return {
    allAddresses: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};