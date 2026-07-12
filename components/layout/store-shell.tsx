"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useLocale } from "@/lib/locale";

const Header = dynamic(() => import("@/components/layout/header"), { ssr: false });
const BottomNav = dynamic(() => import("@/components/layout/bottom-nav"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/layout/cart-drawer"), { ssr: false });

export function StoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Desktop: Split layout — left content, right cover */}
      <div className="hidden md:flex min-h-screen">
        {/* Left: Store content */}
        <div className="w-full md:w-[42%] lg:w-[45%] flex flex-col bg-[#f4f5f5] overflow-y-auto">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>

        {/* Right: Cover image */}
        <div className="hidden md:block md:w-[58%] lg:w-[55%] relative">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#ff6600]">
            <img
              src="/images/site/cover.jpeg"
              alt="Pet Store Kuwait"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-8 right-8 text-white">
              <img src="/logo.jpg" alt="Pet Store" className="h-14 w-auto object-contain mb-3 drop-shadow-lg" />
              <h2 className="text-xl lg:text-2xl font-bold drop-shadow-lg leading-snug">
                {locale === "ar" ? "شريكك الموثوق في عالم الحيوانات الأليفة" : "Your Dependable Partner in PetHood"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Full width */}
      <div className="md:hidden flex flex-col min-h-screen">
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <BottomNav />
      </div>

      <CartDrawer />
    </>
  );
}
