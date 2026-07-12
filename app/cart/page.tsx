"use client";

import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { useCartStore, useCartSummary } from "@/lib/store";
import { formatKWD, cn } from "@/lib/utils";
import Link from "next/link";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, Truck, Store, PawPrint, ShoppingBag,
} from "@/lib/icons";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";

export default function CartPage() {
  const { locale } = useLocale();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const deliveryMethod = useCartStore((s) => s.deliveryMethod);
  const setDeliveryMethod = useCartStore((s) => s.setDeliveryMethod);
  const { subtotal, deliveryFee, total } = useCartSummary();
  const isArabic = locale === "ar";

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-[#ff6600]" />
          <h1 className="text-3xl font-bold text-gray-900">{t("order.cart", locale)}</h1>
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <PawPrint className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">{t("order.empty", locale)}</h2>
            <p className="text-gray-500 mb-8">{t("order.emptyCTA", locale)}</p>
            <Link href="/">
              <Button className="bg-[#ff6600] hover:bg-[#e65c00] text-white px-8 py-3">
                <ShoppingBag className="w-5 h-5 mr-2" />
                {t("cart.continue", locale)}
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" loading="lazy"
                            onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling?.classList.remove("hidden"); }} />
                        ) : null}
                        <span className={cn("text-3xl", item.image && "hidden")}>🐾</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-[#ff6600] font-medium">{formatKWD(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="font-bold text-gray-900">{formatKWD(item.price * item.quantity)}</p>
                      </div>
                      <button onClick={() => removeItem(item.productId)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t("checkout.summary", locale)}</h2>
                <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-xl">
                  <button onClick={() => setDeliveryMethod("delivery")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${deliveryMethod === "delivery" ? "bg-white text-[#ff6600] shadow-sm" : "text-gray-600"}`}>
                    <Truck className="w-4 h-4" />
                    {t("checkout.deliveryMethod", locale)}
                  </button>
                  <button onClick={() => setDeliveryMethod("pickup")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${deliveryMethod === "pickup" ? "bg-white text-[#29ac00] shadow-sm" : "text-gray-600"}`}>
                    <Store className="w-4 h-4" />
                    {t("checkout.pickupMethod", locale)}
                  </button>
                </div>
                <div className="mb-4 p-3 rounded-xl bg-gray-50">
                  {deliveryMethod === "delivery" ? (
                    <>
                      <p className="text-sm text-gray-600">{t("order.deliveryFreeNote", locale)}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {t("order.deliveryFee", locale)} {deliveryFee === 0 ? t("checkout.free", locale) : formatKWD(deliveryFee)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600">{t("order.pickupAny", locale)}</p>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{t("checkout.subtotal", locale)}</span>
                    <span className="font-medium">{formatKWD(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t("checkout.deliveryTotal", locale)}</span>
                    <span className="font-medium">{deliveryFee === 0 ? t("checkout.free", locale) : formatKWD(deliveryFee)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{t("checkout.total", locale)}</span>
                    <span className="text-lg font-bold text-[#ff6600]">{formatKWD(total)}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full bg-[#ff6600] hover:bg-[#e65c00] text-white py-3 text-lg">
                    {t("order.proceedCheckout", locale)}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <div className="text-center mt-4">
                  <Link href="/" className="text-sm text-gray-500 hover:text-[#ff6600]">
                    {t("cart.continue", locale)}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
