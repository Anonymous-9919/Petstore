export type PetType = "cats" | "dogs" | "birds" | "fish" | "rabbits" | "hamsters" | "reptiles" | "general";
export type DeliveryMethod = "delivery" | "pickup";
export type PaymentMethod = "knet" | "credit-card" | "apple-pay" | "google-pay";

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  categoryAr: string;
  categorySlug: string;
  petType: PetType;
  images: string[];
  specs?: Record<string, string | undefined>;
  tags?: string[];
  featured?: boolean;
  onSale?: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  name: string;
  nameAr: string;
  slug: string;
  petType: PetType;
  icon?: string;
  count: number;
}

export interface CartItem {
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

export interface Branch {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  phone: string[];
  hours: string;
  hoursAr: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "paid" | "processing" | "completed" | "cancelled";
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  selectedBranch?: string;
  trackId?: string;
  createdAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  area?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}
