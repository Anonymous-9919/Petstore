"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale";

interface Category {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  image: string | null;
  petType: string;
  count: number;
}

export default function CategoryShowcase({ locale }: { locale: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setCategories(data.filter((c: Category) => c.count > 0));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 disable-scroll-bar">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[80px] h-[80px] rounded-xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 disable-scroll-bar">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/products?category=${cat.slug}`}
          className="shrink-0 flex flex-col items-center gap-1.5 group"
        >
          <div className="w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm group-hover:shadow-md group-hover:border-[#ff6600]/30 transition-all">
            {cat.image ? (
              <img
                src={cat.image}
                alt={locale === "ar" ? cat.nameAr : cat.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div className={`${cat.image ? "hidden" : ""} w-full h-full flex items-center justify-center bg-gray-50`}>
              <span className="text-2xl">🐾</span>
            </div>
          </div>
          <span className="text-[10px] md:text-xs text-gray-600 font-medium text-center w-[70px] md:w-[80px] truncate group-hover:text-[#ff6600] transition-colors">
            {locale === "ar" ? cat.nameAr : cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
