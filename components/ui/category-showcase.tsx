"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PetIcon } from "@/components/ui/pet-icon";
import type { PetType } from "@/types";
import type { Locale } from "@/lib/translations";

interface PetTypeInfo {
  type: PetType;
  nameEn: string;
  nameAr: string;
}

const petTypes: PetTypeInfo[] = [
  { type: "cats", nameEn: "Cats", nameAr: "القطط" },
  { type: "dogs", nameEn: "Dogs", nameAr: "الكلاب" },
  { type: "birds", nameEn: "Birds", nameAr: "الطيور" },
  { type: "fish", nameEn: "Fish", nameAr: "الأسماك" },
  { type: "rabbits", nameEn: "Rabbits", nameAr: "الأرانب" },
  { type: "hamsters", nameEn: "Hamsters", nameAr: "الهامستر" },
  { type: "reptiles", nameEn: "Reptiles", nameAr: "الزواحف" },
  { type: "general", nameEn: "General", nameAr: "عام" },
];

interface CategoryData {
  name: string;
  nameAr: string;
  slug: string;
  petType: string;
  image?: string;
  count: number;
}

interface CategoryShowcaseProps {
  locale: Locale;
}

export function CategoryShowcase({ locale }: CategoryShowcaseProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const productCount = (petType: PetType) =>
    categories
      .filter((c) => c.petType === petType)
      .reduce((sum, c) => sum + (c.count || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {petTypes.map((pet, i) => {
        const sampleCategory = categories.find(
          (c) => c.petType === pet.type && c.image
        );
        const imageUrl = sampleCategory?.image;

        return (
          <motion.div
            key={pet.type}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              href={`/products?petType=${pet.type}`}
              className="group relative flex flex-col aspect-square rounded-2xl overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={locale === "ar" ? pet.nameAr : pet.nameEn}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fb) fb.style.display = "flex";
                  }}
                />
              ) : null}

              <div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200"
                style={{ display: imageUrl ? "none" : "flex" }}
              >
                <PetIcon petType={pet.type} size={48} />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative z-10 mt-auto p-3 sm:p-4 flex flex-col">
                <span className="text-white font-bold text-sm sm:text-base drop-shadow">
                  {locale === "ar" ? pet.nameAr : pet.nameEn}
                </span>
                <span className="text-white/80 text-xs drop-shadow">
                  {productCount(pet.type)} {locale === "ar" ? "منتج" : "products"}
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
