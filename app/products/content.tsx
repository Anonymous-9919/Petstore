"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { ProductCard } from "@/components/product/product-card";
import { PetIcon } from "@/components/ui/pet-icon";
import Link from "next/link";
import { Search, X, SlidersHorizontal, Grid3x3, List, MapPin, AlertCircle } from "@/lib/icons";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/types";
import { useCartStore } from "@/lib/store";
import type { Product as TypeProduct } from "@/types";

const petTypes = [
  "cats", "dogs", "birds", "fish", "rabbits", "hamsters", "reptiles", "general",
] as const;

interface ApiProduct {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  petType: string;
  featured: boolean;
  active: boolean;
  onSale: boolean;
  inStock: boolean;
  category: { name: string; nameAr: string; slug: string };
  categorySlug: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  images: { url: string; order: number }[];
}

function toTypeProduct(p: ApiProduct): TypeProduct {
  return {
    id: p.id,
    name: p.name,
    nameAr: p.nameAr,
    slug: p.slug,
    description: p.description || "",
    descriptionAr: p.descriptionAr || "",
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    category: p.category?.name || "",
    categoryAr: p.category?.nameAr || "",
    categorySlug: p.categorySlug || p.category?.slug || "",
    petType: p.petType as TypeProduct["petType"],
    images: (p.images || []).sort((a, b) => a.order - b.order).map((i) => i.url),
    tags: p.tags || [],
    featured: p.featured,
    onSale: p.onSale,
    inStock: p.stock > 0 && p.active,
    rating: p.rating,
    reviewCount: p.reviewCount,
    createdAt: p.createdAt,
  };
}

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const { selectedBranch, deliveryMethod } = useCartStore();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedPetType, setSelectedPetType] = useState<string | null>(
    (searchParams.get("petType") as any) || null
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branchList, setBranchList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const branchName = branchList.find((b: any) => b.id === selectedBranch)?.name || "";

  // Fetch categories and branches once
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.ok ? r.json() : []),
      fetch("/api/branches/public").then((r) => r.ok ? r.json() : []),
    ]).then(([cats, branches]) => {
      setCategories(cats);
      setBranchList(branches);
    }).catch(() => {
      setCategories([]);
      setBranchList([]);
    });
  }, []);

  // Fetch products — filtered by branch if pickup
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const url = new URL("/api/products", window.location.origin);
    if (selectedBranch) url.searchParams.set("branchId", selectedBranch);
    fetch(url.toString(), { signal: controller.signal })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        setAllProducts(data);
        setLoading(false);
      })
      .catch((e) => { if (e.name !== "AbortError") { setAllProducts([]); setLoading(false); } });
    return () => controller.abort();
  }, [selectedBranch]);

  const categoriesByPetType = useMemo(() => {
    const grouped = {} as Record<string, Category[]>;
    for (const pt of petTypes) {
      grouped[pt] = categories.filter((c) => c.petType === pt);
    }
    return grouped;
  }, [categories]);

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (searchParams.get("sale") === "true") {
      result = result.filter((p) => p.onSale);
    }
    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    } else if (selectedPetType) {
      result = result.filter((p) => p.petType === selectedPetType);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [allProducts, selectedCategory, selectedPetType, search, sort, searchParams]);

  const handleSelectAll = () => {
    setSelectedCategory("");
    setSelectedPetType(null);
    setMobileFiltersOpen(false);
  };

  const handleSelectPetType = (pt: string) => {
    setSelectedPetType(pt);
    setSelectedCategory("");
    setMobileFiltersOpen(false);
  };

  const handleSelectCategory = (slug: string, pt: string) => {
    setSelectedCategory(slug);
    setSelectedPetType(pt);
    setMobileFiltersOpen(false);
  };

  const sidebarContent = (
    <div className="space-y-1">
      <button
        onClick={handleSelectAll}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
          !selectedCategory && !selectedPetType
            ? "bg-primary/10 text-primary font-medium"
            : "text-text-muted hover:text-text hover:bg-surface"
        }`}
      >
        {t("product.all", locale)}
      </button>
      {petTypes.map((pt) => {
        const cats = categoriesByPetType[pt];
        if (!cats || cats.length === 0) return null;
        const isActive = selectedPetType === pt && !selectedCategory;
        return (
          <div key={pt} className="pt-3">
            <button
              onClick={() => handleSelectPetType(pt)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-text hover:bg-surface"
              }`}
            >
              <PetIcon petType={pt} size={16} />
              <span>{t(`nav.${pt}`, locale)}</span>
            </button>
            <div className="ml-4 mt-1 space-y-0.5">
              {cats.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleSelectCategory(cat.slug, pt)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-text-muted hover:text-text hover:bg-surface/50"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-60">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-24 md:pb-10">
      {selectedBranch && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <MapPin className="w-4 h-4" />
            <span>
              {locale === "ar" ? "عرض المنتجات المتوفرة في: " : "Showing products available at: "}
              <strong>{branchName}</strong>
            </span>
          </div>
          <Link
            href="/"
            className="text-xs text-green-700 hover:underline"
            onClick={() => {
              try { window.sessionStorage.removeItem("ps_fulfillment_method"); window.sessionStorage.removeItem("ps_selected_branch"); } catch {}
            }}
          >
            {locale === "ar" ? "تغيير" : "Change"}
          </Link>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-4xl font-bold text-text mb-2">
          {t("product.all", locale)}
        </h1>
        <p className="text-text-muted text-sm mb-6">
          {filtered.length} {t("product.found", locale)}
          {loading && " (loading...)"}
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={t("product.search", locale)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-surface/50 border border-border pl-10 pr-4 py-3 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl bg-surface/50 border border-border px-3 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="latest">{t("product.sort-latest", locale)}</option>
            <option value="price-asc">{t("product.sort-price-asc", locale)}</option>
            <option value="price-desc">{t("product.sort-price-desc", locale)}</option>
            <option value="rating">{t("product.sort-rating", locale)}</option>
            <option value="name">{t("product.sort-name", locale)}</option>
          </select>
          <div className="hidden sm:flex rounded-xl border border-border overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-3 transition-colors ${view === "grid" ? "bg-primary text-white" : "bg-surface/50 text-text-muted hover:text-text"}`}>
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-3 transition-colors ${view === "list" ? "bg-primary text-white" : "bg-surface/50 text-text-muted hover:text-text"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setMobileFiltersOpen(true)} className="md:hidden p-3 rounded-xl bg-surface/50 border border-border">
            <SlidersHorizontal className="w-4 h-4 text-text" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24">{sidebarContent}</div>
        </aside>

        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 md:hidden overflow-y-auto shadow-xl"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text">{t("section.shop-by-pet", locale)}</h3>
                    <button onClick={() => setMobileFiltersOpen(false)}>
                      <X className="w-5 h-5 text-text-muted" />
                    </button>
                  </div>
                  {sidebarContent}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          {selectedCategory && (
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                {categories.find((c) => c.slug === selectedCategory)?.name}
                <button onClick={handleSelectAll} className="ml-1.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {filtered.length === 0 && !loading ? (
            <div className="text-center py-20">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-text-muted text-lg font-medium">
                {selectedBranch
                  ? (locale === "ar" ? "لا توجد منتجات متوفرة في هذا الفرع" : "No products available at this branch")
                  : t("product.not-found", locale)}
              </p>
              <button onClick={handleSelectAll} className="mt-3 text-sm text-primary hover:underline">
                {t("product.clear-filter", locale)}
              </button>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
                  : "grid grid-cols-1 sm:grid-cols-2 gap-4"
              }
            >
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="h-full"
                >
                  <ProductCard product={toTypeProduct(product)} locale={locale} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
