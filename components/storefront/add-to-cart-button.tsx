"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/hooks/use-cart";
import { toast } from "sonner";

interface Variant {
  id: string;
  color: string;
  colorHex: string | null;
  size: string;
  sku: string;
  price: number;
  stock: number;
}

interface ProductData {
  id: string;
  nameTh: string;
  name: string;
  slug: string;
  imageUrl: string;
  variants: Variant[];
}

export default function AddToCartButton({ product }: { product: ProductData }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const availableSizes = selectedColor
    ? product.variants
        .filter((v) => v.color === selectedColor && v.stock > 0)
        .map((v) => v.size)
    : [];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const cartQty = selectedVariant
    ? (cartItems.find((i) => i.variantId === selectedVariant.id)?.quantity ?? 0)
    : 0;
  const remaining = selectedVariant ? Math.max(0, selectedVariant.stock - cartQty) : 0;

  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const maxPrice = Math.max(...product.variants.map((v) => v.price));
  const displayPrice = selectedVariant
    ? selectedVariant.price
    : minPrice === maxPrice
    ? minPrice
    : null;

  function handleAddToCart() {
    if (!selectedVariant) {
      toast.error("กรุณาเลือกสีและไซส์");
      return;
    }
    if (qty > remaining) {
      toast.error(remaining === 0 ? "สินค้าหมดแล้ว" : `คงเหลือเพียง ${remaining} ตัว`);
      return;
    }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productNameTh: product.nameTh,
      slug: product.slug,
      color: selectedVariant.color,
      size: selectedVariant.size,
      sku: selectedVariant.sku,
      imageUrl: product.imageUrl,
      unitPrice: selectedVariant.price,
      quantity: qty,
      stock: selectedVariant.stock,
    });
    toast.success(`เพิ่ม "${product.nameTh}" ลงตะกร้าแล้ว 🛒`);
  }

  return (
    <div className="space-y-4">
      {/* Price */}
      <div className="text-2xl font-bold text-primary">
        {displayPrice != null
          ? `฿${displayPrice.toLocaleString()}`
          : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
      </div>

      {/* Color Selection */}
      <div>
        <p className="text-sm font-medium mb-2">
          สี: {selectedColor && <span className="text-muted-foreground">{selectedColor}</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const variant = product.variants.find((v) => v.color === color);
            return (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedSize(null);
                }}
                className={`px-3 py-1.5 text-sm rounded-md border-2 transition-all ${
                  selectedColor === color
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {variant?.colorHex && (
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1.5 border border-white shadow-sm"
                    style={{ backgroundColor: variant.colorHex }}
                  />
                )}
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      {selectedColor && (
        <div>
          <p className="text-sm font-medium mb-2">ไซส์:</p>
          <div className="flex flex-wrap gap-2">
            {["SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map((size) => {
              const variant = product.variants.find(
                (v) => v.color === selectedColor && v.size === size
              );
              const inStock = (variant?.stock ?? 0) > 0;
              return (
                <button
                  key={size}
                  onClick={() => inStock && setSelectedSize(size)}
                  disabled={!inStock}
                  className={`w-12 h-12 text-sm rounded-md border-2 transition-all ${
                    selectedSize === size
                      ? "border-primary bg-primary/5 font-semibold"
                      : inStock
                      ? "border-border hover:border-primary/50"
                      : "border-border opacity-40 cursor-not-allowed line-through"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock indicator */}
      {selectedVariant && (
        <p className="text-sm text-muted-foreground">
          🏷 SKU: <code className="text-xs">{selectedVariant.sku}</code>{" "}
          {remaining > 0 ? (
            <Badge variant="outline" className="text-green-600 border-green-300">
              คงเหลือ {remaining} ตัว
            </Badge>
          ) : (
            <Badge variant="destructive">{selectedVariant.stock === 0 ? "หมด" : "เพิ่มในตะกร้าครบแล้ว"}</Badge>
          )}
        </p>
      )}

      {/* Quantity + Add */}
      <div className="flex gap-3 pt-2">
        <div className="flex items-center border rounded-md">
          <button
            className="px-3 py-2 hover:bg-secondary transition-colors"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="px-4 text-sm font-medium">{qty}</span>
          <button
            className="px-3 py-2 hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setQty((q) => Math.min(remaining, q + 1))}
            disabled={!selectedVariant || qty >= remaining}
          >
            +
          </button>
        </div>

        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0 || remaining === 0}
        >
          {remaining === 0 && selectedVariant ? "สินค้าหมด" : "🛒 เพิ่มลงตะกร้า"}
        </Button>
      </div>
    </div>
  );
}
