"use client";

import { StoreHeader } from "@/components/store/store-header";
import { DeliveryToggle } from "@/components/store/delivery-toggle";
import { LocationBar } from "@/components/store/location-bar";
import { CategoryBar } from "@/components/store/category-bar";
import { Carousel } from "@/components/store/carousel";
import { ProductGrid } from "@/components/store/product-grid";
import { useUIStore } from "@/stores/ui-store";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Whiskas Cat Wet Food - Tuna",
    nameAr: " ويiskas طعام رطب للقطط - تونة",
    slug: "whiskas-cat-wet-food-tuna",
    categorySlug: "cat-wet-food",
    variant: "85g",
    variantAr: "85 جرام",
    price: 0.45,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg",
  },
  {
    id: "2",
    name: "Pedigree Dog Wet Food - Beef",
    nameAr: "بيديجري طعام رطب للكلاب - لحم بقري",
    slug: "pedigree-dog-wet-food-beef",
    categorySlug: "dog-wet-food",
    variant: "100g",
    variantAr: "100 جرام",
    price: 0.55,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/9f/d0/9fd0a249feff2c61704bdab12a05e7e6.jpg",
  },
  {
    id: "3",
    name: "Royal Canin Cat Dry Food - Indoor",
    nameAr: "رويال كنين الطعام الجاف للقطط - داخلي",
    slug: "royal-canin-cat-dry-food-indoor",
    categorySlug: "cat-dry-food",
    variant: "2kg",
    variantAr: "2 كجم",
    price: 7.50,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/54/52/54520d644d9df159e87f886bd62afc7d.jpg",
  },
  {
    id: "4",
    name: "Kong Cat Toy - Red",
    nameAr: "كונג لعبة القطط - احمر",
    slug: "kong-cat-toy-red",
    categorySlug: "cat-toys",
    variant: "Medium",
    variantAr: "متوسط",
    price: 3.00,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/17/ae/17ae187c42d53b5cfe0b622ff46bca95.jpg",
  },
  {
    id: "5",
    name: "Catit Litter Box - Large",
    nameAr: "كاتيت صندوق تراب للقطط - كبير",
    slug: "catit-litter-box-large",
    categorySlug: "cat-litter",
    variant: "Large",
    variantAr: "كبير",
    price: 5.50,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/05/43/05438444f1060c19f77dcb86583491ed.jpg",
  },
  {
    id: "6",
    name: "Hills Science Diet Dog - Adult",
    nameAr: "هيلز ساينس دايت للكلاب - بالغ",
    slug: "hills-science-diet-dog-adult",
    categorySlug: "dog-dry-food",
    variant: "3kg",
    variantAr: "3 كجم",
    price: 12.00,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg",
  },
  {
    id: "7",
    name: "Bird Seed Mix - Premium",
    nameAr: "خلطة بذور الطيور - بريميوم",
    slug: "bird-seed-mix-premium",
    categorySlug: "bird-food",
    variant: "1kg",
    variantAr: "1 كجم",
    price: 2.75,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/9f/d0/9fd0a249feff2c61704bdab12a05e7e6.jpg",
  },
  {
    id: "8",
    name: "Pet Carrier Bag - Blue",
    nameAr: "شنطة نقل الحيوانات - زرقاء",
    slug: "pet-carrier-bag-blue",
    categorySlug: "pet-carriers",
    variant: "Medium",
    variantAr: "متوسط",
    price: 8.00,
    photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/54/52/54520d644d9df159e87f886bd62afc7d.jpg",
  },
];

export default function HomePage() {
  const { language } = useUIStore();
  const isArabic = language === "ar";

  return (
    <div className="flex flex-col">
      <StoreHeader />
      <DeliveryToggle />
      <LocationBar />
      <Carousel />
      <CategoryBar />

      <div className="px-2 pt-2">
        <h2 className="mb-2 px-2 text-sm font-bold text-text-primary">
          {isArabic ? "جميع المنتجات" : "All Products"}
        </h2>
        <ProductGrid products={MOCK_PRODUCTS} />
      </div>
    </div>
  );
}
