"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { QuickViewProduct } from "./quick-view-modal";
import { getProductPlaceholderImage, CATEGORY_REAL_IMAGES } from "@/lib/placeholders";

interface CarouselShowcaseProps {
  products: QuickViewProduct[];
  onQuickView: (product: QuickViewProduct) => void;
  lang?: "th" | "en";
}

// Category English Mapping
const CAT_EN_MAP: Record<string, string> = {
  "เสื้อเชิ้ตผู้ชายแขนยาว": "Men's Long Sleeve Shirt",
  "เสื้อเชิ้ตผู้หญิงแขนยาว": "Women's Long Sleeve Shirt",
  "เสื้อเชิ้ตผู้ชายแขนสั้น": "Men's Short Sleeve Shirt",
  "เสื้อเชิ้ตผู้หญิงแขนสั้น": "Women's Short Sleeve Shirt",
  "เสื้อเชิ้ตผู้หญิงแขนสามส่วน": "Women's 3/4 Sleeve Shirt",
  "เสื้อโปโล": "Polo Shirt",
};

export default function CarouselShowcase({
  products,
  onQuickView,
  lang = "th",
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

  // Fallback real category models with authentic high-res photos
  const fallbackProducts: QuickViewProduct[] = [
    {
      id: "demo-men-ls",
      name: "Men's Long Sleeve Shirt",
      nameTh: "เสื้อเชิ้ตผู้ชายแขนยาว ทรงเข้ารูป",
      slug: "141002",
      descTh: "คัตติ้งพอดีตัว เนื้อผ้าระบายอากาศ รีดง่าย ทรงสวยตลอดวัน",
      basePrice: 595,
      category: { nameTh: "เสื้อเชิ้ตผู้ชายแขนยาว", slug: "mens-long-sleeve" },
      images: [{ url: CATEGORY_REAL_IMAGES["mens-ls"], altText: "Men's Long Sleeve Shirt" }],
      variants: [],
    },
    {
      id: "demo-women-ls",
      name: "Women's Long Sleeve Shirt",
      nameTh: "เสื้อเชิ้ตผู้หญิงแขนยาว ทรงสุภาพ",
      slug: "131015",
      descTh: "แพทเทิร์นเว้าเอวเล็กน้อย สุภาพ เสริมบุคลิกภาพสำหรับทุกการประชุม",
      basePrice: 495,
      category: { nameTh: "เสื้อเชิ้ตผู้หญิงแขนยาว", slug: "womens-long-sleeve" },
      images: [{ url: CATEGORY_REAL_IMAGES["womens-ls"], altText: "Women's Long Sleeve Shirt" }],
      variants: [],
    },
    {
      id: "demo-men-ss",
      name: "Men's Short Sleeve Shirt",
      nameTh: "เสื้อเชิ้ตผู้ชายแขนสั้น ทรงสมาร์ท",
      slug: "241001",
      descTh: "คล่องตัวในวันทำงานที่แอคทีฟ ระบายอากาศได้ดี ไม่อึดอัด",
      basePrice: 595,
      category: { nameTh: "เสื้อเชิ้ตผู้ชายแขนสั้น", slug: "mens-short-sleeve" },
      images: [{ url: CATEGORY_REAL_IMAGES["mens-ss"], altText: "Men's Short Sleeve Shirt" }],
      variants: [],
    },
    {
      id: "demo-women-ss",
      name: "Women's Short Sleeve Shirt",
      nameTh: "เสื้อเชิ้ตผู้หญิงแขนสั้น ลุคสมาร์ทแคชชวล",
      slug: "231056",
      descTh: "ใส่สบาย คัตติ้งเนี้ยบ ดูดีได้ทั้งในและนอกออฟฟิศ",
      basePrice: 495,
      category: { nameTh: "เสื้อเชิ้ตผู้หญิงแขนสั้น", slug: "womens-short-sleeve" },
      images: [{ url: CATEGORY_REAL_IMAGES["womens-ss"], altText: "Women's Short Sleeve Shirt" }],
      variants: [],
    },
    {
      id: "demo-women-34",
      name: "Women's 3/4 Sleeve Shirt",
      nameTh: "เสื้อเชิ้ตผู้หญิงแขนสามส่วน ทรงภูมิฐาน",
      slug: "331022ST",
      descTh: "ความยาวแขนสามส่วนยอดนิยม พอดีกับสรีระผู้หญิงเอเชีย",
      basePrice: 495,
      category: { nameTh: "เสื้อเชิ้ตผู้หญิงแขนสามส่วน", slug: "womens-three-quarter" },
      images: [{ url: CATEGORY_REAL_IMAGES["womens-34"], altText: "Women's 3/4 Sleeve Shirt" }],
      variants: [],
    },
    {
      id: "demo-polo",
      name: "Highbury Premium Polo",
      nameTh: "เสื้อโปโลเนื้อนุ่มพรีเมียม",
      slug: "P234101",
      descTh: "เส้นใยทอพิเศษ คืนรูปไว นุ่มสบาย เหมาะสำหรับวันสบายและชุดยูนิฟอร์ม",
      basePrice: 495,
      category: { nameTh: "เสื้อโปโล", slug: "polo-shirts" },
      images: [{ url: CATEGORY_REAL_IMAGES["polo"], altText: "Premium Polo Shirt" }],
      variants: [],
    },
  ];

  const displayProducts = products.length > 0 ? products : fallbackProducts;

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
        {/* Top Header Row (Quantum Style with Bilingual TH / ENG) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
              MODELS · หมวดหมู่สินค้าจริง
            </div>
            <h2 className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-white leading-[1.1]">
              {lang === "th" ? (
                <>
                  ออกแบบเพื่อความมั่นใจ
                  <br />
                  <span className="text-white/90">ในทุกวันทำงาน</span>
                </>
              ) : (
                <>
                  Designed for a
                  <br />
                  <span className="text-white/90">Brighter Tomorrow</span>
                </>
              )}
            </h2>
            <p className="text-xs text-white/40 tracking-wider uppercase font-medium">
              {lang === "th" ? "Designed for a Sharper Tomorrow" : "คัดสรรสินค้าจริงครบทุกหมวดหมู่"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:max-w-md">
            <p className="text-sm text-white/60 leading-relaxed">
              {lang === "th"
                ? "เลือกชมสินค้าจริงในแต่ละหมวดหมู่ ตัดเย็บอย่างประณีตด้วยแพทเทิร์นที่คำนวณมาเพื่อสรีระคนไทยโดยเฉพาะ"
                : "Discover our real collection across every shirt category, engineered for Asian posture with effortless easy-care comfort."}
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
              // Get real photo from product or category image mapping (never vintage hanger sketch)
              const primaryImg =
                p.images[0]?.url && !p.images[0].url.includes("placeholders")
                  ? p.images[0].url
                  : getProductPlaceholderImage(p.slug, p.category.nameTh);

              const catEn = CAT_EN_MAP[p.category.nameTh] || p.category.nameTh;

              const prices = p.variants?.map((v) => v.price) || [];
              const priceStr = prices.length
                ? `฿${Math.min(...prices).toLocaleString()}`
                : `฿${p.basePrice.toLocaleString()}`;

              return (
                <div key={p.id} className="embla__slide">
                  <div className="group flex flex-col h-full rounded-2xl bg-[#0E1015] border border-white/10 hover:border-white/25 transition-all duration-300 overflow-hidden">
                    {/* Model Photo Container with Real High-Res Photography */}
                    <div className="relative aspect-[16/11] bg-[#14171F] overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={p.nameTh || p.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Floating Category Badge */}
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white/90 border border-white/10">
                          {p.category.nameTh}
                        </span>
                      </div>
                    </div>

                    {/* Model Details (Quantum Style: Title, Sub, 3-Spec Bar, Explore Link) */}
                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-6">
                      <div>
                        <div className="text-[11px] font-semibold text-white/50 tracking-wider uppercase mb-1">
                          {catEn}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-1">
                          {p.nameTh || p.name}
                        </h3>
                        <p className="text-xs text-white/50 mt-1 line-clamp-1">
                          {p.descTh || "Asian Fit Tailoring · Easy-Care Fabric"}
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
                            XS - 4XL
                          </div>
                          <div className="text-[10px] text-white/40 tracking-[0.1em] uppercase mt-0.5">
                            SIZES
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
                          <span>{lang === "th" ? "ดูข้อมูลสินค้า" : "Explore Model"}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => onQuickView(p)}
                          className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                          {lang === "th" ? "ข้อมูลด่วน" : "Quick View"}
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
