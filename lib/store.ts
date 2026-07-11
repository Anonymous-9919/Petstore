"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, DeliveryMethod } from "@/types";

interface CartStore {
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  selectedBranch: string;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getItemQuantity: (productId: string) => number;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setSelectedBranch: (branchId: string) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryMethod: "delivery",
      selectedBranch: "salmiya",
      cartDrawerOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
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

      getItemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),

      getDeliveryFee: () => {
        const state = get();
        if (state.deliveryMethod === "pickup") return 0;
        const subtotal = state.getSubtotal();
        return subtotal >= 10 ? 0 : 1.000;
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        return item ? item.quantity : 0;
      },

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

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "petstore-cart" && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        const store = useCartStore.getState();
        if (parsed.state?.items) {
          store.items.length === 0 && parsed.state.items.length > 0 &&
            useCartStore.setState({ items: parsed.state.items });
        }
      } catch {}
    }
  });
}
