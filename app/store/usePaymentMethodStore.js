// store/usePaymentMethodStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const usePaymentMethodStore = create(
  persist(
    (set, get) => ({
      // ===== Initial State =====
      paymentMethods: [],

      // ===== Add Payment Method =====
      addPaymentMethod: (method) => {
        const state = get();
        if (!state) return;

        const exists = state.paymentMethods.find((m) => m._id === method._id);
        if (!exists) {
          set({
            ...state,
            paymentMethods: [...state.paymentMethods, method],
          });
        }
      },

      // ===== Remove Payment Method =====
      removePaymentMethod: (methodId) => {
        const state = get();
        if (!state) return;

        set({
          ...state,
          paymentMethods: state.paymentMethods.filter(
            (m) => m._id !== methodId
          ),
        });
      },

      // ===== Clear All Payment Methods =====
      clearPaymentMethods: () => {
        set({
          paymentMethods: [],
        });
      },
    }),
    {
      name: "payment-methods-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("[usePaymentMethodStore] Rehydrate error:", error);
        } else {
          console.log("[usePaymentMethodStore] Rehydrated successfully");
        }
      },
    }
  )
);

export default usePaymentMethodStore;