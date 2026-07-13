import { create } from "zustand";

export type Language = "en" | "ar";

interface UIStore {
  language: Language;
  isRTL: boolean;
  cartSheetOpen: boolean;
  filterSheetOpen: boolean;
  locationSheetOpen: boolean;
  searchQuery: string;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setCartSheetOpen: (open: boolean) => void;
  setFilterSheetOpen: (open: boolean) => void;
  setLocationSheetOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  language: "en",
  isRTL: false,
  cartSheetOpen: false,
  filterSheetOpen: false,
  locationSheetOpen: false,
  searchQuery: "",
  setLanguage: (lang) => set({ language: lang, isRTL: lang === "ar" }),
  toggleLanguage: () =>
    set((state) => ({
      language: state.language === "en" ? "ar" : "en",
      isRTL: state.language === "en",
    })),
  setCartSheetOpen: (open) => set({ cartSheetOpen: open }),
  setFilterSheetOpen: (open) => set({ filterSheetOpen: open }),
  setLocationSheetOpen: (open) => set({ locationSheetOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
