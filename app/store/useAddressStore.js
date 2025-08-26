// store/useAddressStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAddressStore = create(
  persist(
    (set, get) => ({
      selectedAddress: null,

      setAddress: (address) => {
        set({ selectedAddress: address });
      },

      clearAddress: () => {
        set({ selectedAddress: null });
      },

      ensureDefault: (defaultAddress) => {
        const current = get().selectedAddress;
        if (!current && defaultAddress) {
          set({ selectedAddress: defaultAddress });
        }
      },
    }),
    {
      name: "address-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("[useAddressStore] Rehydrate error:", error);
        } else {
          console.log("[useAddressStore] Rehydrated successfully");
        }
      },
    }
  )
);

export default useAddressStore;
