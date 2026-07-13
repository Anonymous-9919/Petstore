"use client";

import Image from "next/image";
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Instagram,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/store/page-header";
import { useUIStore } from "@/stores/ui-store";
import { STORE, BRANCHES, UI_STRINGS } from "@/lib/constants";

export default function ContactPage() {
  const { language } = useUIStore();
  const isArabic = language === "ar";

  const branches = [
    {
      ...BRANCHES[0],
      address: isArabic
        ? "العلي، الكويت"
        : "Al Rai, Kuwait",
      phone: STORE.phone,
      hours: isArabic
        ? "السبت - الخميس: 9 ص - 11 م"
        : "Sat - Thu: 9AM - 11PM",
    },
    {
      ...BRANCHES[1],
      address: isArabic
        ? "السالمية، الكويت"
        : "Salmiya, Kuwait",
      phone: STORE.phone,
      hours: isArabic
        ? "السبت - الخميس: 9 ص - 11 م"
        : "Sat - Thu: 9AM - 11PM",
    },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        title={
          isArabic
            ? UI_STRINGS.connectWithUsAr
            : UI_STRINGS.connectWithUs
        }
      />

      <div className="px-4 py-4">
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full bg-gray-100">
            <Image
              src={isArabic ? STORE.logoAr : STORE.logo}
              alt={STORE.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <h2 className="text-base font-bold text-text-black">
            {isArabic ? STORE.nameAr : STORE.name}
          </h2>
          <p className="text-xs text-text-secondary">
            {isArabic ? STORE.sloganAr : STORE.slogan}
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <a
            href={`https://api.whatsapp.com/send?phone=${STORE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-whatsapp/10">
              <MessageCircle className="h-5 w-5 text-brand-whatsapp" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-black">
                {isArabic ? "واتساب" : "WhatsApp"}
              </p>
              <p className="text-xs text-text-secondary">
                {STORE.countryCode} {STORE.phone}
              </p>
            </div>
          </a>

          <a
            href={`tel:${STORE.callCenter}`}
            className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10">
              <Phone className="h-5 w-5 text-brand-orange" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-black">
                {isArabic ? "مركز الاتصال" : "Call Center"}
              </p>
              <p className="text-xs text-text-secondary">
                {STORE.countryCode} {STORE.callCenter}
              </p>
            </div>
          </a>

          <a
            href={`mailto:${STORE.email}`}
            className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-black">
                {isArabic ? "البريد الإلكتروني" : "Email"}
              </p>
              <p className="text-xs text-text-secondary">{STORE.email}</p>
            </div>
          </a>

          <a
            href={STORE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50">
              <Instagram className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-black">Instagram</p>
              <p className="text-xs text-text-secondary">
                @petstore.kw
              </p>
            </div>
          </a>
        </div>

        <h3 className="mb-3 text-sm font-bold text-text-black">
          {isArabic
            ? UI_STRINGS.ourBranchesAr
            : UI_STRINGS.ourBranches}
        </h3>

        <div className="space-y-3">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-lg bg-white p-4 shadow-sm"
            >
              <h4 className="mb-2 text-sm font-bold text-text-black">
                {isArabic ? branch.nameAr : branch.name}
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-orange" />
                  <span className="text-xs text-text-secondary">
                    {branch.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand-orange" />
                  <span className="text-xs text-text-secondary">
                    {STORE.countryCode} {branch.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-orange" />
                  <span className="text-xs text-text-secondary">
                    {branch.hours}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
