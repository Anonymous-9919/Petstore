"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { CartItem, DeliveryMethod } from "@/types";

const DELIVERY_FEE = 1;
const FREE_DELIVERY_MIN = 10;

interface CartStore {
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  selectedBranch: string;
  cartDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setSelectedBranch: (branchId: string) => void;
  setCartDrawerOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      deliveryMethod: "delivery",
      selectedBranch: "salmiya",
      cartDrawerOpen: false,

      addItem: (item, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                ),
        }));
      },

      clearCart: () => set({ items: [] }),
      setDeliveryMethod: (method) => set({ deliveryMethod: method }),
      setSelectedBranch: (branchId) => set({ selectedBranch: branchId }),
      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
      toggleCartDrawer: () => set((s) => ({ cartDrawerOpen: !s.cartDrawerOpen })),
    }),
    {
      name: "petstore-cart",
      partialize: (state) => ({
        items: state.items,
        deliveryMethod: state.deliveryMethod,
        selectedBranch: state.selectedBranch,
      }),
    }
  )
);

export function useCartItemCount(): number {
  return useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
}

export function useCartSubtotal(): number {
  return useCartStore((s) => s.items.reduce((acc, i) => acc + i.price * i.quantity, 0));
}

export function useCartItemQuantity(productId: string): number {
  return useCartStore((s) => {
    const item = s.items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  });
}

export function useCartSummary() {
  return useCartStore(useShallow((s) => {
    const itemCount = s.items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = s.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const deliveryFee = s.deliveryMethod === "pickup" ? 0 : subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
    return { itemCount, subtotal, deliveryFee, total: subtotal + deliveryFee };
  }));
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "petstore-cart" && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed.state?.items) {
          useCartStore.setState({ items: parsed.state.items });
        }
      } catch {
        // ignore parse errors
      }
    }
  });
}
