import { useQuery } from "@tanstack/react-query";
import {
  fetchAllServices,
  fetchTopServices,
} from "../services/servicesService";
import useAuthStore from "../store/useAuthStore";

// 🔝 fetch top (popular) services
export const useGetTopServices = (role) => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["top-services"],
    queryFn: () => fetchTopServices(),
    staleTime: () => {},
    enabled: !!token && hasHydrated && role === "tenant",
  });

  return {
    topServices: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useGetAllServices = (role) => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["all-services"],
    queryFn: () => fetchAllServices(),
    staleTime: () => {},
    enabled: !!token && hasHydrated && role === "tenant",
  });

  return {
    allServices: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
