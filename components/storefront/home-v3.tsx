"use client";

import { useState, useEffect } from "react";
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
import { useStorefrontV3Safe } from "./storefront-shell";
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
  // Try getting shared V3 Shell context
  const shellCtx = useStorefrontV3Safe();

  // Local state fallback if rendered without StorefrontShell
  const [localTheme, setLocalTheme] = useState<"dark" | "light">("dark");
  const [localLang, setLocalLang] = useState<"th" | "en">("th");
  const [localIsSizeGuideOpen, setLocalIsSizeGuideOpen] = useState(false);

  // Local theme sync if standalone
  useEffect(() => {
    if (shellCtx) return;
    try {
      const stored = localStorage.getItem("highbury-theme");
      if (stored === "light" || stored === "dark") {
        setLocalTheme(stored);
      }
    } catch {}
  }, [shellCtx]);

  const theme = shellCtx ? shellCtx.theme : localTheme;
  const lang = shellCtx ? shellCtx.lang : localLang;
  const openSizeGuide = shellCtx
    ? shellCtx.openSizeGuide
    : () => setLocalIsSizeGuideOpen(true);
  const closeSizeGuide = shellCtx
    ? shellCtx.closeSizeGuide
    : () => setLocalIsSizeGuideOpen(false);

  // Modal states
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);

  // Map real products from each category
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

  const content = (
    <>
      {/* 1. Hero Section: Revolutionary Asian Fit Tailoring with 3-Spec Bar */}
      <HeroV3
        onOpenSizeGuide={openSizeGuide}
        lang={lang}
        theme={theme}
      />

      {/* 2. Section 2: A New Era of Everyday Tailoring (Split Architectural Light) */}
      <CraftStory lang={lang} />

      {/* 3. Section 3: Models Carousel with Real Products from Each Category & Photos */}
      <CarouselShowcase
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
        lang={lang}
      />

      {/* 4. Section 4: Technology & Intelligence in Every Stitch (Split Light Macro) */}
      <div className="v3-section-deferred">
        <MacroDetail lang={lang} />
      </div>

      {/* 5. Section 5: Standards Landscape with 3 Stats (Quantum Highway Equivalent) */}
      <div className="v3-section-deferred">
        <StandardsLandscape lang={lang} />
      </div>

      {/* 6. Section 6: Feel the Difference Pre-Footer (Sunset Golden Hour) */}
      <div className="v3-section-deferred">
        <PreFooterCta
          onOpenSizeGuide={openSizeGuide}
          lang={lang}
        />
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeGuide={openSizeGuide}
        theme={theme}
      />
    </>
  );

  // If inside StorefrontShell, return content directly (Shell provides Header, Footer, and Size Modal)
  if (shellCtx) {
    return content;
  }

  // Standalone fallback
  return (
    <div
      data-theme={theme}
      className={`v3-page-wrapper flex flex-col w-full antialiased transition-colors duration-200 ${
        theme === "light"
          ? "bg-[#FFFFFF] text-[#0F172A] selection:bg-[#2563EB] selection:text-white"
          : "bg-[#07080B] text-white selection:bg-white selection:text-black"
      }`}
    >
      <HeaderV3
        onOpenSizeGuide={openSizeGuide}
        lang={lang}
        onToggleLang={() => setLocalLang((prev) => (prev === "th" ? "en" : "th"))}
        theme={theme}
        onToggleTheme={() =>
          setLocalTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
      />
      <main className="flex-1 w-full">{content}</main>
      <V3Footer />
      <SmartSizeGuideModal
        isOpen={localIsSizeGuideOpen}
        onClose={closeSizeGuide}
        theme={theme}
      />
    </div>
  );
}
