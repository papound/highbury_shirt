"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { QuickViewProduct } from "./quick-view-modal";
import { getProductPlaceholderImage } from "@/lib/placeholders";

interface CarouselShowcaseProps {
  products: QuickViewProduct[];
  onQuickView: (product: QuickViewProduct) => void;
}

export default function CarouselShowcase({
  products,
  onQuickView,
}: CarouselShowcaseProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Fallback demo models if db products are few
  const displayProducts = products.length > 0 ? products : [
    {
      id: "demo-1",
      name: "Highbury Signature Classic",
      nameTh: "Highbury Signature Classic",
      slug: "signature-classic",
      descTh: "Bold. Crisp. Easy-Care.",
      basePrice: 790,
      category: { nameTh: "Men's Shirts", slug: "mens-shirts" },
      images: [{ url: "/images/placeholders/men-ls.jpg", altText: "Signature Classic" }],
      variants: [],
    },
    {
      id: "demo-2",
      name: "Highbury Oxford Button-Down",
      nameTh: "Highbury Oxford Button-Down",
      slug: "oxford-button-down",
      descTh: "Elegance Meets Everyday Versatility.",
      basePrice: 890,
      category: { nameTh: "Men's Shirts", slug: "mens-shirts" },
      images: [{ url: "/images/placeholders/men-ss.jpg", altText: "Oxford Button-Down" }],
      variants: [],
    },
    {
      id: "demo-3",
      name: "Highbury Modern Slim Fit",
      nameTh: "Highbury Modern Slim Fit",
      slug: "modern-slim-fit",
      descTh: "Sculpted Silhouette for Every Day.",
      basePrice: 990,
      category: { nameTh: "Men's Shirts", slug: "mens-shirts" },
      images: [{ url: "/images/placeholders/women-ls.jpg", altText: "Modern Slim Fit" }],
      variants: [],
    },
  ];

  return (
    <section id="models" className="relative w-full py-28 sm:py-36 bg-[#07080B] text-white overflow-hidden border-t border-b border-white/10">
      {/* Subtle warm sunset atmospheric gradient matching Quantum sunset backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(46, 144, 250, 0.15) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Row (Quantum Style) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
              MODELS
            </div>
            <h2 className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-white leading-[1.1]">
              Designed for a
              <br />
              Brighter Tomorrow
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:max-w-md">
            <p className="text-sm text-white/60 leading-relaxed">
              Discover our range of tailored shirts, each crafted to deliver exceptional comfort,
              Asian fit geometry, and durable easy-care elegance.
            </p>
            {/* Circular Carousel Arrow Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={scrollPrev}
                className="v3-arrow-btn"
                aria-label="Previous shirt model"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="v3-arrow-btn"
                aria-label="Next shirt model"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Embla Carousel Container */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {displayProducts.map((p) => {
              const primaryImg =
                p.images[0]?.url || getProductPlaceholderImage(p.slug);
              const prices = p.variants?.map((v) => v.price) || [];
              const priceStr = prices.length
                ? `฿${Math.min(...prices).toLocaleString()}`
                : `฿${p.basePrice.toLocaleString()}`;

              return (
                <div key={p.id} className="embla__slide">
                  <div className="group flex flex-col h-full rounded-2xl bg-[#0E1015] border border-white/10 hover:border-white/25 transition-all duration-300 overflow-hidden">
                    {/* Model Photo Container */}
                    <div className="relative aspect-[16/11] bg-[#14171F] overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={p.nameTh || p.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Model Details (Quantum Style: Title, Sub, 3-Spec Bar, Explore Link) */}
                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-6">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                          {p.nameTh || p.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/50 mt-1">
                          {p.descTh || "Bold. Dynamic. Asian Fit."}
                        </p>
                      </div>

                      {/* 3-Spec Bar (Quantum Style) */}
                      <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-white/10">
                        <div>
                          <div className="font-mono text-sm sm:text-base font-semibold text-white">
                            100%
                          </div>
                          <div className="text-[10px] text-white/40 tracking-[0.1em] uppercase mt-0.5">
                            COTTON
                          </div>
                        </div>

                        <div className="border-l border-white/10 pl-3">
                          <div className="font-mono text-sm sm:text-base font-semibold text-white">
                            21 SPI
                          </div>
                          <div className="text-[10px] text-white/40 tracking-[0.1em] uppercase mt-0.5">
                            STITCH
                          </div>
                        </div>

                        <div className="border-l border-white/10 pl-3">
                          <div className="font-mono text-sm sm:text-base font-semibold text-white">
                            {priceStr}
                          </div>
                          <div className="text-[10px] text-white/40 tracking-[0.1em] uppercase mt-0.5">
                            STARTING
                          </div>
                        </div>
                      </div>

                      {/* Link & Quick View */}
                      <div className="flex items-center justify-between pt-1">
                        <Link
                          href={`/products/${p.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80 transition-colors"
                        >
                          <span>Explore Model</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => onQuickView(p)}
                          className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
