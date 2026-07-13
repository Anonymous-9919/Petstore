import { BottomNav } from "@/components/store/bottom-nav";
import { WhatsAppFAB } from "@/components/store/whatsapp-fab";
import { CartSheet } from "@/components/store/cart-sheet";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-store-bg">
      <main className="flex-1 pb-[70px]">{children}</main>
      <BottomNav />
      <WhatsAppFAB />
      <CartSheet />
    </div>
  );
}
