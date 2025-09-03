import { useQuery } from "@tanstack/react-query";
import { fetchFaq } from "../services/faqService";

// ✅ Get all addresses
export const useGetAllFaq = () => {
  const query = useQuery({
    queryKey: ["faqs"],
    queryFn: () => fetchFaq(),
    staleTime: 30 * 60 * 1000
  });

  return {
    faqData: query?.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
