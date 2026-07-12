"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useLocale } from "@/lib/locale";

import Header from "@/components/layout/header";
import DeliveryBar from "@/components/layout/delivery-bar";
import BottomNav from "@/components/layout/bottom-nav";
import Footer from "@/components/layout/footer";

const CartDrawer = dynamic(() => import("@/components/layout/cart-drawer"), { ssr: false });
const DesktopBottomBar = dynamic(() => import("@/components/layout/desktop-bottom-bar"), { ssr: false });

export function StoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const isAdmin = pathname.startsWith("/admin");
  const isEnglish = locale === "en";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Desktop: Split layout matching source site
          English: Content 5/12 (41.6vw) LEFT, Banner 7/12 (58.4vw) RIGHT
          Arabic: Content 5/12 RIGHT (ml-auto), Banner 7/12 LEFT */}
      <div className="hidden md:flex h-screen overflow-hidden">
        {/* Banner panel */}
        <div
          className="hidden md:block md:w-[58.4%] relative"
          style={{
            order: isEnglish ? 2 : -1,
            backgroundColor: "#f4f5f5",
            position: "fixed",
            left: isEnglish ? "41.64vw" : 0,
            top: 0,
            zIndex: 55,
            height: "100vh",
            overflowY: "hidden",
          }}
        >
          <img src="/images/site/cover.jpeg" alt="Pet Store Kuwait" className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Content panel */}
        <div
          className="w-full md:w-[41.6%] flex flex-col"
          style={{
            backgroundColor: "#f4f5f5",
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: "calc(100% - 60px)",
            height: "calc(100% - 60px)",
            marginLeft: isEnglish ? undefined : "auto",
          }}
        >
          <Header />
          <DeliveryBar />
          <main id="main-content" className="flex-1">
            {children}
            <Footer />
          </main>
          <DesktopBottomBar />
        </div>
      </div>

      {/* Mobile: Full width with header and delivery bar */}
      <div className="md:hidden flex flex-col min-h-screen">
        <Header />
        <DeliveryBar />
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
