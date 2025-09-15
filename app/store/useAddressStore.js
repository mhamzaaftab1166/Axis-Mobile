import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAddressStore = create(
  persist(
    (set, get) => ({
      selectedAddress: null,
      addresses: [],
      hasHydrated: false,

      setHasHydrated: () => set({ hasHydrated: true }),

      setAddress: (address) => set({ selectedAddress: address }),
      clearAddress: () => set({ selectedAddress: null }),

      setAddresses: (addresses) => set({ addresses }),

      ensureDefault: (defaultAddress) => {
        const current = get().selectedAddress;
        if (!current) {
          set({
            selectedAddress: defaultAddress || get().addresses[0] || null,
          });
        }
      },

      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),

      updateAddress: (id, updatedData) =>
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? { ...addr, ...updatedData } : addr
          ),
        })),

      removeAddress: (id) =>
        set((state) => {
          const newAddresses = state.addresses.filter((addr) => addr.id !== id);
          let newSelected = state.selectedAddress;
          if (state.selectedAddress?.id === id) {
            newSelected = newAddresses.length > 0 ? newAddresses[0] : null;
          }
          return { addresses: newAddresses, selectedAddress: newSelected };
        }),

      clearAddresses: () => set({ addresses: [], selectedAddress: null }),

      validateSelectedAddress: () => {
        const { selectedAddress, addresses } = get();
        const exists = addresses.some(
          (addr) => addr.id === selectedAddress?.id
        );
        if (!exists) {
          set({ selectedAddress: addresses.length > 0 ? addresses[0] : null });
        }
      },
    }),
    {
      name: "address-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        state?.setHasHydrated();
        if (error) console.warn("[useAddressStore] Rehydrate error:", error);
      },
    }
  )
);

export default useAddressStore;
