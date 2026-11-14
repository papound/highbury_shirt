"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { QuickViewProduct } from "./quick-view-modal";
import { getProductPlaceholderImage, CATEGORY_REAL_IMAGES } from "@/lib/placeholders";
import { useStorefrontV3Safe } from "../storefront-shell";

interface CarouselShowcaseProps {
  products: QuickViewProduct[];
  onQuickView: (product: QuickViewProduct) => void;
  lang?: "th" | "en";
}

const CAT_EN_MAP: Record<string, string> = {
  "เสื้อเชิ้ตผู้ชายแขนยาว": "Men's Long Sleeve",
  "เสื้อเชิ้ตผู้หญิงแขนยาว": "Women's Long Sleeve",
  "เสื้อเชิ้ตผู้ชายแขนสั้น": "Men's Short Sleeve",
  "เสื้อเชิ้ตผู้หญิงแขนสั้น": "Women's Short Sleeve",
  "เสื้อเชิ้ตผู้หญิงแขนสามส่วน": "Women's 3/4 Sleeve",
  "เสื้อโปโล": "Polo Shirt",
};

export default function CarouselShowcase({
  products,
  onQuickView,
  lang: propLang,
}: CarouselShowcaseProps) {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = propLang || v3?.lang || "th";
  const isLight = theme === "light";
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

  const fallbackProducts: QuickViewProduct[] = [
    {
      id: "demo-men-ls",
      name: "Men's Long Sleeve Shirt",
      nameTh: "141002 เสื้อเชิ้ตผู้ชายแขนยาวผ้าลายริ้ว",
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
      nameTh: "131015 เสื้อเชิ้ตผู้หญิงแขนยาวผ้าลายริ้ว",
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
      nameTh: "241001 เสื้อเชิ้ตผู้ชายแขนสั้นลายริ้ว",
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
      nameTh: "231056 เสื้อเชิ้ตผู้หญิงแขนสั้นลายริ้ว",
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
      nameTh: "331022ST เสื้อเชิ้ตผู้หญิงแขนสามส่วนลายริ้ว",
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
      nameTh: "P234101 เสื้อโปโลผู้หญิงแขนสั้น",
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
    <section id="models" className="relative w-full py-12 sm:py-16 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row: Exact Quantum Header with Category Tracker */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <div
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase ${
                isLight ? "text-[#64748B]" : "text-[#9496A1]"
              }`}
            >
              COLLECTION+
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? (
                <>
                  คอลเลกชันสินค้า
                  <br />
                  ตอบโจทย์ทุกสไตล์และสรีระ.
                </>
              ) : (
                <>
                  Curated Collection
                  <br />
                  For Every Fit & Style.
                </>
              )}
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? "text-[#475569]" : "text-[#9496A1]"
              }`}
            >
              {lang === "th"
                ? "เสื้อเชิ้ตสำเร็จรูปคัตติ้งเนี้ยบ ออกแบบสัดส่วนเฉพาะสำหรับคนไทย สวมใส่สบายในทุกโอกาส"
                : "Tailored ready-to-wear shirts sculpted for Asian proportions with effortless elegance."}
            </p>
          </div>

          {/* Carousel Arrow Controls (Quantum Circular Pills) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={scrollPrev}
              className={`p-3 rounded-full border transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isLight
                  ? "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F1F5F9] shadow-xs"
                  : "border-white/20 bg-white/5 text-white hover:bg-white/10"
              }`}
              aria-label="Previous shirt model"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className={`p-3 rounded-full border transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isLight
                  ? "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F1F5F9] shadow-xs"
                  : "border-white/20 bg-white/5 text-white hover:bg-white/10"
              }`}
              aria-label="Next shirt model"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embla Carousel Container */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {displayProducts.map((p) => {
              const primaryImg =
                p.images[0]?.url && !p.images[0].url.includes("unsplash")
                  ? p.images[0].url
                  : getProductPlaceholderImage(p.slug, p.category.nameTh);

              const catEn = CAT_EN_MAP[p.category.nameTh] || p.category.nameTh;

              const prices = p.variants?.map((v) => v.price) || [];
              const priceStr = prices.length
                ? `฿${Math.min(...prices).toLocaleString()}`
                : `฿${p.basePrice.toLocaleString()}`;

              return (
                <div key={p.id} className="embla__slide">
                  {/* Card: 16px radius, rounded-2xl, border, elegant shadow */}
                  <div
                    className={`flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      isLight
                        ? "bg-gradient-to-b from-white via-white to-[#F8FAFC] border-[#E2E8F0] shadow-xs"
                        : "bg-gradient-to-b from-[#13161D] via-[#13161D] to-[#0A0C10] border-white/10 shadow-lg"
                    }`}
                  >
                    {/* Model Photo Container with Quantum Gradient Dissolve */}
                    <div className="relative aspect-[4/3] bg-[#0E1015] overflow-hidden">
                      <Image
                        src={primaryImg}
                        alt={p.nameTh || p.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top"
                      />

                      {/* Smooth Gradient Dissolve Layer (Matches Standards/Hero Dissolve) */}
                      <div
                        className={`absolute inset-x-0 bottom-0 h-28 pointer-events-none transition-colors duration-300 bg-gradient-to-t ${
                          isLight
                            ? "from-white via-white/90 via-35% to-transparent"
                            : "from-[#13161D] via-[#13161D]/90 via-35% to-transparent"
                        }`}
                      />

                      {/* Frosted Category Badge */}
                      <div className="absolute top-3 left-3 pointer-events-none z-10">
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "#FFFFFF",
                          }}
                        >
                          {lang === "th" ? p.category.nameTh : catEn}
                        </span>
                      </div>
                    </div>

                    {/* Model Details */}
                    <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                      <div>
                        <div
                          className={`text-[11px] font-semibold uppercase tracking-wider ${
                            isLight ? "text-[#64748B]" : "text-[#9496A1]"
                          }`}
                        >
                          {catEn}
                        </div>
                        <h3
                          className={`text-base font-semibold tracking-tight line-clamp-1 mt-0.5 ${
                            isLight ? "text-[#0F172A]" : "text-white"
                          }`}
                        >
                          {p.nameTh || p.name}
                        </h3>
                        <p
                          className={`text-xs mt-1 line-clamp-1 ${
                            isLight ? "text-[#64748B]" : "text-[#9496A1]"
                          }`}
                        >
                          {p.descTh || "แพทเทิร์นพอดีตัวสรีระคนไทย · ดูแลง่าย"}
                        </p>
                      </div>

                      {/* 3-Spec Bar with real sourced numbers */}
                      <div
                        className={`grid grid-cols-3 gap-2 py-3 border-t border-b text-center ${
                          isLight ? "border-[#E2E8F0]" : "border-[#262830]"
                        }`}
                      >
                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              isLight ? "text-[#0F172A]" : "text-white"
                            }`}
                          >
                            100%
                          </div>
                          <div
                            className={`text-[10px] uppercase ${
                              isLight ? "text-[#64748B]" : "text-[#9496A1]"
                            }`}
                          >
                            COTTON
                          </div>
                        </div>

                        <div className={`border-l ${isLight ? "border-[#E2E8F0]" : "border-[#262830]"}`}>
                          <div
                            className={`text-sm font-semibold ${
                              isLight ? "text-[#0F172A]" : "text-white"
                            }`}
                          >
                            S – 5XL
                          </div>
                          <div
                            className={`text-[10px] uppercase ${
                              isLight ? "text-[#64748B]" : "text-[#9496A1]"
                            }`}
                          >
                            SIZES
                          </div>
                        </div>

                        <div className={`border-l ${isLight ? "border-[#E2E8F0]" : "border-[#262830]"}`}>
                          <div
                            className={`text-sm font-semibold ${
                              isLight ? "text-[#B45309]" : "text-[#FFB900]"
                            }`}
                          >
                            {priceStr}
                          </div>
                          <div
                            className={`text-[10px] uppercase ${
                              isLight ? "text-[#64748B]" : "text-[#9496A1]"
                            }`}
                          >
                            STARTING
                          </div>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="flex items-center justify-between pt-1">
                        <Link
                          href={`/products/${p.slug}`}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                            isLight
                              ? "text-[#0F172A] hover:text-[#2563EB]"
                              : "text-white hover:text-white/80"
                          }`}
                        >
                          <span>{lang === "th" ? "ดูรายละเอียดสินค้า" : "Explore Model"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => onQuickView(p)}
                          className={`text-xs transition-colors cursor-pointer ${
                            isLight
                              ? "text-[#64748B] hover:text-[#0F172A]"
                              : "text-[#9496A1] hover:text-white"
                          }`}
                        >
                          {lang === "th" ? "ดูข้อมูลด่วน" : "Quick View"}
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
