import Link from "next/link";
import { Building2, ArrowRight, Check } from "lucide-react";

export default function CorporateBanner() {
  return (
    <section className="w-full py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-slate-900 to-[#0A2540] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 40%)",
            }}
          />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold border border-white/15">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Corporate Uniform & OEM Service</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              ผลิตเสื้อเชิ้ตยูนิฟอร์มองค์กร
              <br />
              <span className="text-amber-300">
                สั่งตัดตามแบบและบริการปักโลโก้ครบวงจร
              </span>
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
              ยกระดับภาพลักษณ์องค์กรด้วยเสื้อเชิ้ตคุณภาพสูง ทรงสวย ใส่สบาย ทนทานต่อการซักรีด
              พร้อมบริการวัดไซส์พนักงานและให้คำปรึกษาเนื้อผ้าโดยผู้เชี่ยวชาญ
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs sm:text-sm text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ขั้นต่ำเพียง 100 ตัว</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ปัก / สกรีนโลโก้</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ไซส์ครอบคลุม S - 4XL</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ราคาพิเศษสำหรับองค์กร</span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <a
                href="mailto:contact@highbury.co.th"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0A2540] font-bold text-xs sm:text-sm hover:bg-slate-100 transition-[background-color,transform] duration-200 active:scale-[0.98] shadow-md"
              >
                <span>ขอใบเสนอราคา / ปรึกษาทีมงาน</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm transition-colors"
              >
                <span>เกี่ยวกับ Highbury</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
