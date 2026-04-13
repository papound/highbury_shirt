import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, AppliedPromotion } from "@/types";

interface CartStore {
  items: CartItem[];
  appliedPromotions: AppliedPromotion[];

  // Computed
  subtotal: number;
  discountAmount: number;
  total: number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromotion: (promo: AppliedPromotion) => void;
  removePromotion: (promotionId: string) => void;
  refreshAutoPromotions: (promos: AppliedPromotion[]) => void;
  applyCodePromotion: (promo: AppliedPromotion) => void;
  removeCodePromotion: () => void;
}

function computeTotals(
  items: CartItem[],
  promos: AppliedPromotion[]
): { subtotal: number; discountAmount: number; total: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const discountAmount = promos.reduce((sum, p) => sum + p.discountAmount, 0);
  const total = Math.max(0, subtotal - discountAmount);
  return { subtotal, discountAmount, total };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromotions: [],
      subtotal: 0,
      discountAmount: 0,
      total: 0,

      addItem(newItem) {
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === newItem.variantId
          );
          const items = existing
            ? state.items.map((i) =>
                i.variantId === newItem.variantId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              )
            : [...state.items, newItem];
          return { items, ...computeTotals(items, state.appliedPromotions) };
        });
      },

      removeItem(variantId) {
        set((state) => {
          const items = state.items.filter((i) => i.variantId !== variantId);
          return { items, ...computeTotals(items, state.appliedPromotions) };
        });
      },

      updateQuantity(variantId, quantity) {
        set((state) => {
          const items =
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) =>
                  i.variantId === variantId ? { ...i, quantity } : i
                );
          return { items, ...computeTotals(items, state.appliedPromotions) };
        });
      },

      clearCart() {
        set({
          items: [],
          appliedPromotions: [],
          subtotal: 0,
          discountAmount: 0,
          total: 0,
        });
      },

      applyPromotion(promo) {
        set((state) => {
          const exists = state.appliedPromotions.find(
            (p) => p.promotionId === promo.promotionId
          );
          if (exists) return state;
          const promos = [...state.appliedPromotions, promo];
          return {
            appliedPromotions: promos,
            ...computeTotals(state.items, promos),
          };
        });
      },

      removePromotion(promotionId) {
        set((state) => {
          const promos = state.appliedPromotions.filter(
            (p) => p.promotionId !== promotionId
          );
          return {
            appliedPromotions: promos,
            ...computeTotals(state.items, promos),
          };
        });
      },

      refreshAutoPromotions(autoPromos) {
        set((state) => {
          // Keep code-based promos, replace auto ones
          const codePromos = state.appliedPromotions.filter((p) => p.fromCode);
          const promos = [...autoPromos, ...codePromos];
          return {
            appliedPromotions: promos,
            ...computeTotals(state.items, promos),
          };
        });
      },

      applyCodePromotion(promo) {
        set((state) => {
          // Replace existing code promo (only one allowed at a time)
          const nonCodePromos = state.appliedPromotions.filter((p) => !p.fromCode);
          const promos = [...nonCodePromos, { ...promo, fromCode: true }];
          return {
            appliedPromotions: promos,
            ...computeTotals(state.items, promos),
          };
        });
      },

      removeCodePromotion() {
        set((state) => {
          const promos = state.appliedPromotions.filter((p) => !p.fromCode);
          return {
            appliedPromotions: promos,
            ...computeTotals(state.items, promos),
          };
        });
      },
    }),
    {
      name: "highbury-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
