"use client";

import { Phone, MapPin, Clock, Navigation, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/translations";
import type { Branch } from "@/types";
import type { Locale } from "@/lib/translations";

interface BranchCardProps {
  branch: Branch;
  locale: Locale;
}

export default function BranchCard({ branch, locale }: BranchCardProps) {
  const name = locale === "ar" ? branch.nameAr : branch.name;
  const address = locale === "ar" ? branch.addressAr : branch.address;
  const hours = locale === "ar" ? branch.hoursAr : branch.hours;

  return (
    <div className="h-full rounded-2xl bg-white shadow-md overflow-hidden border-t-4 border-[#ff6600] p-6 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-2 min-h-[3.5rem] flex items-center">
        {name}
      </h3>

      <div className="space-y-3 text-sm text-gray-600 flex-1">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#ff6600]" />
          <span className="line-clamp-2">{address}</span>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#ff6600]" />
          <div className="flex flex-col" dir="ltr">
            {branch.phone.map((p) => (
              <a
                key={p}
                href={`tel:${p}`}
                className="hover:text-[#ff6600] transition-colors text-left"
              >
                {p}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 flex-shrink-0 text-[#ff6600]" />
          <span>{hours}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="outline" size="md" className="w-full h-10 text-xs sm:text-sm font-semibold">
            <Navigation className="w-4 h-4 mr-1" />
            {t("branch.get-directions", locale)}
          </Button>
        </a>
        <a href={`tel:${branch.phone[0]}`} className="flex-1">
          <Button variant="primary" size="md" className="w-full h-10 text-xs sm:text-sm font-semibold">
            <PhoneCall className="w-4 h-4 mr-1" />
            {t("branch.call-now", locale)}
          </Button>
        </a>
      </div>
    </div>
  );
}
