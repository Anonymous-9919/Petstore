"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { Check, CreditCard, Package, Bell, PawPrint } from "@/lib/icons";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "N/A";
  const { locale } = useLocale();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (orderId && orderId !== "N/A") {
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { if (d?.orderNumber) setOrderNumber(d.orderNumber); })
        .catch(() => {});
    }
  }, [orderId]);

  const steps = [
    { icon: <CreditCard className="w-5 h-5" />, title: t("order.next-1", locale), desc: locale === "ar" ? "سيتم التحقق من عملية الدفع الخاصة بك" : "Your payment will be verified shortly" },
    { icon: <Package className="w-5 h-5" />, title: t("order.next-2", locale), desc: locale === "ar" ? "سنحضر طلبك بعناية" : "We'll prepare your order with care" },
    { icon: <Bell className="w-5 h-5" />, title: t("order.next-3", locale), desc: locale === "ar" ? "سنرسل لك تأكيداً عبر البريد الإلكتروني" : "We'll send you a confirmation via email" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 0.15, y: "100vh" }} transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.5 }} className="absolute text-[#ff6600]" style={{ left: `${15 + i * 15}%`, fontSize: `${20 + i * 5}px` }}>
            {i % 2 === 0 ? "🐾" : "⭐"}
          </motion.div>
        ))}
      </div>

      <div className="max-w-md mx-auto relative">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} className="w-24 h-24 bg-[#29ac00] rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
              <Check className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-bold text-gray-900 mb-2">
            {t("order.success-title", locale)}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-gray-500 mb-4">
            {t("order.success-desc", locale)}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gray-50 rounded-xl p-4 mb-8">
            <p className="text-sm text-gray-500">{t("order.id", locale)}</p>
            <p className="text-lg font-mono font-bold text-[#ff6600]">{orderNumber || orderId}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-left mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">{t("order.next-title", locale)}</h2>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ff6600]/10 flex items-center justify-center text-[#ff6600] shrink-0">{step.icon}</div>
                  <div>
                    <p className="font-medium text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-[#ff6600] hover:bg-[#e65c00] text-white py-3 text-lg">
                <PawPrint className="w-5 h-5 mr-2" />
                {t("order.continue", locale)}
              </Button>
            </Link>
            <Link href="/" className="block text-center text-sm text-gray-500 hover:text-[#ff6600] transition-colors">
              {t("order.back-home", locale)}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
