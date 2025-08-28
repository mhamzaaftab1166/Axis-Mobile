import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useServicesStore = create(
  persist(
    (set, get) => ({
      hasHydrated: false,

      popularServices: [],
      allServices: [],    

      setPopularServices: (popularServices) => set({ popularServices }),
      setAllServices: (allServices) => set({ allServices }),

      setHasHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "service-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        state?.setHasHydrated();
        if (error) {
          console.warn("[useServicesStore] Rehydrate error:", error);
        } else {
          console.log("[useServicesStore] Rehydrated successfully");
        }
      },
    }
  )
);

export default useServicesStore;
