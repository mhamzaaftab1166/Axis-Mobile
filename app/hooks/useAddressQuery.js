import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

// save (add/update) address
export const useSaveAddress = ({ onSuccessCallback, onErrorCallback } = {}) => {
  const qc = useQueryClient();

  return useMutation({
    // 🔑 single mutationFn handles both add & update
    mutationFn: (data) => {
      if (data?.id) {
        return updateAddress(data?.id, data);
      } else {
        return addAddress(data);
      }
    },
    onSuccess: (response) => {
      const resData = response?.data || response; 
      // Handle add
      if (response?.status === HttpStatusCode.Ok || resData?.status === HttpStatusCode.Created) {
        onSuccessCallback?.(resData?.data || response?.data);
        qc.invalidateQueries(["addresses"]);
      } else {
        onErrorCallback?.(
          resData?.error || response?.error || "Save address failed"
        );
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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => removeAddress(id),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.();
        qc.invalidateQueries(["addresses"]);
      } else {
        onErrorCallback?.(response?.error || "Remove failed");
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
    buildingsData: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};