"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { Truck, Store, ArrowRight, MapPin, Clock, Phone, Check } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "ps_fulfillment_method";
const BRANCH_KEY = "ps_selected_branch";

interface Branch {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  phone: string[];
  hours: string;
  hoursAr: string;
  pickupAvailable: boolean;
  active: boolean;
}

type Step = "method" | "branch";

export function FulfillmentGate({ locale }: { locale: "en" | "ar" }) {
  const { deliveryMethod, selectedBranch, setDeliveryMethod, setSelectedBranch } = useCartStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("method");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/branches/public")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setBranches(data.filter((b: Branch) => b.active && b.pickupAvailable)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const savedMethod = window.sessionStorage.getItem(STORAGE_KEY);
      const savedBranch = window.sessionStorage.getItem(BRANCH_KEY);
      if (savedBranch && selectedBranch !== savedBranch) setSelectedBranch(savedBranch);

      if (savedMethod === "pickup" && !savedBranch) {
        setDeliveryMethod("pickup");
        setStep("branch");
        setOpen(true);
        return;
      }
      if (savedMethod === "delivery" || savedMethod === "pickup") {
        setDeliveryMethod(savedMethod);
        setOpen(false);
      } else {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, [mounted, selectedBranch, setDeliveryMethod, setSelectedBranch]);

  const close = useCallback(() => setOpen(false), []);

  const chooseMethod = (method: "delivery" | "pickup") => {
    setDeliveryMethod(method);
    try { window.sessionStorage.setItem(STORAGE_KEY, method); } catch {}
    if (method === "pickup") {
      setStep("branch");
    } else {
      // delivery: keep existing branch or unset
      try { window.sessionStorage.removeItem(BRANCH_KEY); } catch {}
      setSelectedBranch("");
      setOpen(false);
    }
  };

  const chooseBranch = (branchId: string) => {
    setSelectedBranch(branchId);
    try { window.sessionStorage.setItem(BRANCH_KEY, branchId); } catch {}
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-10 max-h-[90vh] overflow-y-auto"
          >
            <AnimatePresence mode="wait">
              {step === "method" && (
                <motion.div
                  key="method-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col items-center text-center mb-6">
                    <img src="/logo.jpg" alt="Pet Store" className="h-16 w-auto object-contain mb-4" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                      {locale === "ar" ? "كيف تود استلام طلبك؟" : "How would you like to receive your order?"}
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base">
                      {locale === "ar" ? "اختر طريقة الاستلام للمتابعة" : "Choose your fulfillment method to continue"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => chooseMethod("delivery")}
                      className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-[#ff6600] hover:bg-[#fff3e6] transition-all text-left"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-[#ff6600]/10 flex items-center justify-center group-hover:bg-[#ff6600] transition-colors">
                        <Truck className="w-8 h-8 text-[#ff6600] group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {locale === "ar" ? "توصيل" : "Delivery"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {locale === "ar" ? "توصيل إلى عنوانك" : "Delivered to your address"}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#ff6600] rtl:rotate-180" />
                    </button>

                    <button
                      onClick={() => chooseMethod("pickup")}
                      className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-[#29ac00] hover:bg-[#e6f9e0] transition-all text-left"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-[#29ac00]/10 flex items-center justify-center group-hover:bg-[#29ac00] transition-colors">
                        <Store className="w-8 h-8 text-[#29ac00] group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {locale === "ar" ? "استلام" : "Pickup"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {locale === "ar" ? "استلام من أحد فروعنا" : "Pick up from a branch"}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#29ac00] rtl:rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "branch" && (
                <motion.div
                  key="branch-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#29ac00]/10 flex items-center justify-center mb-4">
                      <MapPin className="w-7 h-7 text-[#29ac00]" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                      {locale === "ar" ? "اختر فرع الاستلام" : "Choose a pickup branch"}
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {locale === "ar" ? "اختر الفرع الأقرب إليك" : "Select the branch nearest to you"}
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {branches.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        {locale === "ar" ? "لا توجد فروع متاحة" : "No branches available for pickup"}
                      </div>
                    ) : branches.map((b) => {
                      const isSelected = selectedBranch === b.id;
                      const name = locale === "ar" ? b.nameAr : b.name;
                      const address = locale === "ar" ? b.addressAr : b.address;
                      const hours = locale === "ar" ? b.hoursAr : b.hours;
                      return (
                        <button
                          key={b.id}
                          onClick={() => chooseBranch(b.id)}
                          className={cn(
                            "w-full text-left rounded-xl border-2 p-4 transition-all",
                            isSelected
                              ? "border-[#29ac00] bg-[#e6f9e0]"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{name}</h3>
                                {isSelected && <Check className="w-4 h-4 text-[#29ac00]" />}
                              </div>
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-start gap-1.5">
                                  <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-gray-400" />
                                  <span className="line-clamp-2">{address}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 shrink-0 text-gray-400" />
                                  <span>{hours}</span>
                                </div>
                                {b.phone?.[0] && (
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="w-3 h-3 shrink-0 text-gray-400" />
                                    <span dir="ltr">{b.phone[0]}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={cn(
                              "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1",
                              isSelected ? "border-[#29ac00]" : "border-gray-300"
                            )}>
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#29ac00]" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => setStep("method")}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      ← {locale === "ar" ? "رجوع" : "Back"}
                    </button>
                    <p className="text-xs text-gray-400 self-center ml-auto">
                      {locale === "ar" ? "اختر فرعاً للمتابعة" : "Select a branch to continue"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
