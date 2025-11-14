import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAddressStore = create(
  persist(
    (set, get) => ({
      selectedAddress: undefined,
      addresses: [],
      hasHydrated: false,

      setHasHydrated: () => set({ hasHydrated: true }),

      // Set / clear current selected address
      setAddress: (address) => set({ selectedAddress: address }),
      clearAddress: () => set({ selectedAddress: null }),

      // Replace the whole addresses list
      setAddresses: (addresses) => set({ addresses }),

      // Ensure a default address is selected if none exists
      ensureDefault: (defaultAddress) => {
        const current = get().selectedAddress;
        if (!current) {
          set({
            selectedAddress: defaultAddress || get().addresses[0] || null,
          });
        }
      },

      // Add new address to list
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),

      // Update address by _id
      updateAddress: (id, updatedData) =>
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr._id === id ? { ...addr, ...updatedData } : addr
          ),
        })),

      // Remove address by _id
      removeAddress: (id) =>
        set((state) => {
          const newAddresses = state.addresses.filter(
            (addr) => addr._id !== id
          );
          let newSelected = state.selectedAddress;
          if (state.selectedAddress?._id === id) {
            newSelected = newAddresses.length > 0 ? newAddresses[0] : null;
          }
          return { addresses: newAddresses, selectedAddress: newSelected };
        }),

      // Clear all addresses + selected
      clearAddresses: () => set({ addresses: [], selectedAddress: null }),

      // Make sure selectedAddress still exists in list
      validateSelectedAddress: () => {
        const { selectedAddress, addresses } = get();

        if (addresses.length === 0) {
          // No addresses left → clear selected as well
          set({ selectedAddress: null });
          return;
        }

        const exists = addresses.some(
          (addr) => addr._id === selectedAddress?._id
        );

        if (!exists) {
          set({ selectedAddress: addresses[0] });
        }
      },

      // ✅ Clear persisted data when user logs out
      resetStore: async () => {
        await AsyncStorage.removeItem("address-storage");
        set({
          selectedAddress: null,
          addresses: [],
          hasHydrated: false,
        });
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
