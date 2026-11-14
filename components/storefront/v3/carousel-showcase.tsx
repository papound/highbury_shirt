"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Eye, ArrowRight } from "lucide-react";
import { getProductPlaceholderImage } from "@/lib/placeholders";
import { QuickViewProduct } from "./quick-view-modal";

interface CarouselShowcaseProps {
  products: QuickViewProduct[];
  onQuickView: (product: QuickViewProduct) => void;
}

export default function CarouselShowcase({
  products,
  onQuickView,
}: CarouselShowcaseProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!products || products.length === 0) return null;

  return (
    <section id="collection" className="w-full py-24 lg:py-32 bg-[#0A0B0E] text-[#F8FAFC] relative overflow-hidden border-b border-white/[0.08]">
      {/* Background cinematic dusk gradient matching Quantum */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(46, 144, 250, 0.25) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 45%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header & Carousel Controls (Quantum style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
              COLLECTION
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.05]">
              Designed for
              <br />
              <span className="italic font-light text-white/90">Every Silhouette</span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <p className="hidden lg:block text-xs sm:text-sm text-white/60 max-w-xs leading-relaxed font-sans">
              เลือกสรรเสื้อเชิ้ตรุ่นซิกเนเจอร์ที่พร้อมตอบโจทย์การแต่งกายในทุกช่วงเวลา
            </p>

            {/* Circular Prev/Next Controls (Matching Quantum) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={scrollPrev}
                className="v3-arrow-btn"
                aria-label="ย้อนกลับ"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="v3-arrow-btn"
                aria-label="ถัดไป"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Embla Carousel Viewport */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {products.map((product) => {
              const primaryImg =
                product.images[0]?.url || getProductPlaceholderImage(product.slug);
              const prices = product.variants.map((v) => v.price);
              const minPrice = prices.length ? Math.min(...prices) : product.basePrice;
              const maxPrice = prices.length ? Math.max(...prices) : product.basePrice;

              return (
                <div key={product.id} className="embla__slide">
                  <div className="group relative flex flex-col h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md overflow-hidden hover:border-white/25 transition-all duration-300">
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] bg-black/40 overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={product.nameTh}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Floating Category Pill */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white/90 tracking-wider uppercase">
                          {product.category.nameTh}
                        </span>
                      </div>

                      {/* Quick View Button Hover Overlay */}
                      <div className="absolute inset-x-4 bottom-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => onQuickView(product)}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white text-[#0A0B0E] font-bold text-xs shadow-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>ดูข้อมูลด่วน</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Content & Mini-Specs Bar (Matching Quantum) */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <div>
                        <h3 className="font-display text-2xl font-normal text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
                          {product.nameTh}
                        </h3>
                        <p className="text-xs text-white/50 line-clamp-1 mt-1 font-sans">
                          Pure. Tailored. Everyday Comfort.
                        </p>
                      </div>

                      {/* 3 Mini Specs in font-mono (Matching Quantum) */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.08] text-center font-mono">
                        <div>
                          <div className="text-xs font-semibold text-white">Regular</div>
                          <div className="text-[9px] text-white/40 tracking-wider uppercase mt-0.5">FIT</div>
                        </div>
                        <div className="border-x border-white/[0.08]">
                          <div className="text-xs font-semibold text-white">Easy-Care</div>
                          <div className="text-[9px] text-white/40 tracking-wider uppercase mt-0.5">FABRIC</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">S – 4XL</div>
                          <div className="text-[9px] text-white/40 tracking-wider uppercase mt-0.5">SIZES</div>
                        </div>
                      </div>

                      {/* Bottom Price & Link */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="font-mono text-lg font-bold text-white">
                          {minPrice === maxPrice
                            ? `฿${minPrice.toLocaleString()}`
                            : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
                        </div>

                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors group/link"
                        >
                          <span>Explore Model</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All Collection Link */}
        <div className="mt-14 text-center">
          <Link href="/products" className="v3-btn-glass">
            <span>ดูเสื้อเชิ้ตทั้งหมด ({products.length} รายการ)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
