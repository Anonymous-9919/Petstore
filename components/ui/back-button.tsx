"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { t } from "@/lib/translations";
import { useLocale } from "@/lib/locale";

export default function BackButton({ href = "/", label }: { href?: string; label?: string }) {
  const { locale } = useLocale();
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#ff6600] transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
      {label ?? t("nav.back", locale)}
    </Link>
  );
}
