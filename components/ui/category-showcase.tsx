"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryItem {
  name: string;
  nameAr: string;
  slug: string;
  petType: string;
  image?: string | null;
  count: number;
}

interface CategoryShowcaseProps {
  locale: string;
  categories: CategoryItem[];
}

const petTypeEmoji: Record<string, string> = {
  cats: "🐱",
  dogs: "🐶",
  birds: "🐦",
  fish: "🐠",
  rabbits: "🐰",
  hamsters: "🐹",
  reptiles: "🦎",
  general: "🐾",
};

export default function CategoryShowcase({ locale, categories }: CategoryShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (categories.length === 0) return null;

  return (
    <div className="relative group">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -ml-2"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </button>

      {/* Categories scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="flex flex-col items-center gap-2 shrink-0 group/cat"
          >
            <div className="w-[80px] h-[80px] rounded-[5px] overflow-hidden bg-white border border-gray-100 flex items-center justify-center group-hover/cat:shadow-md transition-shadow">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-3xl">{petTypeEmoji[cat.petType] || "🐾"}</span>
              )}
            </div>
            <span className="text-[11px] font-medium text-gray-700 text-center whitespace-nowrap max-w-[80px] truncate">
              {locale === "ar" ? cat.nameAr : cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
