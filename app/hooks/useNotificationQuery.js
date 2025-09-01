import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInboxNotifications, removeInboxNotification } from "../services/notificationService";
import useNotificationStore from "../store/useNotificationStore";


// Fetch notifications
export const useFetchNotifications = (indieId) => {
  const query = useQuery({
    queryKey: ["notifications", indieId],
    queryFn: () => fetchInboxNotifications(indieId),
    enabled: !!indieId,
  });

  return {
    data: query.data,
    isError: query.isError,
    error: query.error,
    isLoading: query.isPending
  }
};

// Delete notification
export const useDeleteNotification = (indieId) => {
  const queryClient = useQueryClient();
  const deleteFromStore = useNotificationStore((state) => state.deleteNotification);

  return useMutation({
    mutationFn: (notificationId) => removeInboxNotification(indieId, notificationId),
    onSuccess: (_, notificationId) => {
      // update zustand store
      deleteFromStore(notificationId);

      // invalidate query so React Query refetches
      queryClient.invalidateQueries(["notifications", indieId]);
    },
  });
};