"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";
import { UI_STRINGS } from "@/lib/constants";

export function BottomNav() {
  const pathname = usePathname();
  const { language, toggleLanguage, setCartSheetOpen } = useUIStore();
  const { getItemCount } = useCartStore();
  const isArabic = language === "ar";
  const isHome = pathname === "/";
  const itemCount = getItemCount();

  if (isHome) {
    return (
      <div className="action-button-english fixed bottom-0 z-10 flex h-[60px] w-full items-center bg-white px-[7px] pb-2 pt-[7px]">
        <button className="mx-auto mb-1 ml-1 flex h-[45px] w-[calc(100%-12px)] items-center justify-center rounded bg-brand-orange text-sm font-medium text-text-primary shadow-btn">
          {isArabic ? UI_STRINGS.selectLocationAr : UI_STRINGS.selectLocation}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 z-10 flex h-[60px] w-full items-center justify-around bg-white px-4 pb-2 pt-[7px]">
      <button
        onClick={toggleLanguage}
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full text-xl font-medium text-text-primary"
      >
        {isArabic ? "En" : "ع"}
      </button>
      <Link
        href="/search"
        className="flex h-[45px] w-[45px] items-center justify-center"
      >
        <Search className="h-6 w-6 text-text-primary" />
      </Link>
      <button
        onClick={() => setCartSheetOpen(true)}
        className="relative flex h-[45px] w-[45px] items-center justify-center"
      >
        <ShoppingCart className="h-6 w-6 text-text-primary" />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
            {itemCount}
          </span>
        )}
      </button>
      <Link
        href="/account"
        className="flex h-[45px] w-[45px] items-center justify-center"
      >
        <Menu className="h-6 w-6 text-text-primary" />
      </Link>
    </div>
  );
}
