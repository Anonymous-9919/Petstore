"use client";

import Link from "next/link";
import { useUIStore } from "@/stores/ui-store";
import { CATEGORIES } from "@/lib/constants";

export function CategoryBar() {
  const { language } = useUIStore();
  const isArabic = language === "ar";

  return (
    <div className="hide-scrollbar mb-[19px] flex h-[35px] items-center justify-between overflow-x-scroll px-[11px]">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className="whitespace-nowrap px-1 py-0.5 text-[15.5px] font-semibold text-text-primary no-underline transition-opacity hover:opacity-70"
        >
          {isArabic ? cat.nameAr : cat.name}
        </Link>
      ))}
    </div>
  );
}
