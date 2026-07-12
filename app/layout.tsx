import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale";
import { StoreShell } from "@/components/layout/store-shell";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pet Store Kuwait | بت ستور — Your Dependable Partner in PetHood",
  description:
    "Kuwait's trusted pet store. Premium pet food, toys, accessories & care products for cats, dogs, birds, fish, rabbits, hamsters & reptiles. Fast delivery across Kuwait or pickup from our 3 branches in Salmiya, Al Rai & Mahboula.",
  keywords: "pet store,kuwait,cat food,dog food,bird supplies,fish food,pet accessories,pet toys,hamster,rabbit,reptile,توصيل,حيوانات أليفة",
  openGraph: {
    title: "Pet Store Kuwait | بت ستور",
    description: "Your Dependable Partner in PetHood. Premium pet supplies with fast delivery across Kuwait.",
    siteName: "Pet Store Kuwait",
    locale: "en_KW",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${quicksand.variable} font-sans min-h-screen flex flex-col antialiased bg-[#f4f5f5]`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#ff6600] focus:text-white focus:rounded-xl focus:text-sm focus:font-semibold">
          Skip to content
        </a>
        <LocaleProvider>
          <StoreShell>
            <div id="main-content">
              {children}
            </div>
          </StoreShell>
        </LocaleProvider>
      </body>
    </html>
  );
}
