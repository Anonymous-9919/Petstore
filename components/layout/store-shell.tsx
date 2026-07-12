"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useLocale } from "@/lib/locale";

const Header = dynamic(() => import("@/components/layout/header"), { ssr: false });
const DeliveryBar = dynamic(() => import("@/components/layout/delivery-bar"), { ssr: false });
const BottomNav = dynamic(() => import("@/components/layout/bottom-nav"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/layout/cart-drawer"), { ssr: false });
const DesktopBottomBar = dynamic(() => import("@/components/layout/desktop-bottom-bar"), { ssr: false });
const Footer = dynamic(() => import("@/components/layout/footer"), { ssr: false });

export function StoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Desktop: Split layout matching source site — left 41.6%, right 58.4% */}
      <div className="hidden md:flex min-h-screen">
        {/* Left: Store content */}
        <div className="w-full md:w-[41.6%] flex flex-col bg-[#f4f5f5] h-screen">
          <Header />
          <DeliveryBar />
          <main id="main-content" className="flex-1 overflow-y-auto">
            {children}
            <Footer />
          </main>
          <DesktopBottomBar />
        </div>

        {/* Right: Cover image (fixed, like source site) */}
        <div className="hidden md:block md:w-[58.4%] relative">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#ff6600]">
            <img
              src="/images/site/cover.jpeg"
              alt="Pet Store Kuwait"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
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
        <main id="main-content" className="flex-1 pb-16">
          {children}
          <Footer />
        </main>
        <BottomNav />
      </div>

      <CartDrawer />
    </>
  );
}
