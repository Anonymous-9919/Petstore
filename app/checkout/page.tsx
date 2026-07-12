"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { useCartStore, useCartSummary } from "@/lib/store";
import { useBranches } from "@/lib/use-branches";
import { formatKWD } from "@/lib/utils";
import { CreditCard, Truck, Store, MapPin, User, Mail, Phone, Home, Building, Shield, Check, ChevronRight, ArrowLeft, ShoppingBag } from "@/lib/icons";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import DeliveryToggle from "@/components/checkout/delivery-toggle";
import BranchSelector from "@/components/checkout/branch-selector";

export default function CheckoutPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const items = useCartStore((s) => s.items);
  const deliveryMethod = useCartStore((s) => s.deliveryMethod);
  const setDeliveryMethod = useCartStore((s) => s.setDeliveryMethod);
  const clearCart = useCartStore((s) => s.clearCart);
  const branches = useBranches();
  const isArabic = locale === "ar";

  const [selectedPayment, setSelectedPayment] = useState<"knet" | "credit-card" | "apple-pay" | "google-pay" | "cod">("knet");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", area: "", street: "", building: "", floor: "", apartment: "", landmark: "",
  });

  const { subtotal, deliveryFee, total } = useCartSummary();

  const updateField = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const validate = () => {
    if (!form.fullName.trim()) return t("checkout.errFullName", locale);
    if (!form.email.trim()) return t("checkout.errEmail", locale);
    if (!form.phone.trim()) return t("checkout.errPhone", locale);
    if (deliveryMethod === "delivery") {
      if (!form.area.trim()) return t("checkout.errArea", locale);
      if (!form.street.trim()) return t("checkout.errStreet", locale);
      if (!form.building.trim()) return t("checkout.errBuilding", locale);
    }
    if (deliveryMethod === "pickup" && !selectedBranch) return t("checkout.selectBranch", locale);
    return null;
  };

  const handlePlaceOrder = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setIsProcessing(true); setError("");

    try {
      const dbRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.fullName, email: form.email, phone: form.phone },
          delivery: { method: deliveryMethod, branchId: selectedBranch || null, address: deliveryMethod === "delivery" ? { area: form.area, street: form.street, building: form.building, floor: form.floor, apartment: form.apartment, landmark: form.landmark } : null },
          items: items.map((item) => ({ productId: item.productId, name: item.name, nameAr: item.nameAr, price: item.price, quantity: item.quantity, image: item.image })),
          subtotal, deliveryFee, total, paymentMethod: selectedPayment,
        }),
      });
      if (!dbRes.ok) { const d = await dbRes.json().catch(() => ({})); throw new Error(d.error || "Order save failed"); }
      const dbData = await dbRes.json();
      const orderNumber = dbData.orderNumber;

      if (selectedPayment !== "cod") {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const reference = orderNumber.slice(0, 12);
        const chargeRes = await fetch("/api/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: { id: orderNumber.slice(0, 35), reference, description: `Pet Store Kuwait order #${reference}`, currency: "KWD", amount: total },
            paymentGateway: { src: selectedPayment },
            language: locale,
            reference: { id: orderNumber.slice(0, 35) },
            customer: { uniqueId: form.email, name: form.fullName, email: form.email, mobile: form.phone },
            returnUrl: `${origin}/order/success?id=${dbData.orderId}`,
            cancelUrl: `${origin}/cart`,
            notificationUrl: `${origin}/api/webhook`,
          }),
        });
        const chargeData = await chargeRes.json().catch(() => ({}));
        if (!chargeRes.ok || chargeData.error) {
          setError(chargeData.error || t("checkout.errPayment", locale));
          return;
        }
      }
      clearCart();
      router.push(`/order/success?id=${dbData.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("checkout.errGeneric", locale));
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t("checkout.title", locale)}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#ff6600]" />
                {t("checkout.method", locale)}
              </h2>
              <DeliveryToggle locale={locale} />
              {deliveryMethod === "pickup" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                  <BranchSelector branches={branches} locale={locale} />
                </motion.div>
              )}
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#ff6600]" />
                {t("checkout.contact", locale)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.fullName", locale)} *</label>
                  <Input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder={t("checkout.fullNamePlaceholder", locale)} icon={User} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.email", locale)} *</label>
                  <Input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder={t("checkout.emailPlaceholder", locale)} icon={Mail} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.phoneLabel", locale)} *</label>
                  <Input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+965 XXXX XXXX" icon={Phone} />
                </div>
              </div>
            </motion.section>

            <AnimatePresence>
              {deliveryMethod === "delivery" && (
                <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#ff6600]" />
                    {t("checkout.address", locale)}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.areaBlock", locale)} *</label>
                      <Input value={form.area} onChange={(e) => updateField("area", e.target.value)} placeholder={t("checkout.areaPlaceholder", locale)} icon={MapPin} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.street", locale)} *</label>
                      <Input value={form.street} onChange={(e) => updateField("street", e.target.value)} placeholder={t("checkout.streetPlaceholder", locale)} icon={Home} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.buildingHouse", locale)} *</label>
                      <Input value={form.building} onChange={(e) => updateField("building", e.target.value)} placeholder={t("checkout.buildingPlaceholder", locale)} icon={Building} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.floor", locale)}</label>
                      <Input value={form.floor} onChange={(e) => updateField("floor", e.target.value)} placeholder={t("checkout.floorPlaceholder", locale)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.apartment", locale)}</label>
                      <Input value={form.apartment} onChange={(e) => updateField("apartment", e.target.value)} placeholder={t("checkout.apartmentPlaceholder", locale)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("checkout.landmarkLabel", locale)}</label>
                      <Input value={form.landmark} onChange={(e) => updateField("landmark", e.target.value)} placeholder={t("checkout.landmarkPlaceholder", locale)} />
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#ff6600]" />
                {t("checkout.payment", locale)}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "knet" as const, label: t("checkout.knet", locale), sub: t("checkout.knet-desc", locale), icon: <CreditCard className="w-6 h-6" /> },
                  { id: "credit-card" as const, label: t("checkout.credit-card", locale), sub: t("checkout.credit-desc", locale), icon: <CreditCard className="w-6 h-6" /> },
                  { id: "apple-pay" as const, label: t("checkout.apple-pay", locale), sub: t("checkout.apple-pay-desc", locale), icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M17.72 7.56c-.14.1-2.33 1.34-2.33 4.11 0 3.26 2.87 4.42 2.96 4.45-.01.06-.46 1.59-1.52 3.13-.95 1.36-1.94 2.72-3.49 2.72s-1.96-.92-3.75-.92c-1.85 0-2.43.95-3.82.95-1.38 0-2.33-1.27-3.5-2.8C3.73 17.65 3 14.35 3 11.18c0-5.01 3.26-7.68 6.48-7.68 1.71 0 3.13 1.13 4.19 1.13 1.01 0 2.59-1.2 4.44-1.2.68 0 2.62.06 3.97 1.93l-.36.2zM14.23 3c.82-.98 1.39-2.35 1.39-3.72 0-.19-.02-.38-.05-.55-1.33.05-2.9.9-3.85 2.03-.75.91-1.42 2.29-1.42 3.68 0 .2.03.39.05.46.08.02.2.03.32.03 1.2 0 2.75-.82 3.56-1.93z"/></svg>
                  ) },
                  { id: "google-pay" as const, label: t("checkout.google-pay", locale), sub: t("checkout.google-pay-desc", locale), icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174" fill="none"/><path d="M5.863 13.999l-.797 3.027-2.868.001C3.834 15.248 4.2 13.663 4.2 12c0-1.664.367-3.249.805-4.426l3.036.002L5.863 14z" fill="#EA4335"/><path d="M12.24 4.8c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0 7.607 0 3.703 2.66 1.832 6.6l3.289 2.552C6.432 5.748 8.927 4.8 12.24 4.8z" fill="#EA4335"/><path d="M12.24 24c3.24 0 5.953-1.08 7.937-2.913l-3.676-2.996c-1.087.726-2.502 1.163-4.261 1.163-3.286 0-6.078-2.22-7.072-5.202l-3.228 2.488C3.703 21.34 7.607 24 12.24 24z" fill="#34A853"/><path d="M23.76 12.274c0-.788-.085-1.39-.189-1.989H12.24v4.114h6.506c-.294 1.554-1.224 2.875-2.594 3.757l3.676 2.996c2.15-1.982 3.931-4.908 3.931-8.878z" fill="#4285F4"/></svg>
                  ) },
                  { id: "cod" as const, label: t("checkout.cash-on-delivery", locale), sub: t("checkout.cod-desc", locale), icon: (
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" stroke="none"/><path d="M6 12h2m8 0h2"/></svg>
                  ) },
                ].map((method) => (
                  <button key={method.id} onClick={() => setSelectedPayment(method.id)} className={`p-4 rounded-xl border-2 transition-all text-left ${selectedPayment === method.id ? "border-[#ff6600] bg-[#ff6600]/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedPayment === method.id ? "bg-[#ff6600]/10 text-[#ff6600]" : "bg-gray-100 text-gray-600"}`}>{method.icon}</div>
                      <div>
                        <p className="font-medium text-gray-900">{method.label}</p>
                        <p className="text-xs text-gray-500">{method.sub}</p>
                      </div>
                    </div>
                    {selectedPayment === method.id && <div className="mt-2 flex justify-end"><Check className="w-5 h-5 text-[#ff6600]" /></div>}
                  </button>
                ))}
              </div>
            </motion.section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#ff6600]" />
                {t("checkout.summary", locale)}
              </h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} × {formatKWD(item.price)}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 ml-2">{formatKWD(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">{t("checkout.subtotal", locale)}</span><span>{formatKWD(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">{t("checkout.deliveryTotal", locale)}</span><span>{deliveryFee === 0 ? t("checkout.free", locale) : formatKWD(deliveryFee)}</span></div>
              </div>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{t("checkout.total", locale)}</span>
                  <span className="text-lg font-bold text-[#ff6600]">{formatKWD(total)}</span>
                </div>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 p-3 bg-red-50 rounded-xl text-sm text-red-600">{error}</motion.div>
                )}
              </AnimatePresence>
              <Button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full bg-[#ff6600] hover:bg-[#e65c00] text-white py-4 text-lg font-semibold disabled:opacity-50">
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("checkout.processing", locale)}
                  </div>
                ) : (
                  <>
                    {t("checkout.place-order", locale)}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                <span>{t("checkout.secureBy", locale)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
