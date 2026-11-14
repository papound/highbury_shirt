"use client";

import { useState } from "react";
import { Prisma } from "@prisma/client";

import HeaderV3 from "./v3/header-v3";
import HeroV3 from "./v3/hero-v3";
import CraftStory from "./v3/craft-story";
import CarouselShowcase from "./v3/carousel-showcase";
import MacroDetail from "./v3/macro-detail";
import StandardsLandscape from "./v3/standards-landscape";
import PreFooterCta from "./v3/pre-footer-cta";
import V3Footer from "./v3/v3-footer";
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

export default function HomeV3({ featuredProducts }: HomeV3Props) {
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
    <div className="v3-page-wrapper flex flex-col w-full bg-[#07080B] text-white antialiased selection:bg-white selection:text-black">
      {/* 1. Quantum Floating Glass Header */}
      <HeaderV3 onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

      {/* 2. Hero Section: Revolutionary Asian Fit Tailoring with 3-Spec Bar */}
      <HeroV3 onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

      {/* 3. Section 2: A New Era of Everyday Tailoring (Split Architectural Light) */}
      <CraftStory />

      {/* 4. Section 3: Models Carousel (Dark Horizon Embla Carousel) */}
      <CarouselShowcase
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 5. Section 4: Technology & Intelligence in Every Stitch (Split Light Macro) */}
      <div className="v3-section-deferred">
        <MacroDetail />
      </div>

      {/* 6. Section 5: Standards Landscape with 3 Stats (Quantum Highway Equivalent) */}
      <div className="v3-section-deferred">
        <StandardsLandscape />
      </div>

      {/* 7. Section 6: Feel the Difference Pre-Footer (Sunset Golden Hour) */}
      <div className="v3-section-deferred">
        <PreFooterCta onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />
      </div>

      {/* 8. Section 7: Quantum Deep Dark Footer */}
      <V3Footer />

      {/* Modals: Accessible Native <dialog> */}
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
