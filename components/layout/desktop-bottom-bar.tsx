"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { useCartStore, useCartSummary } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import { formatKWD } from "@/lib/utils";

export default function DesktopBottomBar() {
  const { locale } = useLocale();
  const isEnglish = locale === "en";
  const { itemCount, subtotal } = useCartSummary();
  const toggleCartDrawer = useCartStore((s) => s.toggleCartDrawer);

  if (itemCount === 0) return null;

  return (
    <div
      className="shrink-0 bg-white flex items-center justify-between"
      style={{
        borderTop: "1px solid #dee2e6",
        padding: "7px",
        width: "100%",
      }}
    >
      <button onClick={toggleCartDrawer} className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart className="w-5 h-5 text-gray-700" />
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-[#ff6600] rounded-full">
            {itemCount}
          </span>
        </div>
        <div className="text-sm">
          <span className="font-semibold text-gray-900">{itemCount} {isEnglish ? "items" : "منتج"}</span>
          <span className="text-gray-400 mx-1.5">|</span>
          <span className="font-bold text-[#ff6600]">{formatKWD(subtotal)}</span>
        </div>
      </button>
      <Link href="/cart" className="px-4 py-2 bg-[#29ac00] text-white text-sm font-semibold rounded hover:bg-[#229a00] transition-colors">
        {isEnglish ? "View Cart" : "عرض السلة"}
      </Link>
    </div>
  );
}
