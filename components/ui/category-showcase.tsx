"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PetIcon } from "@/components/ui/pet-icon";
import type { PetType } from "@/types";
import type { Locale } from "@/lib/translations";
import { cn } from "@/lib/utils";

interface PetTypeInfo {
  type: PetType;
  nameEn: string;
  nameAr: string;
  emoji: string;
}

const petTypes: PetTypeInfo[] = [
  { type: "cats", nameEn: "Cats", nameAr: "القطط", emoji: "🐱" },
  { type: "dogs", nameEn: "Dogs", nameAr: "الكلاب", emoji: "🐶" },
  { type: "birds", nameEn: "Birds", nameAr: "الطيور", emoji: "🐦" },
  { type: "fish", nameEn: "Fish", nameAr: "الأسماك", emoji: "🐟" },
  { type: "rabbits", nameEn: "Rabbits", nameAr: "الأرانب", emoji: "🐰" },
  { type: "hamsters", nameEn: "Hamsters", nameAr: "الهامستر", emoji: "🐹" },
  { type: "reptiles", nameEn: "Reptiles", nameAr: "الزواحف", emoji: "🦎" },
  { type: "general", nameEn: "General", nameAr: "عام", emoji: "🐾" },
];

interface CategoryShowcaseProps {
  locale: Locale;
}

export function CategoryShowcase({ locale }: CategoryShowcaseProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {petTypes.map((pet) => (
        <Link
          key={pet.type}
          href={`/products?petType=${pet.type}`}
          className="flex flex-col items-center gap-1.5 min-w-[72px] group"
        >
          <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-100 group-hover:border-[#ff6600] flex items-center justify-center text-2xl transition-all group-hover:scale-110 group-hover:shadow-md">
            {pet.emoji}
          </div>
          <span className="text-[10px] font-semibold text-gray-600 group-hover:text-[#ff6600] transition-colors whitespace-nowrap">
            {locale === "ar" ? pet.nameAr : pet.nameEn}
          </span>
        </Link>
      ))}
    </div>
  );
}
