import type { CartItem, AppliedPromotion, PromotionRules } from "@/types";
import type { Promotion, PromotionType } from "@prisma/client";

/**
 * Evaluates all active promotions against the cart and returns
 * a list of applicable promotions with their discount amounts.
 */
export function evaluatePromotions(
  items: CartItem[],
  promotions: Promotion[]
): AppliedPromotion[] {
  const now = new Date();
  const applicable: AppliedPromotion[] = [];

  for (const promo of promotions) {
    if (!promo.isActive) continue;
    if (promo.startsAt && promo.startsAt > now) continue;
    if (promo.endsAt && promo.endsAt < now) continue;
    if (promo.usageLimit != null && promo.usageCount >= promo.usageLimit)
      continue;

    const rules: PromotionRules = promo.rulesJson
      ? JSON.parse(promo.rulesJson)
      : {};

    const result = applyPromotion(promo.type, rules, items, promo);
    if (result) applicable.push(result);
  }

  return applicable;
}

function applyPromotion(
  type: PromotionType,
  rules: PromotionRules,
  items: CartItem[],
  promo: Promotion
): AppliedPromotion | null {
  const subtotal = items.reduce(
    (s, i) => s + i.unitPrice * i.quantity,
    0
  );

  // Filter applicable items by product/category restriction
  const eligibleItems =
    rules.applicableProductIds?.length
      ? items.filter((i) => rules.applicableProductIds!.includes(i.productId))
      : items;

  if (eligibleItems.length === 0) return null;

  // Check minimum order amount
  if (rules.minOrderAmount && subtotal < rules.minOrderAmount) return null;

  switch (type) {
    case "BUY_X_GET_Y": {
      // e.g. buy 3 get 1 free
      const buyQty = rules.buyQuantity ?? rules.buyQty ?? 3;
      const getQty = rules.getQuantity ?? rules.getQty ?? 1;
      const totalEligibleQty = eligibleItems.reduce(
        (s, i) => s + i.quantity,
        0
      );
      if (totalEligibleQty < buyQty) return null;

      const freeGroups = Math.floor(totalEligibleQty / buyQty);
      const freeQty = freeGroups * getQty;

      // Discount = cheapest unit price × total free quantity
      const sortedItems = [...eligibleItems].sort(
        (a, b) => a.unitPrice - b.unitPrice
      );
      const cheapestPrice = sortedItems[0].unitPrice;
      const discountAmount = cheapestPrice * freeQty;

      return {
        promotionId: promo.id,
        name: promo.name,
        promotionType: promo.type,
        discountAmount,
      };
    }

    case "PERCENTAGE": {
      const pct = promo.discountValue ?? 0;
      const eligible = eligibleItems.reduce(
        (s, i) => s + i.unitPrice * i.quantity,
        0
      );
      return {
        promotionId: promo.id,
        name: promo.name,
        promotionType: promo.type,
        discountAmount: (eligible * pct) / 100,
      };
    }

    case "FIXED_AMOUNT": {
      const amount = promo.discountValue ?? 0;
      return {
        promotionId: promo.id,
        name: promo.name,
        promotionType: promo.type,
        discountAmount: Math.min(amount, subtotal),
      };
    }

    case "FREE_SHIPPING":
      return {
        promotionId: promo.id,
        name: promo.name,
        promotionType: promo.type,
        discountAmount: 0, // shipping fee reduced at checkout level
      };

    default:
      return null;
  }
}
