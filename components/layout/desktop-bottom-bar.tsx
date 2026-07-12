"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { useCartStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";

export default function DesktopBottomBar() {
  const { locale } = useLocale();
  const items = useCartStore((s) => s.items);
  const toggleCartDrawer = useCartStore((s) => s.toggleCartDrawer);
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <div className="shrink-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
      <button onClick={toggleCartDrawer} className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart className="w-5 h-5 text-gray-700" />
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-[#ff6600] rounded-full">
            {itemCount}
          </span>
        </div>
        <div className="text-sm">
          <span className="font-semibold text-gray-900">{itemCount} {locale === "ar" ? "منتج" : "items"}</span>
          <span className="text-gray-400 mx-1.5">|</span>
          <span className="font-bold text-[#ff6600]">{subtotal.toFixed(3)} {locale === "ar" ? "د.ك" : "KWD"}</span>
        </div>
      </button>
      <Link href="/cart" className="px-4 py-2 bg-[#29ac00] text-white text-sm font-semibold rounded-lg hover:bg-[#229a00] transition-colors">
        {locale === "ar" ? "عرض السلة" : "View Cart"}
      </Link>
    </div>
  );
}
