import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale";
import { FulfillmentGate } from "@/components/fulfillment/fulfillment-gate";
import { FulfillmentGateWrapper } from "@/components/fulfillment/fulfillment-gate-wrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

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
      <body className={`${geistSans.variable} min-h-screen flex flex-col antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#ff6600] focus:text-white focus:rounded-xl focus:text-sm focus:font-semibold">
          Skip to content
        </a>
        <LocaleProvider>
          <FulfillmentGateWrapper>
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </FulfillmentGateWrapper>
        </LocaleProvider>
      </body>
    </html>
  );
}
