"use client";

import { useState, useEffect, useRef } from "react";
import { Prisma } from "@prisma/client";

import HeaderV3 from "./v3/header-v3";
import ParallaxHeroCraft from "./v3/parallax-hero-craft";
import CarouselShowcase from "./v3/carousel-showcase";
import ParallaxCraftStandards from "./v3/parallax-craft-standards";
import V3Footer from "./v3/v3-footer";
import QuickViewModal, { QuickViewProduct } from "./v3/quick-view-modal";
import SmartSizeGuideModal from "./v3/smart-size-guide-modal";
import { useStorefrontV3Safe } from "./storefront-shell";
import "./v3/v3.css";

// ---------- types ----------
type FeaturedProduct = Omit<
  Prisma.ProductGetPayload<{
    include: {
      images: true;
      variants: true;
      category: true;
    };
  }>,
  "variants"
> & {
  variants: (Prisma.ProductVariantGetPayload<Record<string, never>> & {
    stock?: number;
  })[];
};

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

  // Global Top 2px Page Scroll Progress Bar (inspired by parallax-landing-page skill)
  const pageProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePageProgress = () => {
      if (!pageProgressRef.current) return;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        docHeight > 0
          ? Math.max(0, Math.min(1, window.scrollY / docHeight))
          : 0;
      pageProgressRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };

    updatePageProgress();
    window.addEventListener("scroll", updatePageProgress, { passive: true });
    window.addEventListener("resize", updatePageProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", updatePageProgress);
      window.removeEventListener("resize", updatePageProgress);
    };
  }, []);

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
  const [quickViewProduct, setQuickViewProduct] =
    useState<QuickViewProduct | null>(null);

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
      stock: v.stock,
    })),
  }));

  const content = (
    <>
      {/* Global 2px Top Scroll Progress Bar (from parallax-landing-page skill) */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none"
      >
        <div
          ref={pageProgressRef}
          className={`h-full w-full origin-left will-change-transform ${
            theme === "light" ? "bg-[#163666]" : "bg-white/90"
          }`}
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* ACT I (Pinned 100vh Stage): HeroV3 + CraftStory (01 / 02 -> 02 / 02) */}
      <ParallaxHeroCraft
        onOpenSizeGuide={openSizeGuide}
        lang={lang}
        theme={theme}
      />

      {/* ACT II (Architectural Curtain Card): Interactive Product Collection Carousel */}
      <CarouselShowcase
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
        lang={lang}
      />

      {/* ACT III (Pinned 100vh Stage): MacroDetail + StandardsLandscape + PreFooterCta (01 / 03 -> 03 / 03) */}
      <ParallaxCraftStandards
        onOpenSizeGuide={openSizeGuide}
        lang={lang}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeGuide={openSizeGuide}
        theme={theme}
        lang={lang}
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
        lang={lang}
      />
    </div>
  );
}
