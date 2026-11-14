import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CraftStory() {
  return (
    <section id="craftsmanship" className="w-full py-16 sm:py-20 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Real Craftsmanship Specifications */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172B] tracking-tight leading-tight">
              รายละเอียดการตัดเย็บที่ใส่ใจในทุกขั้นตอน
            </h2>

            <p className="text-sm sm:text-base text-[#79716B] leading-relaxed max-w-xl">
              ช่างตัดเย็บมืออาชีพของ Highbury ควบคุมมาตรฐานการตัดเย็บทุกฝีเข็ม
              เพื่อให้ได้เสื้อเชิ้ตที่คงทน ทรงสวย และสวมใส่สบายในทุกวันทำงาน
            </p>

            {/* Informative List (No repetitive icon-card grid, no emoji, no middle dots) */}
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-[#E7E5E4] bg-[#F9FAFB]">
                <h3 className="font-bold text-sm text-[#0F172B]">
                  โครงสร้างปกเสื้ออยู่ทรง
                </h3>
                <p className="text-xs text-[#79716B] mt-1 leading-relaxed">
                  เสริมผ้ากาวซับในเกรดพรีเมียม ปกเสื้อตั้งสวย ไม่ย้วยหรือแบะออกหลังผ่านการซัก
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#E7E5E4] bg-[#F9FAFB]">
                <h3 className="font-bold text-sm text-[#0F172B]">
                  ความหนาแน่น 21 ฝีเข็มต่อนิ้ว
                </h3>
                <p className="text-xs text-[#79716B] mt-1 leading-relaxed">
                  ฝีเข็มละเอียดถี่ ตะเข็บซ่อนเรียบเนียน ไม่ระคายเคืองผิวสัมผัสเมื่อสวมใส่
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#E7E5E4] bg-[#F9FAFB]">
                <h3 className="font-bold text-sm text-[#0F172B]">
                  เนื้อผ้าระบายอากาศได้ดี
                </h3>
                <p className="text-xs text-[#79716B] mt-1 leading-relaxed">
                  เส้นใย Cotton คุณภาพสูง ถ่ายเทความร้อนและความชื้นได้เหมาะสมกับสภาพอากาศเมืองไทย
                </p>
              </div>
            </div>

            {/* Plain Action Link */}
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#163666] hover:text-[#0A2B5E] transition-colors"
              >
                <span>อ่านเรื่องราวและประวัติของ Highbury</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Real Product Detail Photo */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7E5E4] bg-[#F8FAFC]">
              <Image
                src="/images/placeholders/men-ss.jpg"
                alt="เสื้อเชิ้ตแขนสั้น Highbury"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
