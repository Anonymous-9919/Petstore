import { Suspense } from "react";
import { PawPrint } from "@/lib/icons";
import OrderSuccessContent from "./content";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><PawPrint className="w-12 h-12 text-[#ff6600] animate-pulse" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
