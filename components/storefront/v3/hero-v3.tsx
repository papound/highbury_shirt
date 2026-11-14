"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";

interface HeroV3Props {
  onOpenSizeGuide: () => void;
}

export default function HeroV3({ onOpenSizeGuide }: HeroV3Props) {
  return (
    <section className="w-full bg-white border-b border-[#E7E5E4] py-14 sm:py-18 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Concrete Headline & Actions (No pill above headline, no gradient words) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#0F172B] tracking-tight leading-[1.18]">
              เสื้อเชิ้ตสำเร็จรูปคุณภาพสูง
              <br />
              คัตติ้งพอดีตัวสำหรับสรีระคนไทย
            </h1>

            <p className="text-base sm:text-lg text-[#79716B] leading-relaxed max-w-xl">
              Highbury ผลิตเสื้อเชิ้ตสำเร็จรูปจากเนื้อผ้าคัดสรรพิเศษ คืนทรงไว รีดง่าย
              ออกแบบแพทเทิร์นโดยคำนวณสัดส่วนไหล่และวงแขนให้เข้ากับคนไทยโดยเฉพาะ
              สวมใส่สบายตลอดวันทำงาน
            </p>

            {/* Solid Action Buttons (No gradients, no glassmorphism) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/products" className="v3-btn-brand">
                <span>ดูสินค้าทั้งหมด</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="v3-btn-outline"
              >
                <Ruler className="w-4 h-4 text-[#163666]" />
                <span>คำนวณและดูตารางไซส์</span>
              </button>
            </div>

            {/* Concrete Highbury Facts (Still row, no marquee, no middle dots, no fake numbers) */}
            <div className="pt-8 border-t border-[#E7E5E4] grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#163666]">
                  3,500 ตัว
                </div>
                <div className="text-xs text-[#79716B] mt-0.5">
                  กำลังผลิตต่อเดือน
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#163666]">
                  100 ตัว
                </div>
                <div className="text-xs text-[#79716B] mt-0.5">
                  ขั้นต่ำสำหรับงานสั่งตัด
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#163666]">
                  XS - 4XL
                </div>
                <div className="text-xs text-[#79716B] mt-0.5">
                  ขนาดครอบคลุมทุกรูปทรง
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real High-Resolution Product Photography (Near top of page) */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#E7E5E4] bg-[#F8FAFC]">
              <Image
                src="/images/placeholders/men-ls.jpg"
                alt="เสื้อเชิ้ตแขนยาว Highbury"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
