// store/useBookingStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useBookingUpdateStore = create(
  persist(
    (set, get) => ({
      // ===== Initial State =====
      booking: {
        selectedServices: [],
      },

      // ===== Service Actions =====
      addService: (service) => {
        const state = get();
        if (!state || !state.booking) return;

        const exists = state.booking.selectedServices.find(
          (s) => s.id === service.id
        );
        if (!exists) {
          set({
            ...state,
            booking: {
              ...state.booking,
              selectedServices: [...state.booking.selectedServices, service],
            },
          });
        }
      },

      removeService: (service) => {
        const state = get();
        if (!state || !state.booking) return;

        set({
          ...state,
          booking: {
            ...state.booking,
            selectedServices: state.booking.selectedServices.filter(
              (s) => s.id !== service.id
            ),
          },
        });
      },

      toggleService: (service) => {
        const state = get();
        if (!state || !state.booking) return;

        const exists = state.booking.selectedServices.find(
          (s) => s.id === service.id
        );
        if (exists) {
          get().removeService(service);
        } else {
          get().addService(service);
        }
      },

      isSelected: (service) => {
        const state = get();
        if (!state || !state.booking) return false;

        return !!state.booking.selectedServices.find(
          (s) => s.id === service.id
        );
      },

      // ===== Clear Booking =====
      clearBooking: () => {
        const state = get();
        if (!state) return;

        set({
          ...state,
          booking: {
            selectedServices: [],
          },
        });
      },
    }),
    {
      name: "booking-update-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("[useBookingUpdateStore] Rehydrate error:", error);
        } else {
          console.log("[useBookingUpdateStore] Rehydrated successfully");
        }
      },
    }
  )
);

export default useBookingUpdateStore;
