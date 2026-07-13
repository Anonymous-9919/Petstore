"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Share2, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/store/page-header";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";
import { UI_STRINGS, STORE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

const MOCK_PRODUCT = {
  id: "1",
  name: "Whiskas Cat Wet Food - Tuna",
  nameAr: "ويسكاس طعام رطب للقطط - تونة",
  description:
    "Whiskas Tuna wet food is a delicious and nutritious meal for your cat. Made with real tuna, it provides all the essential nutrients your cat needs for a healthy and happy life. Perfect for adult cats.",
  arDescription:
    "ويسكاس طعام تونة الرطب هو وجبة لذيذة ومغذية لقطك. مصنوع من التونة الحقيقية، ويوفر جميع العناصر الغذائية الأساسية التي يحتاجها قطك لحياة صحية وسعيدة. مثالي للقطط البالغة.",
  slug: "whiskas-cat-wet-food-tuna",
  categorySlug: "cat-wet-food",
  price: 0.45,
  comparePrice: 0.55,
  photo: "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg",
  photos: [
    "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/20/cd/20cdb0fccdeb8e77bda91a31a8c3c078.jpg",
    "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/9f/d0/9fd0a249feff2c61704bdab12a05e7e6.jpg",
    "https://tapcom-live.ams3.cdn.digitaloceanspaces.com/media/cache/54/52/54520d644d9df159e87f886bd62afc7d.jpg",
  ],
  variants: [
    { id: "v1", name: "85g", nameAr: "85 جرام", price: 0.45 },
    { id: "v2", name: "150g", nameAr: "150 جرام", price: 0.75 },
    { id: "v3", name: "400g", nameAr: "400 جرام", price: 1.50 },
  ],
  specialRequestsEnabled: true,
};

export default function ProductDetailPage() {
  const params = useParams();
  const { language } = useUIStore();
  const { addItem, addWithOptions } = useCartStore();
  const isArabic = language === "ar";

  const [selectedVariant, setSelectedVariant] = useState(
    MOCK_PRODUCT.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [specialRequest, setSpecialRequest] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const handleAddToCart = () => {
    addWithOptions(
      {
        id: `${MOCK_PRODUCT.id}-${selectedVariant.id}`,
        productId: MOCK_PRODUCT.id,
        variantId: selectedVariant.id,
        name: MOCK_PRODUCT.name,
        nameAr: MOCK_PRODUCT.nameAr,
        photo: MOCK_PRODUCT.photo,
        price: selectedVariant.price,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isArabic ? MOCK_PRODUCT.nameAr : MOCK_PRODUCT.name,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader />

      <div className="relative w-full bg-white" style={{ height: 350 }}>
        <Image
          src={MOCK_PRODUCT.photos[selectedImage]}
          alt={isArabic ? MOCK_PRODUCT.nameAr : MOCK_PRODUCT.name}
          fill
          className="object-contain p-4"
          unoptimized
          priority
        />
        <button
          onClick={handleShare}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-3 py-2 hide-scrollbar">
        {MOCK_PRODUCT.photos.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
              i === selectedImage
                ? "border-brand-orange"
                : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${i + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

      <div className="bg-white px-4 py-3">
        <h1
          className="mb-1 text-base font-bold text-text-black"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {isArabic ? MOCK_PRODUCT.nameAr : MOCK_PRODUCT.name}
        </h1>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg font-bold text-brand-orange">
            {formatPrice(selectedVariant.price)} KD
          </span>
          {MOCK_PRODUCT.comparePrice && (
            <span className="text-sm text-text-muted line-through">
              {formatPrice(MOCK_PRODUCT.comparePrice)} KD
            </span>
          )}
        </div>

        {MOCK_PRODUCT.variants.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-bold text-text-primary">
              {isArabic ? "الحجم" : "Size"}:
            </p>
            <div className="flex gap-2">
              {MOCK_PRODUCT.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedVariant.id === variant.id
                      ? "border-brand-orange bg-brand-orange text-white"
                      : "border-store-border bg-white text-text-primary"
                  }`}
                >
                  {isArabic ? variant.nameAr : variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm font-bold text-text-primary">
            {isArabic ? "الكمية" : "Quantity"}:
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-8 w-8 items-center justify-center rounded border border-store-border text-lg"
            >
              -
            </button>
            <span className="min-w-[24px] text-center text-sm font-bold">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded border border-store-border text-lg"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {MOCK_PRODUCT.specialRequestsEnabled && (
        <div className="bg-white px-4 py-3 border-t border-store-border">
          <p className="mb-2 text-sm font-bold text-text-primary">
            {isArabic
              ? UI_STRINGS.specialRequestsAr
              : UI_STRINGS.specialRequests}
          </p>
          <textarea
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder={
              isArabic ? "اضف ملاحظات خاصة..." : "Add special instructions..."
            }
            className="w-full rounded-lg border border-store-border p-3 text-sm resize-none"
            rows={3}
          />
        </div>
      )}

      <div className="bg-white px-4 py-3 border-t border-store-border">
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="flex w-full items-center justify-between py-1"
        >
          <span className="text-sm font-bold text-text-primary">
            {isArabic
              ? UI_STRINGS.descriptionAr
              : UI_STRINGS.description}
          </span>
          <span className="text-lg text-text-muted">
            {showDescription ? "−" : "+"}
          </span>
        </button>
        {showDescription && (
          <p
            className="mt-2 text-sm text-text-secondary"
            dir={isArabic ? "rtl" : "ltr"}
          >
            {isArabic
              ? MOCK_PRODUCT.arDescription
              : MOCK_PRODUCT.description}
          </p>
        )}
      </div>

      <div className="bg-white px-4 py-3 border-t border-store-border">
        <p className="mb-2 text-xs font-bold uppercase text-text-secondary">
          {isArabic
            ? UI_STRINGS.shareWithFriendAr
            : UI_STRINGS.shareWithFriend}
        </p>
        <div className="flex gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              isArabic ? MOCK_PRODUCT.nameAr : MOCK_PRODUCT.name
            )}%20${encodeURIComponent(window?.location?.href || "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-whatsapp text-white"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-2 border-t border-store-border bg-white px-4 py-3 pb-[70px]">
        <button
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-brand-orange py-3 text-sm font-bold text-brand-orange transition-colors hover:bg-brand-orange/5"
        >
          {isArabic ? UI_STRINGS.addToCartAr : UI_STRINGS.addToCart}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex flex-1 items-center justify-center rounded-lg bg-brand-green py-3 text-sm font-bold text-white shadow-btn transition-colors hover:bg-brand-green-hover"
        >
          {isArabic ? UI_STRINGS.buyNowAr : UI_STRINGS.buyNow}
        </button>
      </div>
    </div>
  );
}
