import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Feather } from "lucide-react";

export default function MacroDetail() {
  return (
    <section id="technology" className="w-full py-24 lg:py-32 bg-white text-[#0A0B0E] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Macro Narrative & Features */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">
                TECHNOLOGY & MATERIAL
              </span>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#0A0B0E] tracking-tight leading-[1.05]">
                Intelligence
                <br />
                <span className="italic font-light text-[#334155]">in Every Thread</span>
              </h2>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl font-sans">
                เส้นใย Cotton คัดสรรพิเศษทอละเอียดแบบ Double-Ply ให้ความนุ่มละมุน
                ทนทานต่อการซักรีดบ่อยครั้ง และจัดการความชื้นได้อย่างมีประสิทธิภาพ
                เพื่อให้คุณมั่นใจตลอดวันทำงาน 12+ ชั่วโมง
              </p>
            </div>

            {/* Feature Highlights List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#0A0B0E]">
                    เส้นใยละเอียด นุ่มสบาย ไม่ระคายเคือง
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 leading-relaxed">
                    โครงสร้างเส้นใยยาวพิเศษให้ผิวสัมผัสเรียบเนียน ระบายอากาศได้ดีเยี่ยม
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#0A0B0E]">
                    ดูแลรักษาง่าย ประหยัดเวลารีด
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 leading-relaxed">
                    คืนทรงไว รอยยับคลายตัวรวดเร็ว ซักสะบัดแขวนช่วยลดขั้นตอนการรีด
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#0A0B0E]">
                    เย็บเสริมความแข็งแรงทุกจุดรับแรง
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 leading-relaxed">
                    เสริมผ้าซับในปกคอและสาบข้อมือ เพื่อให้คงรูปสวยงามตลอดอายุการใช้งาน
                  </p>
                </div>
              </div>
            </div>

            {/* Black Pill CTA Button (Matching Quantum) */}
            <div className="pt-2">
              <Link href="/products" className="v3-btn-black">
                <span>สำรวจคอลเลกชันทั้งหมด</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Macro Close-up Visual */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-2xl bg-[#F8FAFC]">
              <Image
                src="/images/placeholders/women-ls.jpg"
                alt="Highbury Fine Fabric & Stitching"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover object-center hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
