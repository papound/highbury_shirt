"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ArrowUpRight } from "lucide-react";
import { getProductPlaceholderImage } from "@/lib/placeholders";
import { QuickViewProduct } from "./quick-view-modal";

interface ProductCardV3Props {
  product: QuickViewProduct;
  onQuickView: (product: QuickViewProduct) => void;
}

export default function ProductCardV3({
  product,
  onQuickView,
}: ProductCardV3Props) {
  const primaryImg =
    product.images[0]?.url || getProductPlaceholderImage(product.slug);

  const prices = product.variants.map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : product.basePrice;
  const maxPrice = prices.length ? Math.max(...prices) : product.basePrice;

  // Filter out SS
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)))
    .filter((s) => s !== "SS")
    .slice(0, 5);

  return (
    <div className="v3-card-container group relative flex flex-col h-full rounded-2xl border border-border/80 bg-card overflow-hidden hover:border-blue-500/40 hover:shadow-lg transition-[border-color,box-shadow] duration-200">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] bg-muted/40 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={primaryImg}
            alt={product.images[0]?.altText ?? product.nameTh}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
          />
        </Link>

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-background/90 dark:bg-slate-900/90 backdrop-blur-xs text-[11px] font-semibold text-foreground border border-border/80 shadow-xs">
            {product.category.nameTh}
          </span>
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-background/95 dark:bg-slate-900/95 backdrop-blur-xs text-foreground font-semibold text-xs border border-border/80 shadow-md hover:bg-muted transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>ดูข้อมูลด่วน (Quick View)</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="group/title block focus-visible:outline-none"
          >
            <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-2 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">
              {product.nameTh}
            </h3>
          </Link>

          {/* Sizes available */}
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {sizes.map((s) => (
                <span
                  key={s}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/60"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Direct Link */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <div className="font-extrabold text-base text-[#0A2540] dark:text-blue-400">
            {minPrice === maxPrice
              ? `฿${minPrice.toLocaleString()}`
              : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>สั่งซื้อ</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
