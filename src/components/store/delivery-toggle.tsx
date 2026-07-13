"use client";

import { useLocationStore } from "@/stores/location-store";
import { useUIStore } from "@/stores/ui-store";
import { UI_STRINGS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DeliveryToggle() {
  const { mode, setMode } = useLocationStore();
  const { language } = useUIStore();
  const isArabic = language === "ar";

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setMode("delivery")}
        className={cn(
          "flex h-[38.75px] w-[80px] items-center justify-center rounded-[3px] border border-text-medium text-[12.25px] font-bold transition-colors",
          mode === "delivery"
            ? "border-brand-orange bg-brand-orange text-white"
            : "bg-transparent text-text-medium"
        )}
      >
        {isArabic ? UI_STRINGS.deliveryAr : UI_STRINGS.delivery}
      </button>
      <button
        onClick={() => setMode("pickup")}
        className={cn(
          "flex h-[38.75px] w-[80px] items-center justify-center rounded-[3px] border border-text-medium text-[12.25px] font-bold transition-colors",
          mode === "pickup"
            ? "border-brand-orange bg-brand-orange text-white"
            : "bg-transparent text-text-medium"
        )}
      >
        {isArabic ? UI_STRINGS.pickupAr : UI_STRINGS.pickup}
      </button>
    </div>
  );
}
