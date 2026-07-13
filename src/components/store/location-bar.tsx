"use client";

import { useUIStore } from "@/stores/ui-store";
import { useLocationStore } from "@/stores/location-store";
import { UI_STRINGS } from "@/lib/constants";

export function LocationBar() {
  const { language } = useUIStore();
  const { selectedArea, setMode } = useLocationStore();
  const isArabic = language === "ar";

  return (
    <div className="border-b border-store-border-dark bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-light text-text-primary">
            {isArabic ? UI_STRINGS.deliverToAr : UI_STRINGS.deliverTo}
          </span>
          <span className="text-sm font-bold text-text-primary">
            {selectedArea ||
              (isArabic ? UI_STRINGS.chooseLocationAr : UI_STRINGS.chooseLocation)}
          </span>
          <button
            onClick={() => {}}
            className="text-sm font-medium text-brand-orange"
          >
            {isArabic ? UI_STRINGS.editAr : UI_STRINGS.edit}
          </button>
        </div>
      </div>
      <div className="mt-1">
        <span className="text-sm font-light text-text-primary">
          {isArabic ? UI_STRINGS.earliestArrivalAr : UI_STRINGS.earliestArrival}
        </span>
      </div>
    </div>
  );
}
