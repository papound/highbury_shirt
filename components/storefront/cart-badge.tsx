"use client";

import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/hooks/use-cart";

export default function CartBadge() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  if (count === 0) return null;

  return (
    <Badge
      variant="destructive"
      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
