import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      indieId: null,
      hasHydrated: false,
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      setIndieId: (indieId) => set({ indieId }),
      setHasHydrated: () => set({ hasHydrated: true }),
      clearAuth: () => set({ token: null, role: null, indieId: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state,error) => {
        state?.setHasHydrated();
        if (error) {
          console.warn("[useAuthStore] Rehydrate error:", error);
        } else {
          console.log("[useAuthStore] Rehydrated successfully");
        }
      },
    }
  )
);

export default useAuthStore;