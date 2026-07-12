"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/lib/locale";
import { useCartStore, useCartItemCount } from "@/lib/store";
import { Menu, Search, ShoppingCart, X, ChevronLeft } from "lucide-react";
import type { Category } from "@/types";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const itemCount = useCartItemCount();
  const toggleCartDrawer = useCartStore((s) => s.toggleCartDrawer);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const isEnglish = locale === "en";

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Category[]) => setCategories(data))
      .catch(() => {});
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "ar" : "en");
  }, [locale, setLocale]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery, router]);

  const goBack = useCallback(() => {
    if (pathname === "/") return;
    router.back();
  }, [pathname, router]);

  const isHome = pathname === "/";

  const petTypeLinks = [
    { pt: "cats", labelEn: "Cats", labelAr: "القطط" },
    { pt: "dogs", labelEn: "Dogs", labelAr: "الكلاب" },
    { pt: "birds", labelEn: "Birds", labelAr: "الطيور" },
    { pt: "fish", labelEn: "Fish", labelAr: "الأسماك" },
    { pt: "rabbits", labelEn: "Rabbits", labelAr: "الأرانب" },
    { pt: "hamsters", labelEn: "Hamsters", labelAr: "الهامستر" },
    { pt: "reptiles", labelEn: "Reptiles", labelAr: "الزواحف" },
  ];

  const groupedCategories = petTypeLinks.map((pt) => ({
    ...pt,
    categories: categories.filter((c) => c.petType === pt.pt),
  }));

  return (
    <>
      {/* Desktop Header — matching source: 60px, white, border-bottom #dee2e6 */}
      <header
        className="hidden md:flex sticky top-0 z-[1000] bg-white border-b items-center px-4"
        style={{ height: 60, borderColor: "#dee2e6" }}
      >
        {!isHome ? (
          <button onClick={goBack} className="p-1 -ml-1 rounded hover:bg-gray-100 shrink-0" aria-label="Back">
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
        ) : (
          <Link href="/" className="flex items-center shrink-0 mr-2">
            <img src="/logo.jpg" alt="Pet Store" style={{ borderRadius: 10, height: 38, width: 38, objectFit: "contain" }} />
          </Link>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="header-button-cricle flex items-center justify-center"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="header-button-cricle flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={toggleLocale}
            className="header-button-cricle flex items-center justify-center"
            style={{ fontSize: 14, fontWeight: "bold" }}
            aria-label="Toggle language"
          >
            {isEnglish ? "ع" : "En"}
          </button>

          <button
            onClick={toggleCartDrawer}
            className="relative header-button-cricle flex items-center justify-center"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {itemCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  left: isEnglish ? 10 : undefined,
                  right: isEnglish ? undefined : 10,
                  top: 6,
                  lineHeight: "34px",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: 7,
                  minWidth: 32,
                  height: 32,
                  fontSize: "1rem",
                  color: "white",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Search Dropdown */}
        {searchOpen && (
          <div className="absolute top-[60px] left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50 shadow-sm">
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEnglish ? "Search products..." : "بحث عن المنتجات..."} autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600]"
                />
              </div>
              <button type="submit" className="px-5 py-2.5 bg-[#ff6600] text-white text-sm font-medium rounded-lg hover:bg-[#e55b00]">
                {isEnglish ? "Search" : "بحث"}
              </button>
            </form>
          </div>
        )}

        {/* Desktop Menu Drawer */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMenuOpen(false)} onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-[60] overflow-y-auto shadow-xl" role="dialog" aria-modal="true">
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {isEnglish ? "Categories" : "التصنيفات"}
                  </h3>
                  <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  <Link href="/" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium">
                    {isEnglish ? "Home" : "الرئيسية"}
                  </Link>
                  <Link href="/products" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium">
                    {isEnglish ? "All Products" : "المنتجات"}
                  </Link>
                  {groupedCategories.map((group) => (
                    <div key={group.pt}>
                      <Link
                        href={`/products?petType=${group.pt}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        {isEnglish ? group.labelEn : group.labelAr}
                      </Link>
                      {group.categories.length > 0 && (
                        <div className="ml-4 space-y-0.5">
                          {group.categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-50"
                            >
                              <span>{isEnglish ? cat.nameAr : cat.name}</span>
                              <span className="text-[10px] opacity-60">{cat.count}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-gray-100 my-2" />
                  <Link href="/locations" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    {isEnglish ? "Locations" : "الفروع"}
                  </Link>
                  <Link href="/contact" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    {isEnglish ? "Contact Us" : "اتصل بنا"}
                  </Link>
                  <Link href="/about" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    {isEnglish ? "About Us" : "من نحن"}
                  </Link>
                </nav>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Mobile Header — matching source: 60px, fixed, border-bottom #dee2e6 */}
      <header className="md:hidden sticky top-0 z-[1000] bg-white border-b" style={{ borderColor: "#dee2e6", height: 60 }}>
        <div className="flex items-center h-[60px] px-3">
          {!isHome ? (
            <button onClick={goBack} className="p-1 -ml-1 rounded hover:bg-gray-100 shrink-0" aria-label="Back">
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
          ) : (
            <div className="w-8 shrink-0" />
          )}

          <div className="flex-1 flex justify-center">
            <Link href="/">
              <img src="/logo.jpg" alt="Pet Store" style={{ borderRadius: 10, height: 38, width: 38, objectFit: "contain" }} />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1.5 rounded-lg" aria-label="Search">
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            <button onClick={toggleLocale} className="p-1.5 rounded-lg text-xs font-bold text-gray-700" aria-label="Language">
              {isEnglish ? "ع" : "En"}
            </button>

            <button onClick={toggleCartDrawer} className="relative p-1.5 rounded-lg" aria-label="Cart">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-0.5 text-[9px] font-bold text-white bg-[#ff6600] rounded-full">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-gray-100 px-3 py-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEnglish ? "Search products..." : "بحث عن المنتجات..."} autoFocus
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20"
                />
              </div>
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>
    </>
  );
}
