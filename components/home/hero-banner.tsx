"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";

export default function HeroBanner() {
  const { locale } = useLocale();

  return (
    <section className="relative w-full overflow-hidden bg-[#ff6600]">
      {/* Mobile: shorter banner */}
      <div className="md:hidden relative h-[220px]">
        <img
          src="/images/site/cover.jpeg"
          alt="Pet Store Kuwait"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-4 right-4 text-white">
          <h1 className="text-xl font-bold drop-shadow-lg leading-snug mb-2">
            {locale === "ar" ? "شريكك الموثوق في عالم الحيوانات الأليفة" : "Your Dependable Partner in PetHood"}
          </h1>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#ff6600] text-sm font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            {locale === "ar" ? "تسوق الآن" : "Shop Now"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Desktop: taller banner */}
      <div className="hidden md:block relative h-[380px]">
        <img
          src="/images/site/cover.jpeg"
          alt="Pet Store Kuwait"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white max-w-md">
          <h1 className="text-2xl lg:text-3xl font-bold drop-shadow-lg leading-snug mb-3">
            {locale === "ar" ? "شريكك الموثوق في عالم الحيوانات الأليفة" : "Your Dependable Partner in PetHood"}
          </h1>
          <p className="text-sm text-white/80 mb-4 drop-shadow">
            {locale === "ar"
              ? "متجر الحيوانات الأليفة الأول في الكويت - توصيل سريع لجميع المناطق"
              : "Kuwait's trusted pet store — premium food, toys & accessories with fast delivery"}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#ff6600] text-sm font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            {locale === "ar" ? "تسوق الآن" : "Shop Now"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
