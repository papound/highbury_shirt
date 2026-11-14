import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors, Sparkles, Wind } from "lucide-react";

export default function CraftStory() {
  return (
    <section className="w-full py-20 lg:py-28 bg-white dark:bg-background text-foreground border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Typography & Feature Icons */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                CRAFTSMANSHIP
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                ความประณีตที่ออกแบบมา
                <br />
                เพื่อสรีระคนไทย
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Highbury International ใส่ใจในทุกฝีเข็มตั้งแต่การคัดสรรเส้นใยธรรมชาติ
                การออกแบบโครงสร้างปกคอ และการคำนวณวงแขนเสื้อ
                เพื่อให้คุณได้สัมผัสความสบายที่ลงตัวในทุกอิริยาบถตลอดวัน
              </p>
            </div>

            {/* Pill Button */}
            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#071322] hover:bg-[#132a48] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#071322] font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md"
              >
                <span>เรื่องราวของ Highbury</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3 Horizontal Feature Badges (Matching Quantum) */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ทรงปกอยู่ทรง
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  ตั้งสวย ไม่แบะย้วย
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                  <Scissors className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ตะเข็บประณีต
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  ฝีเข็มละเอียด ไม่ระคายเคือง
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ระบายอากาศดี
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  ใส่สบาย ไม่ร้อนอับ
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Res Perspective Photography */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
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
