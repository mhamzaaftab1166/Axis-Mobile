import { create } from "zustand";

export const useSupServicesStore = create((set) => ({
  services: [],
  setServices: (services) => set({ services }),
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