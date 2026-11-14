"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler, CheckCircle2 } from "lucide-react";

interface HeroV3Props {
  onOpenSizeGuide: () => void;
}

export default function HeroV3({ onOpenSizeGuide }: HeroV3Props) {
  return (
    <section className="relative w-full bg-background border-b border-border/60 overflow-hidden">
      {/* Subtle luxury neutral background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 25%, rgba(10, 37, 64, 0.05) 0%, transparent 45%), radial-gradient(circle at 85% 70%, rgba(37, 99, 235, 0.04) 0%, transparent 40%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-16 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Typography & CTAs (Fits 1280x800 comfortably) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Eyebrow / Tag */}
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold tracking-wide border border-slate-200 dark:border-slate-700">
            <span>Highbury Tailoring</span>
            <span className="text-slate-400">·</span>
            <span className="text-blue-600 dark:text-blue-400">คัตติ้งระดับพรีเมียม</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-foreground tracking-tight leading-[1.18]">
            เสื้อเชิ้ตใส่สบาย คัตติ้งเนี้ยบ
            <br />
            <span className="text-[#0A2540] dark:text-blue-400">
              ทรงสวยพอดีตัวในทุกวันทำงาน
            </span>
          </h1>

          {/* One clear sentence description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
            ตัดเย็บประณีตด้วยเนื้อผ้าคัดสรรพิเศษ ระบายอากาศได้ดี ยับยาก คืนทรงไว
            พร้อมแพทเทิร์นที่ออกแบบสำหรับสรีระคนไทยโดยเฉพาะ
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0A2540] dark:bg-blue-600 text-white font-semibold text-sm hover:bg-[#13385e] dark:hover:bg-blue-500 transition-[background-color,transform] duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <Ruler className="w-4 h-4 text-amber-300" />
              <span>ค้นหาไซส์ที่พอดี (Smart Size Finder)</span>
            </button>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm transition-[background-color,border-color] duration-200"
            >
              <span>ดูสินค้าทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Value Points */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/60 max-w-lg text-xs sm:text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>ผ้ายับยาก รีดง่าย</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>ระบายอากาศดี</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>เปลี่ยนไซส์ฟรี 7 วัน</span>
            </div>
          </div>
        </div>

        {/* Right Column: Shirt Showcase with Callout Pins */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden border border-border/80 bg-slate-50 dark:bg-slate-900 shadow-lg">
            <Image
              src="/images/placeholders/men-ls.jpg"
              alt="Highbury Signature Premium Shirt"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover object-top"
            />

            {/* Feature Callout Tag 1: Collar */}
            <div className="absolute top-[18%] left-4 sm:left-6 z-20 bg-background/95 dark:bg-slate-950/90 backdrop-blur-sm border border-border/80 shadow-md rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-foreground pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>ทรงปกสวย อยู่ทรงตลอดวัน</span>
            </div>

            {/* Feature Callout Tag 2: Breathable Fabric */}
            <div className="absolute top-[48%] right-4 sm:right-6 z-20 bg-background/95 dark:bg-slate-950/90 backdrop-blur-sm border border-border/80 shadow-md rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-foreground pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>เนื้อผ้าระบายอากาศ สวมใส่สบาย</span>
            </div>

            {/* Feature Callout Tag 3: Fit & Wrinkle Resistance */}
            <div className="absolute bottom-[14%] left-4 sm:left-6 z-20 bg-background/95 dark:bg-slate-950/90 backdrop-blur-sm border border-border/80 shadow-md rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-foreground pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>แพทเทิร์นพอดีตัว ยับยาก ดูแลรักษาง่าย</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
