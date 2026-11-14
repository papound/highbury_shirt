"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler, ChevronDown } from "lucide-react";

interface HeroV3Props {
  onOpenSizeGuide: () => void;
}

export default function HeroV3({ onOpenSizeGuide }: HeroV3Props) {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between bg-[#071322] text-white overflow-hidden">
      {/* Background Cinematic Atmosphere & Hero Shirt Visual */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/images/placeholders/men-ls.jpg"
          alt="Highbury Signature Shirt"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_28%] md:object-[right_20%] opacity-30 md:opacity-40 mix-blend-luminosity scale-105"
        />
        {/* Cinematic gradient overlays matching Quantum reference */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071322] via-[#071322]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071322] via-[#071322]/80 to-transparent" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.25) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-12 my-auto">
        <div className="max-w-2xl space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/15">
            <span>HIGHBURY INTERNATIONAL</span>
          </div>

          {/* Massive Editorial Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.08] text-white">
            The Definition
            <br />
            of Perfect Fit
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 font-normal leading-relaxed max-w-xl">
            ความประณีตที่สัมผัสได้ในทุกวันทำงาน ตัดเย็บด้วยเนื้อผ้าคัดสรรพิเศษ
            ยับยาก ใส่สบาย และออกแบบมาเพื่อสรีระคนไทยโดยเฉพาะ
          </p>

          {/* Dual Pill CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#071322] font-bold text-sm hover:bg-slate-100 transition-[background-color,transform] duration-200 active:scale-[0.98] shadow-lg cursor-pointer"
            >
              <span>เลือกชมคอลเลกชัน</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition-[background-color,border-color] duration-200 cursor-pointer"
            >
              <Ruler className="w-4 h-4 text-amber-300" />
              <span>Smart Size Finder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3-Metric Spec Bar & Scroll Indicator (Quantum style) */}
      <div className="relative z-10 w-full border-t border-white/10 bg-[#071322]/80 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* 3 Key Specs */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 md:gap-16">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white leading-none">
                100%
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-white/60 tracking-wider uppercase mt-1">
                Cotton คัดสรร
              </div>
            </div>

            <div className="border-l border-white/10 pl-6 sm:pl-12 md:pl-16">
              <div className="text-xl sm:text-2xl font-black text-white leading-none">
                Easy-Care
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-white/60 tracking-wider uppercase mt-1">
                ยับยาก คืนทรงไว
              </div>
            </div>

            <div className="border-l border-white/10 pl-6 sm:pl-12 md:pl-16">
              <div className="text-xl sm:text-2xl font-black text-white leading-none">
                S – 4XL
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-white/60 tracking-wider uppercase mt-1">
                ทรงพอดีคนไทย
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-widest">
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-white/80" />
          </div>
        </div>
      </div>
    </section>
  );
}
