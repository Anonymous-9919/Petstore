"use client";

import Link from "next/link";
import Image from "next/image";
import { useUIStore } from "@/stores/ui-store";
import { STORE, UI_STRINGS } from "@/lib/constants";

export function StoreHeader() {
  const { language } = useUIStore();
  const isArabic = language === "ar";

  return (
    <ul className="w-full bg-white px-3 pt-[3px] pb-0">
      <li>
        <Link href="/contact" className="flex items-center gap-3 no-underline">
          <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded bg-gray-100">
            <Image
              src={isArabic ? STORE.logoAr : STORE.logo}
              alt={STORE.name}
              width={60}
              height={60}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <p className="m-0 text-base font-bold text-text-black">
              {isArabic ? STORE.nameAr : STORE.name}
            </p>
            <p className="m-0 text-[12.25px] font-normal text-text-secondary">
              {isArabic ? STORE.sloganAr : STORE.slogan}
            </p>
          </div>
        </Link>
      </li>
    </ul>
  );
}
