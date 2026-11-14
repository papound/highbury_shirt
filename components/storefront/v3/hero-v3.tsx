"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

interface HeroV3Props {
  onOpenSizeGuide: () => void;
}

export default function HeroV3({ onOpenSizeGuide }: HeroV3Props) {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between bg-[#07080B] text-white overflow-hidden">
      {/* Background Visual: High-impact cinematic visual matching Quantum car in mist */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/images/placeholders/men-ls.jpg"
          alt="Highbury Flagship Tailored Shirt"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] md:object-[right_25%] opacity-35 md:opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        {/* Cinematic gradient overlays matching Quantum */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-[#07080B]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/70 to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 45%, rgba(46, 144, 250, 0.4) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-44 pb-20 my-auto">
        <div className="max-w-3xl space-y-6">
          {/* Tag above headline (Quantum Style) */}
          <div className="text-white/60 text-xs font-semibold tracking-[0.28em] uppercase font-sans">
            HIGHBURY
          </div>

          {/* Headline (Quantum Style: Two-line large, clean modern sans) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-medium tracking-[-0.03em] leading-[1.05] text-white font-sans">
            Revolutionary
            <br />
            Asian Fit Tailoring
          </h1>

          {/* Subtitle (Quantum Style: Concise 3 words / clean phrase) */}
          <p className="text-base sm:text-lg md:text-xl text-white/70 font-normal leading-relaxed max-w-xl">
            Performance. Comfort. Designed for Asian Posture.
            <br />
            <span className="text-sm sm:text-base text-white/50">
              ความประณีตระดับพรีเมียม สวมใส่สบาย คัตติ้งพอดีตัวในทุกวันทำงาน
            </span>
          </p>

          {/* Action Buttons (Quantum Style: White Pill & Glass Pill with Play Icon) */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="#models" className="v3-btn-white">
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="v3-btn-glass"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Smart Size Finder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Spec Bar (Matching Quantum exactly) */}
      <div className="relative z-10 w-full border-t border-white/10 bg-[#07080B]/60 backdrop-blur-md py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* 3 Telemetry Specs */}
          <div className="grid grid-cols-3 gap-6 sm:gap-14 md:gap-20">
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                21 SPI
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-white/50 tracking-[0.15em] uppercase mt-1">
                Stitch Density
              </div>
            </div>

            <div className="border-l border-white/10 pl-6 sm:pl-14 md:pl-20">
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                100%
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-white/50 tracking-[0.15em] uppercase mt-1">
                Easy-Care Cotton
              </div>
            </div>

            <div className="border-l border-white/10 pl-6 sm:pl-14 md:pl-20">
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                7 Days
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-white/50 tracking-[0.15em] uppercase mt-1">
                Free Exchange
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
