"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, Locale } from "@/lib/translations";
import { useLocale } from "@/lib/locale";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  PawPrint,
  Search,
  ShoppingCart,
  Globe,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { key: "home", href: "/" },
  { key: "shop", href: "/products" },
  { key: "cats", href: "/products?petType=cat" },
  { key: "dogs", href: "/products?petType=dog" },
  { key: "birds", href: "/products?petType=bird" },
  { key: "fish", href: "/products?petType=fish" },
  { key: "locations", href: "/locations" },
  { key: "contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const itemCount = useCartStore((s) => s.getItemCount());

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "ar" : "en");
  }, [locale, setLocale]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery]
  );

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/logo.jpg"
                alt="Pet Store Kuwait"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href ||
                      (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]))
                      ? "bg-[#ff6600]/10 text-[#ff6600]"
                      : "text-gray-600 hover:text-[#ff6600] hover:bg-gray-100"
                  )}
                >
                  {t(`nav.${link.key}`, locale)}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4" />
                {locale === "en" ? "AR" : "EN"}
              </button>

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  searchOpen
                    ? "bg-[#ff6600]/10 text-[#ff6600]"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#ff6600] rounded-full">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="max-w-7xl mx-auto px-4 py-3">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("search.placeholder", locale)}
                      autoFocus
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#ff6600] text-white text-sm font-medium rounded-lg hover:bg-[#e55b00] transition-colors"
                  >
                    {t("search.button", locale)}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <img
              src="/logo.jpg"
              alt="Pet Store Kuwait"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#ff6600] rounded-full">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleLocale}
              className="px-2 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
              aria-label="Toggle language"
            >
              {locale === "en" ? "AR" : "EN"}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="px-4 py-3">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("search.placeholder", locale)}
                      autoFocus
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600] transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="p-2.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Full-Screen Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
                <span className="text-lg font-bold text-[#ff6600]">
                  {t("nav.menu", locale)}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      pathname === link.href ||
                        (link.href !== "/" &&
                          pathname.startsWith(link.href.split("?")[0]))
                        ? "bg-[#ff6600]/10 text-[#ff6600]"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {t(`nav.${link.key}`, locale)}
                  </Link>
                ))}
              </nav>

              {/* Language Toggle in Menu */}
              <div className="px-4 pt-4 border-t border-gray-100">
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  {locale === "en" ? "العربية" : "English"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
