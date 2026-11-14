import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Feather } from "lucide-react";

export default function MacroDetail() {
  return (
    <section className="w-full py-20 lg:py-28 bg-white dark:bg-background text-foreground border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Macro Narrative & Features */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                MATERIAL & DETAIL
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                สัมผัสความสบาย
                <br />
                ในทุกมิติของการสวมใส่
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                เส้นใย Cotton คัดสรรพิเศษทอละเอียดแบบ Double-Ply ให้ความนุ่มละมุน
                ทนทานต่อการซักรีดบ่อยครั้ง และจัดการความชื้นได้อย่างมีประสิทธิภาพ
                เพื่อให้คุณมั่นใจตลอดวันทำงาน 12+ ชั่วโมง
              </p>
            </div>

            {/* Feature Highlights List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    เส้นใยละเอียด นุ่มสบาย ไม่ระคายเคือง
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    โครงสร้างเส้นใยยาวให้ผิวสัมผัสเรียบเนียน ระบายอากาศได้ดีเยี่ยม
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    ดูแลรักษาง่าย ประหยัดเวลารีด
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    คืนทรงไว รอยยับคลายตัวรวดเร็ว ซักสะบัดแขวนช่วยลดขั้นตอนการรีด
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    การเย็บเสริมความแข็งแรงทุกจุดรับแรง
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    เสริมผ้าซับในปกคอและสาบข้อมือ เพื่อให้คงรูปสวยงามตลอดอายุการใช้งาน
                  </p>
                </div>
              </div>
            </div>

            {/* Pill CTA Button */}
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#071322] hover:bg-[#132a48] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#071322] font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md"
              >
                <span>เลือกชมสินค้าทั้งหมด</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Macro Close-up Visual */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
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
