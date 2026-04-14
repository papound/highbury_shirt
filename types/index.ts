import type { Role } from "@prisma/client";

// ─── Auth ─────────────────────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
    };
  }
  interface JWT {
    id: string;
    role: Role;
  }
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  productNameTh: string;
  slug: string;
  color: string;
  size: string;
  sku: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  stock: number;
}

export interface AppliedPromotion {
  promotionId: string;
  name: string;
  discountAmount: number;
  promotionType?: string; // PromotionType enum value
  freeItems?: CartItem[];
  fromCode?: boolean; // true = applied via promo code input
}

export interface CartState {
  items: CartItem[];
  appliedPromotions: AppliedPromotion[];
  subtotal: number;
  discountAmount: number;
  total: number;
}

// ─── Promotion Rules ──────────────────────────────────────────────────────────

export interface PromotionRules {
  buyQty?: number;
  getQty?: number;
  buyQuantity?: number;
  getQuantity?: number;
  minOrderAmount?: number;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
}

// ─── Excel Import ─────────────────────────────────────────────────────────────

export interface ProductImportRow {
  name: string;
  nameTh: string;
  slug?: string;
  description?: string;
  descTh?: string;
  basePrice: number;
  categorySlug: string;
  color: string;
  colorHex?: string;
  size: string;
  sku: string;
  price?: number;
  warehouseName?: string;
  quantity?: number;
}
