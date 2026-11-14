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
    <section className="w-full py-20 lg:py-28 bg-[#071322] text-white relative overflow-hidden border-b border-white/10">
      {/* Background cinematic dusk gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(217, 119, 6, 0.15) 0%, transparent 40%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header & Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              FEATURED COLLECTION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              เสื้อเชิ้ตคัดสรร
              <br />
              เพื่อทุกสรีระและโอกาส
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <p className="hidden lg:block text-xs sm:text-sm text-white/70 max-w-xs leading-relaxed">
              สัมผัสความประณีตของเสื้อเชิ้ตคอลเลกชันยอดนิยม สวมใส่สบาย เข้ารูปพอดี
            </p>

            {/* Circular Prev/Next Controls (Matching Quantum) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={scrollPrev}
                className="w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors duration-200 cursor-pointer"
                aria-label="ย้อนกลับ"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors duration-200 cursor-pointer"
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
                  <div className="group relative flex flex-col h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/30 transition-all duration-300">
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] bg-black/30 overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={product.nameTh}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Quick View Button Hover Overlay */}
                      <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => onQuickView(product)}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white text-[#071322] font-semibold text-xs shadow-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ดูข้อมูลด่วน</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Content & Mini-Specs Bar */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">
                          {product.category.nameTh}
                        </div>
                        <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
                          {product.nameTh}
                        </h3>
                        <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
                          คัตติ้งเนี้ยบ เนื้อผ้าใส่สบายตลอดวัน
                        </p>
                      </div>

                      {/* 3 Mini Specs (Matching Quantum style) */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center">
                        <div>
                          <div className="text-xs font-bold text-white">Regular</div>
                          <div className="text-[10px] text-white/50">ทรงเสื้อ</div>
                        </div>
                        <div className="border-x border-white/10">
                          <div className="text-xs font-bold text-white">Easy Care</div>
                          <div className="text-[10px] text-white/50">เนื้อผ้า</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">S – 4XL</div>
                          <div className="text-[10px] text-white/50">ไซส์</div>
                        </div>
                      </div>

                      {/* Bottom Price & Link */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="font-extrabold text-base text-white">
                          {minPrice === maxPrice
                            ? `฿${minPrice.toLocaleString()}`
                            : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
                        </div>

                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition-colors group/link"
                        >
                          <span>สั่งซื้อ</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
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
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-colors duration-200"
          >
            <span>ดูเสื้อเชิ้ตทั้งหมด ({products.length} รายการ)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
