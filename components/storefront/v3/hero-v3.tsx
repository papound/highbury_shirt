"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

interface HeroV3Props {
  onOpenSizeGuide: () => void;
  lang?: "th" | "en";
}

export default function HeroV3({ onOpenSizeGuide, lang = "th" }: HeroV3Props) {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between bg-[#07080B] text-white overflow-hidden">
      {/* Background Visual: Real high-res luxury tailored shirt studio visual */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/images/hero-main.jpg"
          alt="Highbury Asian Fit Tailoring Models"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_center] md:object-[right_center] scale-100 transition-transform duration-1000"
        />
        {/* Seamless cinematic gradient: solid dark for typography on left, gentle transition, crystal-clear models on right */}
        <div
          className="absolute inset-0 z-1"
          style={{
            background:
              "linear-gradient(to right, #07080B 0%, #07080B 35%, rgba(7, 8, 11, 0.85) 50%, rgba(7, 8, 11, 0.2) 70%, transparent 85%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07080B] to-transparent z-1" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#07080B]/80 to-transparent z-1" />
        {/* Mobile scrim for readability */}
        <div className="absolute inset-0 bg-[#07080B]/55 md:hidden z-1" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-44 pb-20 my-auto">
        <div className="max-w-3xl space-y-6">
          {/* Tag above headline (Quantum Style) */}
          <div className="text-white/60 text-xs font-semibold tracking-[0.28em] uppercase font-sans">
            HIGHBURY INTERNATIONAL
          </div>

          {/* Headline (Quantum Style: Two-line large, clean modern sans) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium tracking-[-0.03em] leading-[1.05] text-white font-sans">
            {lang === "th" ? (
              <>
                ปฏิวัติความพอดี
                <br />
                เสื้อเชิ้ตสรีระคนไทย
              </>
            ) : (
              <>
                Revolutionary
                <br />
                Asian Fit Tailoring
              </>
            )}
          </h1>

          {/* Subtitle (Bilingual TH / ENG) */}
          <div className="space-y-1 max-w-xl">
            <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed">
              {lang === "th"
                ? "ความประณีตระดับพรีเมียม สวมใส่สบาย คัตติ้งพอดีตัวสำหรับคนไทยโดยเฉพาะ"
                : "Performance. Precision. Easy-Care Luxury Designed for Asian Posture."}
            </p>
            <p className="text-xs sm:text-sm text-white/50 font-normal">
              {lang === "th"
                ? "Performance. Comfort. Easy-Care Craftsmanship."
                : "ตัดเย็บอย่างประณีตด้วยเนื้อผ้าระบายอากาศ รีดง่าย ทรงสวยตลอดวันทำงาน"}
            </p>
          </div>

          {/* Action Buttons (Quantum Style: White Pill & Glass Pill with Play Icon) */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="#models" className="v3-btn-white">
              <span>{lang === "th" ? "เลือกชมคอลเลกชัน" : "Explore Collection"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="v3-btn-glass"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{lang === "th" ? "คำนวณไซส์ Smart Size Finder" : "Smart Size Finder"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Spec Bar (Matching Quantum exactly) */}
      <div className="relative z-10 w-full border-t border-white/10 bg-[#07080B]/60 backdrop-blur-md py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* 3 Telemetry Specs (Bilingual) */}
          <div className="grid grid-cols-3 gap-6 sm:gap-14 md:gap-20">
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                XS – 4XL
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-white/50 tracking-[0.15em] uppercase mt-1">
                {lang === "th" ? "Asian Fit Range (ไซส์คนไทย)" : "Asian Fit Range"}
              </div>
            </div>

            <div className="border-l border-white/10 pl-6 sm:pl-14 md:pl-20">
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                100%
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-white/50 tracking-[0.15em] uppercase mt-1">
                {lang === "th" ? "Easy-Care Cotton (รีดง่าย)" : "Easy-Care Cotton"}
              </div>
            </div>

            <div className="border-l border-white/10 pl-6 sm:pl-14 md:pl-20">
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                7 Days
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-white/50 tracking-[0.15em] uppercase mt-1">
                {lang === "th" ? "Free Exchange (เปลี่ยนฟรี)" : "Free Size Exchange"}
              </div>
            </div>
          </div>

          {/* Far Right: SCROLL | */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-white/50 tracking-[0.25em] uppercase">
            <span>SCROLL</span>
            <span className="w-px h-4 bg-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
