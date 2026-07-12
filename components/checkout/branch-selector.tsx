"use client";

import { Check, MapPin, Clock } from "@/lib/icons";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/translations";

interface BranchSelectorBranch {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  hours: string;
  hoursAr: string;
}

interface BranchSelectorProps {
  branches: BranchSelectorBranch[];
  locale: Locale;
}

export default function BranchSelector({ branches, locale }: BranchSelectorProps) {
  const { selectedBranch, setSelectedBranch } = useCartStore();

  return (
    <div className="space-y-3">
      {branches.map((branch) => {
        const isSelected = selectedBranch === branch.id;
        const name = locale === "ar" ? branch.nameAr : branch.name;
        const address = locale === "ar" ? branch.addressAr : branch.address;
        const hours = locale === "ar" ? branch.hoursAr : branch.hours;

        return (
          <button
            key={branch.id}
            onClick={() => setSelectedBranch(branch.id)}
            className={cn(
              "w-full text-left rounded-xl border-2 p-4 transition-all",
              isSelected ? "border-[#ff6600] bg-[#fff3e6]" : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{name}</h4>
                  {isSelected && <Check className="w-4 h-4 text-[#ff6600]" />}
                </div>
                <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{address}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{hours}</span>
                  </div>
                </div>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1",
                isSelected ? "border-[#ff6600]" : "border-gray-300"
              )}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6600]" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
