"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";
import Link from "next/link";

interface PageHeaderProps {
  title?: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const router = useRouter();
  const { language, toggleLanguage, setCartSheetOpen } = useUIStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <div className="sticky top-0 z-[1000] flex h-[54.5px] w-full items-center border-b border-store-border bg-white px-3">
      <button
        onClick={() => router.back()}
        className="float-left ml-2 mt-1 flex h-[50px] w-[30px] items-center justify-center"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      {title && (
        <span className="ml-2 text-sm font-bold text-text-primary">{title}</span>
      )}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={toggleLanguage}
          className="flex h-[50px] w-[40px] items-center justify-center pb-3 text-[20px] font-medium text-text-black md:hidden"
        >
          {language === "ar" ? "En" : "ع"}
        </button>
        <Link
          href="/search"
          className="flex h-[50px] w-[40px] items-center justify-center md:hidden"
        >
          <Search className="h-5 w-5" />
        </Link>
        <button
          onClick={() => setCartSheetOpen(true)}
          className="relative flex h-[50px] w-[40px] items-center justify-center md:hidden"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute right-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
