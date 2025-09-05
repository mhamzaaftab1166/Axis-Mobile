import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchInboxNotifications,
  fetchUnreadNotificationCount,
  removeInboxNotification,
} from "../services/notificationService";
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
    isLoading: query.isPending,
  };
};

// Delete notification
export const useDeleteNotification = ({
  onSuccessCallback,
  onErrorCallback,
} = {}) => {
  const queryClient = useQueryClient();
  const deleteFromStore = useNotificationStore(
    (state) => state.deleteNotification
  );

  return useMutation({
    mutationFn: ({ indieId, notificationId }) =>
      removeInboxNotification(indieId, notificationId),
    onSuccess: (_, variables) => {
      // update zustand store
      deleteFromStore(variables.notificationId);

      // invalidate query so React Query refetches
      queryClient.invalidateQueries(["notifications", variables.indieId]);
      onSuccessCallback?.();
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};

// unread count query
export const useFetchUnreadCount = (indieId) => {
  const query = useQuery({
    queryKey: ["unreadCount", indieId],
    queryFn: () => fetchUnreadNotificationCount(indieId),
    enabled: !!indieId,
    refetchInterval: 10000,
  });

  return {
    count: query.data ?? 0,
    isError: query.isError,
    error: query.error,
    isLoading: query.isPending,
    refetch: query.refetch,
  };
};
