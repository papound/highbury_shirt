"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

interface HeroV3Props {
  onOpenSizeGuide: () => void;
  lang?: "th" | "en";
  theme?: "dark" | "light";
}

export default function HeroV3({
  onOpenSizeGuide,
  lang = "th",
  theme = "dark",
}: HeroV3Props) {
  return (
    <section
      className={`relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden transition-colors duration-200 ${
        theme === "light" ? "bg-[#FFFFFF] text-[#0F172A]" : "bg-[#07080B] text-white"
      }`}
    >
      {/* Background Visual: Official Highbury models photo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/images/hero-main.jpg"
          alt="Highbury Asian Fit Tailoring Models"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[56%_center] sm:object-[62%_center] lg:object-[68%_center] scale-100"
        />
        {/* Crisp linear gradient adapted for dark/light themes */}
        <div
          className="absolute inset-0 z-1"
          style={{
            background:
              theme === "light"
                ? "linear-gradient(to right, #FFFFFF 0%, #FFFFFF 22%, rgba(255, 255, 255, 0.95) 36%, rgba(255, 255, 255, 0.45) 50%, transparent 64%)"
                : "linear-gradient(to right, #07080B 0%, #07080B 20%, rgba(7, 8, 11, 0.8) 35%, rgba(7, 8, 11, 0.2) 48%, transparent 58%)",
          }}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${
            theme === "light" ? "from-white" : "from-[#07080B]"
          } to-transparent z-1`}
        />
        <div
          className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${
            theme === "light" ? "from-white/90" : "from-[#07080B]/80"
          } to-transparent z-1`}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-16 my-auto">
        <div className="max-w-lg lg:max-w-2xl space-y-5">
          {/* Headline (No tiny eyebrow clutter) */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] font-sans ${
              theme === "light" ? "text-[#0F172A]" : "text-white"
            }`}
          >
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

          {/* Subtitle */}
          <div className="space-y-1 max-w-xl">
            <p
              className={`text-base sm:text-lg font-normal leading-relaxed ${
                theme === "light" ? "text-[#334155]" : "text-[#E7E7E7]"
              }`}
            >
              {lang === "th"
                ? "ความประณีตระดับพรีเมียม สวมใส่สบาย คัตติ้งพอดีตัวสำหรับคนไทยโดยเฉพาะ"
                : "Precision Fit. Easy-Care Luxury Designed for Asian Posture."}
            </p>
            <p
              className={`text-xs sm:text-sm ${
                theme === "light" ? "text-[#64748B]" : "text-[#9496A1]"
              }`}
            >
              {lang === "th"
                ? "ตัดเย็บอย่างประณีตด้วยเนื้อผ้าระบายอากาศ รีดง่าย ทรงสวยตลอดวันทำงาน"
                : "Performance. Comfort. Easy-Care Craftsmanship."}
            </p>
          </div>

          {/* Action Buttons: Exact Quantum Pill Buttons (White pill + Glass outline pill) */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
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
              <span>{lang === "th" ? "คำนวณไซส์ Smart Size" : "Smart Size Finder"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Spec Bar: Solid background, 1px border */}
      <div
        className={`relative z-10 w-full border-t py-5 sm:py-6 transition-colors duration-200 ${
          theme === "light"
            ? "border-[#E5E7EB] bg-[#F8F9FA] text-[#0F172A]"
            : "border-[#262830] bg-[#0E1015] text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div>
              <div
                className={`text-xl sm:text-2xl font-semibold ${
                  theme === "light" ? "text-[#0F172A]" : "text-white"
                }`}
              >
                S – 5XL
              </div>
              <div
                className={`text-xs mt-0.5 ${
                  theme === "light" ? "text-[#64748B]" : "text-[#9496A1]"
                }`}
              >
                {lang === "th"
                  ? "ช่วงไซส์มาตรฐาน (รอบอก 35\" - 52.5\")"
                  : "Standard Range (Chest 35\" - 52.5\")"}
              </div>
            </div>

            <div
              className={`sm:border-l sm:pl-8 ${
                theme === "light" ? "sm:border-[#E5E7EB]" : "sm:border-[#262830]"
              }`}
            >
              <div
                className={`text-xl sm:text-2xl font-semibold ${
                  theme === "light" ? "text-[#0F172A]" : "text-white"
                }`}
              >
                100%
              </div>
              <div
                className={`text-xs mt-0.5 ${
                  theme === "light" ? "text-[#64748B]" : "text-[#9496A1]"
                }`}
              >
                {lang === "th"
                  ? "ผ้าฝ้าย Premium Cotton รีดง่าย คืนทรง"
                  : "Easy-Care Long-Staple Cotton"}
              </div>
            </div>

            <div
              className={`sm:border-l sm:pl-8 ${
                theme === "light" ? "sm:border-[#E5E7EB]" : "sm:border-[#262830]"
              }`}
            >
              <div
                className={`text-xl sm:text-2xl font-semibold ${
                  theme === "light" ? "text-[#0F172A]" : "text-white"
                }`}
              >
                7 วัน
              </div>
              <div
                className={`text-xs mt-0.5 ${
                  theme === "light" ? "text-[#64748B]" : "text-[#9496A1]"
                }`}
              >
                {lang === "th"
                  ? "เปลี่ยนไซส์ฟรีภายใน 7 วันหลังรับพัสดุ"
                  : "Free Size Exchange within 7 Days"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
