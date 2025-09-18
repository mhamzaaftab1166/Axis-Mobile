import { useQuery } from "@tanstack/react-query";
import {
  getLoyaltyPointsHistory
} from "../services/loyaltyPoints";
import useAuthStore from "../store/useAuthStore";

export const useGetLoyaltyPoints = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["loyalty-points"],
    queryFn: getLoyaltyPointsHistory,
    stale: ()=>{},
    enabled: !!token && hasHydrated,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
