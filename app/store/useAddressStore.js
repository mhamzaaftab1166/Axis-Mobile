import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAddressStore = create(
  persist(
    (set, get) => ({
      addresses: [], 
      hasHydrated: false,

      // ✅ Actions
      setHasHydrated: () => set({ hasHydrated: true }),

      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, address],
        })),

      updateAddress: (id, updatedData) =>
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? { ...addr, ...updatedData } : addr
          ),
        })),

      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr.id !== id),
        })),

      clearAddresses: () => set({ addresses: [] }),
    }),
    {
      name: 'address-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        state?.setHasHydrated();
        if (error) {
          console.warn('[useAddressStore] Rehydrate error:', error);
        } else {
          console.log('[useAddressStore] Rehydrated successfully');
        }
      },
    }
  )
);

export default useAddressStore;
