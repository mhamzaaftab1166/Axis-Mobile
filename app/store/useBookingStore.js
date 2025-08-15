// store/useBookingStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useBookingStore = create(
  persist(
    (set, get) => ({
      // ===== Initial State =====
      booking: {
        selectedServices: [],
        serviceTime: null,
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

      // ===== Service Time Actions =====
      setServiceTime: (time) => {
        const state = get();
        if (!state || !state.booking) return;

        set({
          ...state,
          booking: {
            ...state.booking,
            serviceTime: time,
          },
        });
      },

      // ===== Clear Booking =====
      clearBooking: () => {
        const state = get();
        if (!state) return;

        set({
          ...state,
          booking: {
            selectedServices: [],
            serviceTime: null,
          },
        });
      },
    }),
    {
      name: "booking-storage",
      storage: createJSONStorage(() => AsyncStorage),
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
