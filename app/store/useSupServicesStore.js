import { create } from "zustand";

export const useSupServicesStore = create((set) => ({
  services: [],
  stats: {
    previous: 0,
    assigned: 0,
  },

  setServices: (services) => set({ services }),

  setStats: (stats) =>
    set({
      stats: {
        previous: stats?.previous ?? 0,
        assigned: stats?.assigned ?? 0,
      },
    }),

  moveFromAssignedToPrevious: () =>
    set((state) => ({
      stats: {
        ...state.stats,
        previous: state.stats.previous + 1,
        assigned: Math.max(state.stats.assigned - 1, 0), 
      },
    })),

  updateServiceStatus: (serviceId, subId, newStatus) =>
    set((state) => ({
      services: state.services.map((svc) =>
        svc.id !== serviceId
          ? svc
          : {
              ...svc,
              subServices: svc.subServices.map((s) =>
                s.id !== subId ? s : { ...s, status: newStatus }
              ),
            }
      ),
    })),
}));