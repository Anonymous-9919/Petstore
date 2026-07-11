"use client";

import { Truck, Store, MapPin, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/translations";

interface TrustBadgesProps {
  locale: Locale;
}

const badgeData = [
  {
    icon: Truck,
    key: "delivery",
    title: { en: "Fast Delivery", ar: "توصيل سريع" },
    subtitle: { en: "Same-day across Kuwait", ar: "في نفس اليوم لجميع أنحاء الكويت" },
  },
  {
    icon: Store,
    key: "pickup",
    title: { en: "In-Store Pickup", ar: "استلام من الفرع" },
    subtitle: { en: "Pick up from 3 branches", ar: "استلام من 3 فروع" },
  },
  {
    icon: MapPin,
    key: "locations",
    title: { en: "3 Locations", ar: "3 فروع" },
    subtitle: { en: "Salmiya, Al Rai & Mahboula", ar: "السالمية والري والهبولة" },
  },
  {
    icon: Shield,
    key: "quality",
    title: { en: "Quality Products", ar: "منتجات عالية الجودة" },
    subtitle: { en: "Trusted brands for your pets", ar: "علامات تجارية موثوقة لحيواناتك" },
  },
];

export function TrustBadges({ locale }: TrustBadgesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badgeData.map((badge) => (
        <div
          key={badge.key}
          className={cn(
            "flex flex-col items-center text-center gap-2 rounded-xl p-4",
            "bg-gray-50"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-[#fff3e6] flex items-center justify-center">
            <badge.icon className="w-5 h-5 text-[#ff6600]" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">
              {locale === "ar" ? badge.title.ar : badge.title.en}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {locale === "ar" ? badge.subtitle.ar : badge.subtitle.en}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
