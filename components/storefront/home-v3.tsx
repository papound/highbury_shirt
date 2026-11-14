"use client";

import { useState } from "react";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ArrowRight, Sparkles } from "lucide-react";

import AnnouncementBar from "./v3/announcement-bar";
import HeroV3 from "./v3/hero-v3";
import ProductCardV3 from "./v3/product-card-v3";
import QuickViewModal, { QuickViewProduct } from "./v3/quick-view-modal";
import SmartSizeGuideModal from "./v3/smart-size-guide-modal";
import TrustGuarantee from "./v3/trust-guarantee";
import CorporateBanner from "./v3/corporate-banner";

// ---------- types ----------
type FeaturedProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    category: true;
  };
}>;

type Category = Prisma.CategoryGetPayload<Record<string, never>>;

interface HomeV3Props {
  featuredProducts: FeaturedProduct[];
  categories: Category[];
}

export default function HomeV3({ featuredProducts, categories }: HomeV3Props) {
  // Modal states
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);

  // Map featured products to QuickViewProduct format
  const products: QuickViewProduct[] = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    nameTh: p.nameTh,
    slug: p.slug,
    descTh: p.descTh,
    basePrice: p.basePrice,
    category: {
      nameTh: p.category.nameTh,
      slug: p.category.slug,
    },
    images: p.images.map((img) => ({
      url: img.url,
      altText: img.altText,
    })),
    variants: p.variants.map((v) => ({
      id: v.id,
      color: v.color,
      colorHex: v.colorHex,
      size: v.size,
      price: v.price,
    })),
  }));

  return (
    <div className="flex flex-col w-full bg-background text-foreground antialiased selection:bg-blue-600/15">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Hero Section (Above-the-fold guaranteed) */}
      <HeroV3 onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

      {/* 3. Curated Product Showcase */}
      {products.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-background border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-border/60">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Featured Collection
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-1 tracking-tight">
                  เสื้อเชิ้ตคอลเลกชันยอดนิยม
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  คัดสรรเพื่อความมั่นใจ ใส่สบาย ดูดีในทุกวันทำงาน
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors shrink-0"
              >
                <span>ดูสินค้าทั้งหมด ({products.length} รายการ)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Product Grid: CSS Grid with minmax(0, 1fr) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <ProductCardV3
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>

            {/* Bottom Section Action */}
            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0A2540] dark:bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-[#16385e] transition-[background-color,transform] duration-200 shadow-sm"
              >
                <span>เลือกชมเสื้อเชิ้ตทุกแบบ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. Category Overview Pills */}
      {categories.length > 0 && (
        <section className="w-full py-12 bg-slate-50 dark:bg-slate-900/30 border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>หมวดหมู่แนะนำ:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                <Link
                  href="/products?category=mens-shirts"
                  className="px-4 py-2 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                >
                  เสื้อเชิ้ตผู้ชาย
                </Link>
                <Link
                  href="/products?category=womens-shirts"
                  className="px-4 py-2 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                >
                  เสื้อเชิ้ตผู้หญิง
                </Link>
                {categories
                  .filter(
                    (c) =>
                      c.slug !== "mens-shirts" &&
                      c.slug !== "womens-shirts" &&
                      !c.slug.toLowerCase().includes("other")
                  )
                  .slice(0, 4)
                  .map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="px-4 py-2 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                    >
                      {cat.nameTh}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Trust Guarantee (Offscreen performance optimized) */}
      <div className="v3-section-deferred">
        <TrustGuarantee />
      </div>

      {/* 6. Corporate & OEM Service Banner */}
      <div className="v3-section-deferred">
        <CorporateBanner />
      </div>

      {/* 7. Native Dialog Modals */}
      <SmartSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />
    </div>
  );
}
