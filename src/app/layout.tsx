import type { Metadata } from "next";
import { Quicksand, Cairo } from "next/font/google";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pet Store Kuwait - Your Dependable Partner in PetHood",
  description:
    "Pet Store Kuwait offers premium pet supplies, food, accessories and more. Delivery and pickup available across Kuwait.",
  keywords: "pet store, kuwait, pet supplies, cat food, dog food, accessories",
  openGraph: {
    title: "Pet Store Kuwait",
    description: "Your Dependable Partner in PetHood",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_KW",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${quicksand.variable} ${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
