import { useQuery } from "@tanstack/react-query";
import {
    fetchPaymentHistory,
} from "../services/paymentsService";
import useAuthStore from "../store/useAuthStore";

// =====================
// Fetch Payment Methods
// =====================
export const useGetMyPaymentHistory = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["payment-history"],
    queryFn: fetchPaymentHistory,
    enabled: !!token && hasHydrated,
    staleTime: Infinity,          
    cacheTime: 0,                
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    data: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};