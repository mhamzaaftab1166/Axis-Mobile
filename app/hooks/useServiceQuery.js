import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllServices,
  fetchMyUpcomingSubs,
  fetchTopServices,
} from "../services/servicesService";
import useAuthStore from "../store/useAuthStore";

// 🔝 fetch top (popular) services
export const useGetTopServices = (role, addressId) => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["top-services",addressId],
    queryFn: () => fetchTopServices(addressId),
    staleTime: () => {},
    enabled: !!token && hasHydrated && role === "tenant" && !!addressId,
  });

  return {
    topServices: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useGetAllServices = (role, addressId) => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["all-services",addressId],
    queryFn: () => fetchAllServices(addressId),
    staleTime: () => {},
    enabled: !!token && hasHydrated && role === "tenant" && !!addressId,
  });

  return {
    allServices: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useGetUpcomingSubServices = (role) => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["upcoming-subs"],
    queryFn: () => fetchMyUpcomingSubs(),
    staleTime: 1000 * 60,
    enabled: !!token && hasHydrated && role === "tenant",
  });

  return {
    allSubs: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// utils/addressHelpers.js
export const updateAddressAndInvalidate = () => {
  const qc = useQueryClient();
  qc.invalidateQueries(["all-services"]);
  qc.invalidateQueries(["inspection-services"]);
  qc.invalidateQueries(["top-services"]);
};
