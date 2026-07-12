"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/translations";
import { useLocale } from "@/lib/locale";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Search, ShoppingCart, Globe, MessageCircle, ChevronDown, Check, Truck, Store, X } from "lucide-react";

const STORAGE_KEY = "ps_fulfillment_method";
const BRANCH_KEY = "ps_selected_branch";

interface Branch {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  pickupAvailable: boolean;
  active: boolean;
}

const AREAS = ["Ahmadi", "Farwaniya", "Hawalli", "Jahra", "Capital", "Mubarak Al-Kabeer"];

export default function Header() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const toggleCartDrawer = useCartStore((s) => s.toggleCartDrawer);
  const { deliveryMethod, selectedBranch, setDeliveryMethod, setSelectedBranch } = useCartStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchOpen, setBranchOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "ar" : "en");
  }, [locale, setLocale]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery]
  );

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
  const branchName = selectedBranchObj ? (locale === "ar" ? selectedBranchObj.nameAr : selectedBranchObj.name) : "";

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center h-14 px-5 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.jpg" alt="Pet Store" className="h-9 w-auto object-contain" />
          </Link>

          {/* Delivery/Pickup Toggle */}
          <div className="flex items-center bg-gray-100 rounded-full p-0.5 shrink-0">
            <button
              onClick={() => chooseMethod("delivery")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                deliveryMethod === "delivery" ? "bg-[#ff6600] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Truck className="w-3.5 h-3.5" />
              {locale === "ar" ? "توصيل" : "Delivery"}
            </button>
            <button
              onClick={() => chooseMethod("pickup")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                deliveryMethod === "pickup" ? "bg-[#29ac00] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
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
                <span className="text-gray-400">{locale === "ar" ? "توصيل الى" : "Delivery to"}</span>
                <span className="text-gray-900">{selectedArea || (locale === "ar" ? "اختر منطقة" : "Choose area")}</span>
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
                <span className="text-gray-900">{branchName || (locale === "ar" ? "اختر الفرع" : "Choose branch")}</span>
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

          <span className="text-[10px] text-gray-400 ml-1">
            {deliveryMethod === "delivery"
              ? (locale === "ar" ? "أقرب وصول" : "Earliest arrival")
              : (locale === "ar" ? "جاهز للاستلام" : "Ready for pickup")
            }
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search.placeholder", locale)}
              className="w-48 pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600] transition-all"
            />
          </form>
          <button onClick={() => setSearchOpen(!searchOpen)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>

          {/* WhatsApp */}
          <a href="https://api.whatsapp.com/send?phone=96598805010" target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg text-[#25d366] hover:bg-green-50 transition-colors" aria-label="WhatsApp">
            <MessageCircle className="w-5 h-5" />
          </a>

          {/* Cart */}
          <button onClick={toggleCartDrawer} className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Cart">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#ff6600] rounded-full">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Language */}
          <button onClick={toggleLocale} className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors" aria-label="Toggle language">
            {locale === "en" ? "عربي" : "En"}
          </button>
        </div>

        {/* Desktop Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-gray-100 px-5 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search.placeholder", locale)} autoFocus
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600]" />
              </div>
              <button type="submit" className="px-4 py-2 bg-[#ff6600] text-white text-sm font-medium rounded-lg hover:bg-[#e55b00]">
                {t("search.button", locale)}
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center h-12 px-3 gap-2">
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.jpg" alt="Pet Store" className="h-8 w-auto object-contain" />
          </Link>

          {/* Mobile Delivery/Pickup Toggle */}
          <div className="flex items-center bg-gray-100 rounded-full p-0.5 shrink-0 ml-1">
            <button onClick={() => chooseMethod("delivery")}
              className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all",
                deliveryMethod === "delivery" ? "bg-[#ff6600] text-white" : "text-gray-500"
              )}>
              <Truck className="w-3 h-3" />
              {locale === "ar" ? "توصيل" : "Delivery"}
            </button>
            <button onClick={() => chooseMethod("pickup")}
              className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all",
                deliveryMethod === "pickup" ? "bg-[#29ac00] text-white" : "text-gray-500"
              )}>
              <Store className="w-3 h-3" />
              {locale === "ar" ? "استلام" : "Pickup"}
            </button>
          </div>

          <div className="flex-1" />

          {/* Mobile Area/Branch */}
          <div className="relative">
            <button onClick={() => { setAreaOpen(!areaOpen); setBranchOpen(false); }}
              className="flex items-center gap-1 text-[10px] font-medium text-gray-500 px-2 py-1 bg-gray-50 rounded-md">
              {deliveryMethod === "delivery"
                ? (selectedArea || (locale === "ar" ? "منطقة" : "Area"))
                : (branchName || (locale === "ar" ? "فرع" : "Branch"))
              }
              <ChevronDown className="w-3 h-3" />
            </button>
            {areaOpen && deliveryMethod === "delivery" && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[160px]">
                {AREAS.map((area) => (
                  <button key={area} onClick={() => { setSelectedArea(area); setAreaOpen(false); }}
                    className={cn("w-full text-left px-3 py-2 text-xs hover:bg-gray-50",
                      selectedArea === area && "text-[#ff6600] font-medium bg-[#ff6600]/5"
                    )}>
                    {area}
                  </button>
                ))}
              </div>
            )}
            {branchOpen && deliveryMethod === "pickup" && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[180px]">
                {branches.map((b) => (
                  <button key={b.id} onClick={() => chooseBranch(b.id)}
                    className={cn("w-full text-left px-3 py-2 text-xs hover:bg-gray-50",
                      selectedBranch === b.id && "text-[#29ac00] font-medium bg-[#29ac00]/5"
                    )}>
                    {locale === "ar" ? b.nameAr : b.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setSearchOpen(!searchOpen)} className="p-1.5 rounded-lg text-gray-500" aria-label="Search">
            <Search className="w-4.5 h-4.5" />
          </button>

          <a href="https://api.whatsapp.com/send?phone=96598805010" target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-[#25d366]" aria-label="WhatsApp">
            <MessageCircle className="w-4.5 h-4.5" />
          </a>

          <button onClick={toggleCartDrawer} className="relative p-1.5 rounded-lg text-gray-600" aria-label="Cart">
            <ShoppingCart className="w-4.5 h-4.5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 text-[8px] font-bold text-white bg-[#ff6600] rounded-full">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          <button onClick={toggleLocale} className="px-1.5 py-1 rounded text-[10px] font-bold text-gray-600 border border-gray-200" aria-label="Toggle language">
            {locale === "en" ? "عربي" : "En"}
          </button>
        </div>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-gray-100 px-3 py-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search.placeholder", locale)} autoFocus
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20" />
              </div>
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>
    </>
  );
}
