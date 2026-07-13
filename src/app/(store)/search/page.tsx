"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { PageHeader } from "@/components/store/page-header";
import { ProductGrid } from "@/components/store/product-grid";
import { useUIStore } from "@/stores/ui-store";
import { UI_STRINGS } from "@/lib/constants";

const ALL_PRODUCTS = [
  {
    id: "1",
    name: "Whiskas Cat Wet Food - Tuna",
    nameAr: "ويسكاس طعام رطب للقطط - تونة",
    slug: "whiskas-cat-wet-food-tuna",
    categorySlug: "cat-wet-food",
    variant: "85g",
    variantAr: "85 جرام",
    price: 0.45,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg",
  },
  {
    id: "2",
    name: "Pedigree Dog Wet Food - Beef",
    nameAr: "بيديجري طعام رطب للكلاب - لحم بقري",
    slug: "pedigree-dog-wet-food-beef",
    categorySlug: "dog-wet-food",
    variant: "100g",
    variantAr: "100 جرام",
    price: 0.55,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/9f/d0/9fd0a249feff2c61704bdab12a05e7e6.jpg",
  },
  {
    id: "3",
    name: "Royal Canin Cat Dry Food - Indoor",
    nameAr: "رويال كنين الطعام الجاف للقطط - داخلي",
    slug: "royal-canin-cat-dry-food-indoor",
    categorySlug: "cat-dry-food",
    variant: "2kg",
    variantAr: "2 كجم",
    price: 7.5,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/54/52/54520d644d9df159e87f886bd62afc7d.jpg",
  },
  {
    id: "4",
    name: "Kong Cat Toy - Red",
    nameAr: "كונג لعبة القطط - احمر",
    slug: "kong-cat-toy-red",
    categorySlug: "cat-toys",
    variant: "Medium",
    variantAr: "متوسط",
    price: 3.0,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/17/ae/17ae187c42d53b5cfe0b622ff46bca95.jpg",
  },
];

export default function SearchPage() {
  const { language } = useUIStore();
  const isArabic = language === "ar";
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const results = query.trim()
    ? ALL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.nameAr.includes(query)
      )
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="flex flex-col">
      <PageHeader />

      <div className="bg-white px-3 py-2">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) setHasSearched(true);
            }}
            placeholder={
              isArabic ? UI_STRINGS.searchAr : UI_STRINGS.search
            }
            className="w-full rounded-lg border border-store-border bg-store-bg py-2.5 pl-10 pr-10 text-sm text-text-primary placeholder-text-muted focus:border-brand-orange focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setHasSearched(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-text-muted" />
            </button>
          )}
        </form>
      </div>

      <div className="flex-1 px-2 pt-3">
        {!hasSearched && !query && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="mb-4 h-12 w-12 text-text-lighter" />
            <p className="text-sm text-text-secondary">
              {isArabic
                ? "ابحث عن منتجات"
                : "Search for products"}
            </p>
          </div>
        )}

        {hasSearched && query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm text-text-secondary">
              {isArabic
                ? "لا توجد نتائج"
                : "No results found"}
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="mb-2 px-2 text-xs text-text-secondary">
              {results.length}{" "}
              {isArabic ? "نتائج" : "results"}
            </p>
            <ProductGrid products={results} />
          </>
        )}
      </div>
    </div>
  );
}
