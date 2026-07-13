"use client";

import Link from "next/link";
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Phone,
  Globe,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { PageHeader } from "@/components/store/page-header";
import { useUIStore } from "@/stores/ui-store";
import { STORE } from "@/lib/constants";

export default function AccountPage() {
  const { language, toggleLanguage } = useUIStore();
  const isArabic = language === "ar";

  const menuItems = [
    {
      icon: User,
      label: isArabic ? "تسجيل الدخول" : "Login",
      labelAr: "تسجيل الدخول",
      href: "/account/login",
    },
    {
      icon: MapPin,
      label: isArabic ? "عناويني" : "My Addresses",
      labelAr: "عناويني",
      href: "/account/addresses",
    },
    {
      icon: ShoppingBag,
      label: isArabic ? "طلباتي" : "My Orders",
      labelAr: "طلباتي",
      href: "/account/orders",
    },
    {
      icon: Heart,
      label: isArabic ? "المفضلة" : "Wishlist",
      labelAr: "المفضلة",
      href: "/account/wishlist",
    },
    {
      icon: Phone,
      label: isArabic ? "اتصل بنا" : "Contact Us",
      labelAr: "اتصل بنا",
      href: "/contact",
    },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader title={isArabic ? "الحساب" : "Account"} />

      <div className="px-4 py-4">
        <div className="mb-6 flex flex-col items-center rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10">
            <User className="h-8 w-8 text-brand-orange" />
          </div>
          <p className="text-sm text-text-secondary">
            {isArabic
              ? "سجل الدخول للوصول لحسابك"
              : "Login to access your account"}
          </p>
        </div>

        <div className="space-y-1 overflow-hidden rounded-lg bg-white shadow-sm">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 border-b border-store-border px-4 py-3.5 no-underline last:border-b-0"
            >
              <item.icon className="h-5 w-5 text-text-secondary" />
              <span className="flex-1 text-sm text-text-primary">
                {isArabic ? item.labelAr : item.label}
              </span>
              <ChevronLeft className="h-4 w-4 text-text-muted" />
            </Link>
          ))}
        </div>

        <div className="mt-3 overflow-hidden rounded-lg bg-white shadow-sm">
          <button
            onClick={toggleLanguage}
            className="flex w-full items-center gap-3 px-4 py-3.5"
          >
            <Globe className="h-5 w-5 text-text-secondary" />
            <span className="flex-1 text-left text-sm text-text-primary">
              {isArabic ? "اللغة" : "Language"}:{" "}
              {isArabic ? "العربية" : "English"}
            </span>
            <ChevronLeft className="h-4 w-4 text-text-muted" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="mb-1 text-xs text-text-muted">
            {STORE.name} v1.0.0
          </p>
          <p className="text-xs text-text-lighter">
            {isArabic
              ? "جميع الحقوق محفوظة"
              : "All rights reserved"}
          </p>
        </div>
      </div>
    </div>
  );
}
