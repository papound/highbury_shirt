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
    <section id="models" className="relative w-full py-20 sm:py-28 bg-[#07080B] text-white border-b border-[#262830]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row: Clean, No eyebrow clutter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-tight">
              {lang === "th" ? (
                <>
                  คอลเลกชันสินค้า
                  <br />
                  คัดสรรตามหมวดหมู่จริง
                </>
              ) : (
                <>
                  Real Garment Collection
                  <br />
                  Across Every Category
                </>
              )}
            </h2>
            <p className="text-sm text-[#9496A1]">
              {lang === "th"
                ? "เสื้อเชิ้ตสำเร็จรูปผลิตจริงในสต็อก พร้อมข้อมูลไซส์และราคาจริงจากฐานข้อมูล Highbury"
                : "Real ready-to-wear shirts in stock, backed by exact sizing and verified factory pricing."}
            </p>
          </div>

          {/* Carousel Arrow Controls (Consistent 8px radius) */}
          <div className="flex items-center gap-2">
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
                  {/* Card: 8px radius, solid background #13161D, 1px border #262830 (NO backdrop-blur) */}
                  <div className="flex flex-col h-full rounded-lg bg-[#13161D] border border-[#262830] overflow-hidden">
                    {/* Model Photo Container */}
                    <div className="relative aspect-[16/11] bg-[#0E1015] overflow-hidden border-b border-[#262830]">
                      <Image
                        src={primaryImg}
                        alt={p.nameTh || p.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top"
                      />
                      {/* Solid Category Badge (NO backdrop-blur) */}
                      <div className="absolute top-2.5 left-2.5 pointer-events-none">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold text-white bg-[#07080B] border border-[#262830]">
                          {p.category.nameTh}
                        </span>
                      </div>
                    </div>

                    {/* Model Details */}
                    <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                      <div>
                        <div className="text-[11px] font-semibold text-[#9496A1] uppercase tracking-wider">
                          {catEn}
                        </div>
                        <h3 className="text-base font-semibold text-white tracking-tight line-clamp-1 mt-0.5">
                          {p.nameTh || p.name}
                        </h3>
                        <p className="text-xs text-[#9496A1] mt-1 line-clamp-1">
                          {p.descTh || "แพทเทิร์นพอดีตัวสรีระคนไทย · ดูแลง่าย"}
                        </p>
                      </div>

                      {/* 3-Spec Bar with real sourced numbers */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#262830] text-center">
                        <div>
                          <div className="font-mono text-sm font-semibold text-white">
                            100%
                          </div>
                          <div className="text-[10px] text-[#9496A1] uppercase">
                            COTTON
                          </div>
                        </div>

                        <div className="border-l border-[#262830]">
                          <div className="font-mono text-sm font-semibold text-white">
                            S – 4XL
                          </div>
                          <div className="text-[10px] text-[#9496A1] uppercase">
                            SIZES
                          </div>
                        </div>

                        <div className="border-l border-[#262830]">
                          <div className="font-mono text-sm font-semibold text-[#FFB900]">
                            {priceStr}
                          </div>
                          <div className="text-[10px] text-[#9496A1] uppercase">
                            STARTING
                          </div>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="flex items-center justify-between pt-1">
                        <Link
                          href={`/products/${p.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-white/80 transition-colors"
                        >
                          <span>{lang === "th" ? "ดูรายละเอียดสินค้า" : "Explore Model"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => onQuickView(p)}
                          className="text-xs text-[#9496A1] hover:text-white transition-colors cursor-pointer"
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
