"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler, ChevronDown } from "lucide-react";

interface HeroV3Props {
  onOpenSizeGuide: () => void;
}

export default function HeroV3({ onOpenSizeGuide }: HeroV3Props) {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between bg-[#0A0B0E] text-[#F8FAFC] overflow-hidden">
      {/* Background Cinematic Atmosphere & Hero Shirt Visual */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/images/placeholders/men-ls.jpg"
          alt="Highbury Flagship Tailored Shirt"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_28%] md:object-[right_20%] opacity-35 md:opacity-45 mix-blend-luminosity scale-105"
        />
        {/* Subtle cinematic gradient overlays matching Quantum */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0E] via-[#0A0B0E]/80 to-transparent" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 32%, rgba(46, 144, 250, 0.3) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-36 pb-16 my-auto">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-white/60 text-xs font-semibold tracking-[0.25em] uppercase">
            <span>HIGHBURY INTERNATIONAL</span>
          </div>

          {/* Massive Editorial Display Headline (Cormorant Garamond) */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-normal tracking-tight leading-[0.98] text-white">
            The Definition
            <br />
            <span className="font-light italic text-white/90">of Perfect Fit</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/70 font-normal leading-relaxed max-w-xl font-sans">
            ความประณีตที่สัมผัสได้ในทุกวันทำงาน ตัดเย็บด้วยเนื้อผ้าคัดสรรพิเศษ
            ยับยาก ใส่สบาย และออกแบบมาเพื่อสรีระคนไทยโดยเฉพาะ
          </p>

          {/* Dual Pill CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="/products" className="v3-btn-white">
              <span>เลือกชมคอลเลกชัน</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="v3-btn-glass"
            >
              <Ruler className="w-4 h-4 text-blue-400" />
              <span>Smart Size Finder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Spec Bar (Matching Quantum exactly) */}
      <div className="relative z-10 w-full border-t border-white/[0.08] bg-[#0A0B0E]/80 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* 3 Telemetry Specs */}
          <div className="grid grid-cols-3 gap-6 sm:gap-14 md:gap-20">
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white leading-none">
                100%
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-white/50 tracking-[0.15em] uppercase mt-2">
                Long-Staple Cotton
              </div>
            </div>

            <div className="border-l border-white/[0.08] pl-6 sm:pl-14 md:pl-20">
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white leading-none">
                80/2
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-white/50 tracking-[0.15em] uppercase mt-2">
                Two-Ply Weave
              </div>
            </div>

            <div className="border-l border-white/[0.08] pl-6 sm:pl-14 md:pl-20">
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white leading-none">
                S – 4XL
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-white/50 tracking-[0.15em] uppercase mt-2">
                Asian Fit Spec
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-white/50 tracking-[0.2em] uppercase">
            <span>SCROLL</span>
            <span className="w-4 h-[1px] bg-white/40" />
            <ChevronDown className="w-3.5 h-3.5 text-white/70 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
