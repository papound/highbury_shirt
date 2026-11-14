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
    <section id="collection" className="w-full py-16 sm:py-20 bg-[#F9FAFB] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E7E5E4]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172B] tracking-tight">
              สินค้าแนะนำ
            </h2>
            <p className="text-sm text-[#79716B] mt-1">
              เสื้อเชิ้ตคุณภาพสูงหลากหลายรุ่นที่เป็นเอกลักษณ์ของ Highbury
            </p>
          </div>

          {/* Clean Carousel Controls (No frosted glass) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              className="w-9 h-9 rounded-lg border border-[#E7E5E4] bg-white hover:bg-[#F9FAFB] text-[#0F172B] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="ย้อนกลับ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="w-9 h-9 rounded-lg border border-[#E7E5E4] bg-white hover:bg-[#F9FAFB] text-[#0F172B] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="ถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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
                  <div className="group flex flex-col h-full rounded-xl border border-[#E7E5E4] bg-white overflow-hidden transition-all">
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] bg-[#F1F5F9] overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={product.nameTh}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      />

                      {/* Clean Quick View Button Overlay */}
                      <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => onQuickView(product)}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white border border-[#E7E5E4] text-[#0F172B] font-semibold text-xs shadow-xs hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#163666]" />
                          <span>ดูรายละเอียดด่วน</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Content (Solid, clean typography, no middle dots) */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-xs text-[#79716B] mb-1 font-medium">
                          {product.category.nameTh}
                        </div>
                        <h3 className="font-bold text-base text-[#0F172B] line-clamp-2 leading-snug group-hover:text-[#163666] transition-colors">
                          {product.nameTh}
                        </h3>
                      </div>

                      <div className="pt-3 border-t border-[#E7E5E4] flex items-center justify-between">
                        <div className="font-bold text-base text-[#163666]">
                          {minPrice === maxPrice
                            ? `฿${minPrice.toLocaleString()}`
                            : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
                        </div>

                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#163666] hover:text-[#0A2B5E] transition-colors"
                        >
                          <span>สั่งซื้อ</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#E7E5E4] bg-white hover:bg-[#F9FAFB] text-[#163666] font-semibold text-sm transition-colors"
          >
            <span>ดูสินค้าทั้งหมดในแคตตาล็อก ({products.length} รายการ)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
