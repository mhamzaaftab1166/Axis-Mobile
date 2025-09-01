// store/useNotificationStore.js
import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],

  setNotifications: (notifications) => set({ notifications }),

  deleteNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (n) => n.notification_id !== notificationId
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;
