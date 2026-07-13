import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DeliveryMode = "delivery" | "pickup";

interface LocationStore {
  mode: DeliveryMode;
  selectedArea: string | null;
  selectedBranchId: string | null;
  setMode: (mode: DeliveryMode) => void;
  setSelectedArea: (area: string) => void;
  setSelectedBranch: (branchId: string) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      mode: "delivery",
      selectedArea: null,
      selectedBranchId: null,
      setMode: (mode) => set({ mode }),
      setSelectedArea: (area) => set({ selectedArea: area }),
      setSelectedBranch: (branchId) => set({ selectedBranchId: branchId }),
    }),
    { name: "petstore-location" }
  )
);
