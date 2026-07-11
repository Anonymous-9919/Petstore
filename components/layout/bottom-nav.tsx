"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/translations";
import { useLocale } from "@/lib/locale";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { House, ShoppingBag, Grid3x3, ShoppingCart, Phone } from "lucide-react";

const tabs = [
  { key: "home", href: "/", icon: House },
  { key: "shop", href: "/products", icon: ShoppingBag },
  { key: "categories", href: "/categories", icon: Grid3x3 },
  { key: "cart", href: "/cart", icon: ShoppingCart },
  { key: "contact", href: "/contact", icon: Phone },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-0.5 relative transition-colors",
                isActive ? "text-[#ff6600]" : "text-gray-400"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "scale-110"
                  )}
                />
                {/* Cart Badge */}
                {tab.key === "cart" && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-red-500 rounded-full leading-none">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-tight transition-colors",
                  isActive ? "text-[#ff6600]" : "text-gray-400"
                )}
              >
                {t(`bottomNav.${tab.key}`, locale)}
              </span>
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#ff6600] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
