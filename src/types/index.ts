export interface Store {
  id: string;
  name: string;
  nameAr: string;
  slogan: string;
  sloganAr: string;
  logo: string;
  logoAr: string;
  cover: string;
  currency: string;
  settings: StoreSettings;
}

export interface StoreSettings {
  enablePickup: boolean;
  enableDelivery: boolean;
  enableSearch: boolean;
  enablePromotions: boolean;
  enableCoupons: boolean;
  enableVariants: boolean;
  enableSpecialRemarks: boolean;
  enableQuickAddToCart: boolean;
  enableFilterAndSort: boolean;
  minimumOrder: number;
  defaultLanguage: string;
  branchCount: number;
  dark: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  nameAr: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  nameAr: string;
  slug: string;
  photo: string;
  coverPhoto: string | null;
  order: number;
  description: string;
  arDescription: string;
  parentId: string | null;
  isActive: boolean;
  hasPassword: boolean;
  subCategories: Category[];
  products?: Product[];
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  arDescription: string;
  price: number;
  comparePrice: number | null;
  photo: string;
  photos: string[];
  sku: string;
  isActive: boolean;
  hasVariants: boolean;
  variants?: ProductVariant[];
  specialRequestsEnabled: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  sku: string;
  stock: number;
  weight: string;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  nameAr: string;
  photo: string;
  price: number;
  quantity: number;
  specialRequest?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  customerId: string;
  branchId: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryMode: DeliveryMode;
  deliveryAddressId: string | null;
  specialRemarks: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  defaultAddressId: string | null;
  createdAt: string;
}

export interface Address {
  id: string;
  customerId: string;
  label: string;
  area: string;
  block: string;
  street: string;
  building: string;
  flat: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface Promotion {
  id: string;
  tenantId: string;
  name: string;
  type: "percentage" | "fixed" | "buy_x_get_y";
  value: number;
  minOrder: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  tenantId: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  tenantId: string;
  name: string;
  minDistance: number;
  maxDistance: number;
  fee: number;
  isActive: boolean;
}

export interface CmsPage {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled";
export type PaymentMethod = "cash" | "knet" | "credit" | "apple_pay" | "tabby";
export type DeliveryMode = "delivery" | "pickup";
