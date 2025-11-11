import { create } from "zustand";

export const useSupServicesStore = create((set) => ({
  services: [],
  inspectionServices: [],

  stats: {
    previous: 0,
    assigned: 0,
  },

  setServices: (services) => set({ services }),
  setInspectionServices: (inspectionServices) => set({ inspectionServices }),

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

  // update service status by ID
  updateInspectionServiceStatus: (serviceId, newStatus) =>
    set((state) => ({
      inspectionServices: state.inspectionServices.map((inspection) =>
        inspection.id === serviceId
          ? { ...inspection, serviceStatus: newStatus }
          : inspection
      ),
    })),

  updateQuotation: (serviceId, quotation) =>
    set((state) => ({
      inspectionServices: state.inspectionServices.map((inspection) =>
        inspection.id === serviceId
          ? { ...inspection, quotation }
          : inspection
      ),
    })),
}));