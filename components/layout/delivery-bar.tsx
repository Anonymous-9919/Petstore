"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/lib/locale";
import { useCartStore } from "@/lib/store";
import { Truck, Store, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ps_fulfillment_method";
const BRANCH_KEY = "ps_selected_branch";

interface Branch {
  id: string;
  name: string;
  nameAr: string;
  pickupAvailable: boolean;
  active: boolean;
}

const AREAS = ["Ahmadi", "Farwaniya", "Hawalli", "Jahra", "Capital", "Mubarak Al-Kabeer"];

export default function DeliveryBar() {
  const { locale } = useLocale();
  const { deliveryMethod, selectedBranch, setDeliveryMethod, setSelectedBranch } = useCartStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [areaOpen, setAreaOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    fetch("/api/branches/public")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBranches(data.filter((b: Branch) => b.active && b.pickupAvailable)))
      .catch(() => {});
    try {
      const savedMethod = window.sessionStorage.getItem(STORAGE_KEY);
      const savedBranch = window.sessionStorage.getItem(BRANCH_KEY);
      if (savedMethod === "delivery" || savedMethod === "pickup") setDeliveryMethod(savedMethod);
      if (savedBranch) setSelectedBranch(savedBranch);
    } catch {}
  }, []);

  const chooseMethod = (method: "delivery" | "pickup") => {
    setDeliveryMethod(method);
    try { window.sessionStorage.setItem(STORAGE_KEY, method); } catch {}
    if (method === "pickup" && branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0].id);
      try { window.sessionStorage.setItem(BRANCH_KEY, branches[0].id); } catch {}
    }
    if (method === "delivery") {
      try { window.sessionStorage.removeItem(BRANCH_KEY); } catch {}
      setSelectedBranch("");
    }
    setBranchOpen(false);
    setAreaOpen(false);
  };

  const chooseBranch = (branchId: string) => {
    setSelectedBranch(branchId);
    try { window.sessionStorage.setItem(BRANCH_KEY, branchId); } catch {}
    setDeliveryMethod("pickup");
    try { window.sessionStorage.setItem(STORAGE_KEY, "pickup"); } catch {}
    setBranchOpen(false);
  };

  const selectedBranchObj = branches.find((b) => b.id === selectedBranch);
  const branchName = selectedBranchObj
    ? (locale === "ar" ? selectedBranchObj.nameAr : selectedBranchObj.name)
    : "";

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-2.5">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Delivery / Pickup Toggle */}
        <div className="flex items-center bg-gray-100 rounded-full p-0.5 shrink-0">
          <button
            onClick={() => chooseMethod("delivery")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
              deliveryMethod === "delivery"
                ? "bg-[#ff6600] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Truck className="w-3.5 h-3.5" />
            {locale === "ar" ? "توصيل" : "Delivery"}
          </button>
          <button
            onClick={() => chooseMethod("pickup")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
              deliveryMethod === "pickup"
                ? "bg-[#29ac00] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Store className="w-3.5 h-3.5" />
            {locale === "ar" ? "استلام" : "Pickup"}
          </button>
        </div>

        {/* Area / Branch Selector */}
        {deliveryMethod === "delivery" ? (
          <div className="relative">
            <button
              onClick={() => { setAreaOpen(!areaOpen); setBranchOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors"
            >
              <span className="text-gray-400">{locale === "ar" ? "توصيل الى" : "Deliver to"}</span>
              <span className="text-gray-900 font-semibold">{selectedArea || (locale === "ar" ? "اختر منطقة" : "Choose area")}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {areaOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[180px]">
                {AREAS.map((area) => (
                  <button key={area} onClick={() => { setSelectedArea(area); setAreaOpen(false); }}
                    className={cn("w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between",
                      selectedArea === area && "text-[#ff6600] font-medium bg-[#ff6600]/5"
                    )}>
                    {area}
                    {selectedArea === area && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => { setBranchOpen(!branchOpen); setAreaOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors"
            >
              <span className="text-gray-400">{locale === "ar" ? "استلام من" : "Pickup from"}</span>
              <span className="text-gray-900 font-semibold">{branchName || (locale === "ar" ? "اختر الفرع" : "Choose branch")}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {branchOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[200px]">
                {branches.map((b) => (
                  <button key={b.id} onClick={() => chooseBranch(b.id)}
                    className={cn("w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between",
                      selectedBranch === b.id && "text-[#29ac00] font-medium bg-[#29ac00]/5"
                    )}>
                    {locale === "ar" ? b.nameAr : b.name}
                    {selectedBranch === b.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Earliest arrival / Ready for pickup */}
        <span className="text-[10px] text-gray-400 ml-auto hidden sm:inline">
          {deliveryMethod === "delivery"
            ? (locale === "ar" ? "أقرب وصول" : "Earliest arrival")
            : (locale === "ar" ? "جاهز للاستلام" : "Ready for pickup")
          }
        </span>
      </div>
    </div>
  );
}
