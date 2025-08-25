import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      role: null, 
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),

      clearAuth: () => {
        set({ token: null, role: null });
      }
    }),
    {
      name: 'auth-storage' 
    }
  )
);

export default useAuthStore;