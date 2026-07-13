"use client";

import { SlidersHorizontal } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { UI_STRINGS } from "@/lib/constants";

export function FilterSortButton() {
  const { language, setFilterSheetOpen } = useUIStore();
  const isArabic = language === "ar";

  return (
    <button
      onClick={() => setFilterSheetOpen(true)}
      className="flex items-center gap-2 rounded-[3px] border border-store-border bg-white px-2 py-1.5 text-xs font-bold text-text-dark"
    >
      <SlidersHorizontal className="h-4 w-4" />
      {isArabic ? UI_STRINGS.filterSortAr : UI_STRINGS.filterSort}
    </button>
  );
}
