"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { useCartStore } from "@/lib/store";
import { formatKWD } from "@/lib/utils";
import type { Branch } from "@/types";
import { CreditCard, Truck, Store, MapPin, User, Mail, Phone, Home, Building, Shield, Check, ChevronRight, ArrowLeft, ShoppingBag } from "@/lib/icons";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import DeliveryToggle from "@/components/checkout/delivery-toggle";
import BranchSelector from "@/components/checkout/branch-selector";

export default function CheckoutPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { items, deliveryMethod, setDeliveryMethod, clearCart } = useCartStore();
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    fetch("/api/branches/public")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBranches(data))
      .catch(() => setBranches([]));
  }, []);
  const isArabic = locale === "ar";

  const [selectedPayment, setSelectedPayment] = useState<"knet" | "credit-card" | "apple-pay" | "google-pay" | "cod">("knet");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", area: "", street: "", building: "", floor: "", apartment: "", landmark: "",
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = useCartStore.getState().getDeliveryFee();
  const total = subtotal + deliveryFee;

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
                  { id: "apple-pay" as const, label: t("checkout.apple-pay", locale), sub: t("checkout.apple-pay-desc", locale), icon: <span className="text-lg">🍎</span> },
                  { id: "google-pay" as const, label: t("checkout.google-pay", locale), sub: t("checkout.google-pay-desc", locale), icon: <span className="text-lg">🌐</span> },
                  { id: "cod" as const, label: t("checkout.cash-on-delivery", locale), sub: t("checkout.cod-desc", locale), icon: <span className="text-lg">💵</span> },
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
