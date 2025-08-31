import { useQuery } from "@tanstack/react-query";
import { fetchAllServices, fetchTopServices } from "../services/servicesService";
import useAuthStore from "../store/useAuthStore";

// 🔝 fetch top (popular) services
export const useGetTopServices = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["top-services"],
    queryFn: () => fetchTopServices(), 
    staleTime: ()=>{},
    enabled: !!token && hasHydrated,
  });

  return {
    topServices: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useGetAllServices = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["all-services"],
    queryFn: () => fetchAllServices(),
    staleTime: ()=>{},
    enabled: !!token && hasHydrated,
  });

  return {
    allServices: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
