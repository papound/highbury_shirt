"use client";

import Image from "next/image";
import Link from "next/link";

interface HeroV3Props {
  onOpenSizeGuide: () => void;
  lang?: "th" | "en";
}

export default function HeroV3({ onOpenSizeGuide, lang = "th" }: HeroV3Props) {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between bg-[#07080B] text-white overflow-hidden">
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
        {/* Crisp linear gradient: dark left for typography, models clear on right */}
        <div
          className="absolute inset-0 z-1"
          style={{
            background:
              "linear-gradient(to right, #07080B 0%, #07080B 20%, rgba(7, 8, 11, 0.8) 35%, rgba(7, 8, 11, 0.2) 48%, transparent 58%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07080B] to-transparent z-1" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07080B]/80 to-transparent z-1" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-16 my-auto">
        <div className="max-w-lg lg:max-w-2xl space-y-5">
          {/* Headline (No tiny eyebrow clutter) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-white font-sans">
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
            <p className="text-base sm:text-lg text-[#E7E7E7] font-normal leading-relaxed">
              {lang === "th"
                ? "ความประณีตระดับพรีเมียม สวมใส่สบาย คัตติ้งพอดีตัวสำหรับคนไทยโดยเฉพาะ"
                : "Precision Fit. Easy-Care Luxury Designed for Asian Posture."}
            </p>
            <p className="text-xs sm:text-sm text-[#9496A1]">
              {lang === "th"
                ? "ตัดเย็บอย่างประณีตด้วยเนื้อผ้าระบายอากาศ รีดง่าย ทรงสวยตลอดวันทำงาน"
                : "Performance. Comfort. Easy-Care Craftsmanship."}
            </p>
          </div>

          {/* Action Buttons: Consistent 8px radius, no decorative icons */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href="#models" className="v3-btn-primary">
              <span>{lang === "th" ? "เลือกชมคอลเลกชัน" : "Explore Collection"}</span>
            </Link>

            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="v3-btn-secondary"
            >
              <span>{lang === "th" ? "คำนวณไซส์ Smart Size" : "Smart Size Finder"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Spec Bar: Solid #0E1015, 1px border #262830, NO backdrop-blur */}
      <div className="relative z-10 w-full border-t border-[#262830] bg-[#0E1015] py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div>
              <div className="font-mono text-xl sm:text-2xl font-semibold text-white">
                S – 4XL
              </div>
              <div className="text-xs text-[#9496A1] mt-0.5">
                {lang === "th" ? "ช่วงไซส์มาตรฐาน (รอบอก 38\" - 50\")" : "Standard Range (Chest 38\" - 50\")"}
              </div>
            </div>

            <div className="sm:border-l sm:border-[#262830] sm:pl-8">
              <div className="font-mono text-xl sm:text-2xl font-semibold text-white">
                100%
              </div>
              <div className="text-xs text-[#9496A1] mt-0.5">
                {lang === "th" ? "ผ้าฝ้าย Premium Cotton รีดง่าย คืนทรง" : "Easy-Care Long-Staple Cotton"}
              </div>
            </div>

            <div className="sm:border-l sm:border-[#262830] sm:pl-8">
              <div className="font-mono text-xl sm:text-2xl font-semibold text-white">
                7 วัน
              </div>
              <div className="text-xs text-[#9496A1] mt-0.5">
                {lang === "th" ? "เปลี่ยนไซส์ฟรีภายใน 7 วันหลังรับพัสดุ" : "Free Size Exchange within 7 Days"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
