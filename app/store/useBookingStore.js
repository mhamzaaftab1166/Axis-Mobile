// store/useBookingStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useBookingStore = create(
  persist(
    (set, get) => ({
      selectedServices: [],

      addService: (service) => {
        const exists = get().selectedServices.find((s) => s.id === service.id);
        if (!exists) {
          set((state) => ({
            selectedServices: [...state.selectedServices, service],
          }));
        }
      },

      removeService: (service) => {
        set((state) => ({
          selectedServices: state.selectedServices.filter(
            (s) => s.id !== service.id
          ),
        }));
      },

      toggleService: (service) => {
        const exists = get().selectedServices.find((s) => s.id === service.id);
        if (exists) {
          get().removeService(service);
        } else {
          get().addService(service);
        }
      },

      isSelected: (service) => {
        return !!get().selectedServices.find((s) => s.id === service.id);
      },

      clearAll: () => set({ selectedServices: [] }),
    }),
    {
      name: "booking-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // optional: helpful for debugging rehydrate errors
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("[useBookingStore] Rehydrate error:", error);
        } else {
          console.log("[useBookingStore] Rehydrated successfully");
        }
      },
    }
  )
);

export default useBookingStore;
