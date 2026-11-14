"use client";

import { useState } from "react";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Sparkles } from "lucide-react";

import AnnouncementBar from "./v3/announcement-bar";
import HeroV3 from "./v3/hero-v3";
import CraftStory from "./v3/craft-story";
import CarouselShowcase from "./v3/carousel-showcase";
import MacroDetail from "./v3/macro-detail";
import PromiseLandscape from "./v3/promise-landscape";
import PreFooterCta from "./v3/pre-footer-cta";
import CorporateBanner from "./v3/corporate-banner";
import QuickViewModal, { QuickViewProduct } from "./v3/quick-view-modal";
import SmartSizeGuideModal from "./v3/smart-size-guide-modal";

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
    <div className="flex flex-col w-full bg-[#071322] text-foreground antialiased selection:bg-blue-600/20">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Hero Section: Cinematic Full-Bleed with 3-Spec Bar */}
      <HeroV3 onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

      {/* 3. Craftsmanship Story: Editorial Split (White Background) */}
      <CraftStory />

      {/* 4. Curated Collection Carousel: Dark Dusk Embla Carousel */}
      <CarouselShowcase
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 5. Macro Detail & Fabric Weave: Split Section (White Background) */}
      <div className="v3-section-deferred">
        <MacroDetail />
      </div>

      {/* 6. Quick Category Browse Bar */}
      {categories.length > 0 && (
        <section className="w-full py-10 bg-slate-100 dark:bg-slate-900 border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>ค้นหาตามหมวดหมู่:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                <Link
                  href="/products?category=mens-shirts"
                  className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-semibold text-slate-900 dark:text-white transition-colors"
                >
                  เสื้อเชิ้ตผู้ชาย
                </Link>
                <Link
                  href="/products?category=womens-shirts"
                  className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-semibold text-slate-900 dark:text-white transition-colors"
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
                      className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-semibold text-slate-900 dark:text-white transition-colors"
                    >
                      {cat.nameTh}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Quality & Promise Landscape Banner (Dark Cinematic) */}
      <div className="v3-section-deferred">
        <PromiseLandscape />
      </div>

      {/* 8. Pre-Footer Dramatic CTA ('Feel the Difference') */}
      <div className="v3-section-deferred">
        <PreFooterCta onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />
      </div>

      {/* 9. Corporate Uniform & OEM Service Banner */}
      <div className="v3-section-deferred">
        <CorporateBanner />
      </div>

      {/* Modals: Native HTML5 <dialog> */}
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
