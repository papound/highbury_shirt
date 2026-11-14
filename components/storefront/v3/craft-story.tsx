import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors, Sparkles, Wind } from "lucide-react";

export default function CraftStory() {
  return (
    <section id="craftsmanship" className="w-full py-24 lg:py-32 bg-white text-[#0A0B0E] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Typography & Feature Icons */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">
                ABOUT CRAFTSMANSHIP
              </span>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#0A0B0E] tracking-tight leading-[1.05]">
                A New Standard
                <br />
                <span className="italic font-light text-[#334155]">of Daily Elegance</span>
              </h2>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl font-sans">
                Highbury International หลอมรวมความประณีตของการตัดเย็บสูทชั้นสูงเข้ากับเสื้อเชิ้ตใส่ประจำวัน
                คัดสรรเฉพาะเส้นใยธรรมชาติเนื้อละเอียด ปรับสัดส่วนวงแขนและไหล่ให้พอดีสรีระคนไทย
                เพื่อให้คุณมั่นใจในทุกบทบาทและทุกโอกาสสำคัญ
              </p>
            </div>

            {/* Black Pill Button (Matching Quantum) */}
            <div>
              <Link href="/about" className="v3-btn-black">
                <span>เรื่องราวของ Highbury</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3 Horizontal Feature Badges (Matching Quantum) */}
            <div className="pt-8 border-t border-[#E2E8F0] grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0A0B0E]">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-[#0A0B0E]">
                  ทรงปกอยู่ทรง
                </div>
                <div className="text-[11px] text-[#64748B] leading-tight">
                  เสริมซับในพรีเมียม ไม่แบะย้วย
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0A0B0E]">
                  <Scissors className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-[#0A0B0E]">
                  ตะเข็บประณีต
                </div>
                <div className="text-[11px] text-[#64748B] leading-tight">
                  21 ฝีเข็มต่อนิ้ว นุ่มนวลต่อผิว
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0A0B0E]">
                  <Wind className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-[#0A0B0E]">
                  ระบายอากาศดี
                </div>
                <div className="text-[11px] text-[#64748B] leading-tight">
                  โครงสร้างเส้นใยโปร่งสบาย ไม่อับ
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Res Perspective Photography */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-2xl bg-[#F8FAFC]">
              <Image
                src="/images/placeholders/men-ss.jpg"
                alt="Highbury Master Tailoring Craft"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-top hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
