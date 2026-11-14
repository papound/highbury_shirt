"use client";

import { useState } from "react";
import Link from "next/link";
import { Prisma } from "@prisma/client";

import AnnouncementBar from "./v3/announcement-bar";
import HeaderV3 from "./v3/header-v3";
import HeroV3 from "./v3/hero-v3";
import CraftStory from "./v3/craft-story";
import CarouselShowcase from "./v3/carousel-showcase";
import MacroDetail from "./v3/macro-detail";
import TrustGuarantee from "./v3/trust-guarantee";
import PreFooterCta from "./v3/pre-footer-cta";
import CorporateBanner from "./v3/corporate-banner";
import QuickViewModal, { QuickViewProduct } from "./v3/quick-view-modal";
import SmartSizeGuideModal from "./v3/smart-size-guide-modal";
import "./v3/v3.css";

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
    <div className="v3-page-wrapper flex flex-col w-full bg-[#FFFFFF] text-[#0F172B] antialiased selection:bg-[#163666]/10 selection:text-[#163666]">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Header */}
      <HeaderV3 onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

      {/* 3. Hero Section: Real product photo & Asian fit tailoring */}
      <HeroV3 onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

      {/* 4. Craftsmanship Story: Editorial Split with real factory specs */}
      <CraftStory />

      {/* 5. Curated Collection Carousel: Clean cards with 1px border */}
      <CarouselShowcase
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 6. Macro Detail & Fabric Weave: Real fabric information */}
      <div className="v3-section-deferred">
        <MacroDetail />
      </div>

      {/* 7. Quick Category Browse Bar */}
      {categories.length > 0 && (
        <section className="w-full py-8 bg-[#F9FAFB] border-b border-[#E7E5E4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-semibold text-[#79716B] uppercase tracking-wider">
                หมวดหมู่สินค้า
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
                <Link
                  href="/products?category=mens-shirts"
                  className="px-4 py-2 rounded-lg border border-[#E7E5E4] bg-white hover:border-[#163666] hover:text-[#163666] text-xs font-medium text-[#0F172B] transition-colors"
                >
                  เสื้อเชิ้ตผู้ชาย
                </Link>
                <Link
                  href="/products?category=womens-shirts"
                  className="px-4 py-2 rounded-lg border border-[#E7E5E4] bg-white hover:border-[#163666] hover:text-[#163666] text-xs font-medium text-[#0F172B] transition-colors"
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
                      className="px-4 py-2 rounded-lg border border-[#E7E5E4] bg-white hover:border-[#163666] hover:text-[#163666] text-xs font-medium text-[#0F172B] transition-colors"
                    >
                      {cat.nameTh}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Trust & Guarantee Section */}
      <div className="v3-section-deferred">
        <TrustGuarantee />
      </div>

      {/* 9. Corporate Uniform & OEM Service Banner */}
      <div className="v3-section-deferred">
        <CorporateBanner />
      </div>

      {/* 10. Pre-Footer Direct CTA */}
      <div className="v3-section-deferred">
        <PreFooterCta onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />
      </div>

      {/* Modals: Accessible dialogs */}
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
