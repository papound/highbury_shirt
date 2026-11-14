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
  // Theme State: 'dark' (Quantum standard) or 'light' (Clean architectural tailoring)
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Language State: Defaults to 'th' with smooth 'en' toggle
  const [lang, setLang] = useState<"th" | "en">("th");

  // Modal states
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);

  // Initialize theme from URL query param (?theme=light) or localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme");
      if (urlTheme === "light" || urlTheme === "dark") {
        setTheme(urlTheme);
        localStorage.setItem("highbury-theme", urlTheme);
        return;
      }

      const stored = localStorage.getItem("highbury-theme");
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      }
    } catch {}
  }, []);

  // Sync color-scheme meta tag with theme for browser native UI adaptation
  useEffect(() => {
    try {
      let meta = document.querySelector('meta[name="color-scheme"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "color-scheme");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", theme === "light" ? "light" : "dark");
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("highbury-theme", next);
      } catch {}
      return next;
    });
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "th" ? "en" : "th"));
  };

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

  return (
    <div
      data-theme={theme}
      className={`v3-page-wrapper flex flex-col w-full antialiased transition-colors duration-200 ${
        theme === "light"
          ? "bg-[#FFFFFF] text-[#0F172A] selection:bg-[#2563EB] selection:text-white"
          : "bg-[#07080B] text-white selection:bg-white selection:text-black"
      }`}
    >
      {/* 1. Quantum Floating Glass Header (With Language Switcher & Dark/Light Switcher) */}
      <HeaderV3
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        lang={lang}
        onToggleLang={toggleLang}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Hero Section: Revolutionary Asian Fit Tailoring with 3-Spec Bar */}
      <HeroV3
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        lang={lang}
        theme={theme}
      />

      {/* 3. Section 2: A New Era of Everyday Tailoring (Split Architectural Light) */}
      <CraftStory lang={lang} />

      {/* 4. Section 3: Models Carousel with Real Products from Each Category & Photos */}
      <CarouselShowcase
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
        lang={lang}
      />

      {/* 5. Section 4: Technology & Intelligence in Every Stitch (Split Light Macro) */}
      <div className="v3-section-deferred">
        <MacroDetail lang={lang} />
      </div>

      {/* 6. Section 5: Standards Landscape with 3 Stats (Quantum Highway Equivalent) */}
      <div className="v3-section-deferred">
        <StandardsLandscape lang={lang} />
      </div>

      {/* 7. Section 6: Feel the Difference Pre-Footer (Sunset Golden Hour) */}
      <div className="v3-section-deferred">
        <PreFooterCta
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          lang={lang}
        />
      </div>

      {/* 8. Section 7: Quantum Deep Dark / Light Tailoring Footer */}
      <V3Footer />

      {/* Modals: Accessible Native <dialog> */}
      <SmartSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        theme={theme}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        theme={theme}
      />
    </div>
  );
}
