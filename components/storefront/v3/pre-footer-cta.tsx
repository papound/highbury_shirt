"use client";

import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";

interface PreFooterCtaProps {
  onOpenSizeGuide: () => void;
}

export default function PreFooterCta({ onOpenSizeGuide }: PreFooterCtaProps) {
  return (
    <section className="w-full py-16 sm:py-20 bg-[#F9FAFB] text-[#0F172B] border-b border-[#E7E5E4]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172B] tracking-tight">
          สัมผัสความพอดีของเสื้อเชิ้ต Highbury
        </h2>

        <p className="text-sm sm:text-base text-[#79716B] max-w-xl mx-auto leading-relaxed">
          เลือกไซส์ที่เหมาะกับสรีระคุณ พร้อมโปรโมชั่นสั่งซื้อ 3 ตัว แถมฟรี 1 ตัว
          และบริการเปลี่ยนไซส์ฟรีภายใน 7 วัน
        </p>

        {/* Solid Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/products" className="v3-btn-brand w-full sm:w-auto">
            <span>เลือกซื้อเสื้อเชิ้ต</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="v3-btn-outline w-full sm:w-auto"
          >
            <Ruler className="w-4 h-4 text-[#163666]" />
            <span>คำนวณและดูตารางไซส์</span>
          </button>
        </div>
      </div>
    </section>
  );
}
