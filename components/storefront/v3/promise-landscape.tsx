import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Award, MessageCircle } from "lucide-react";

export default function PromiseLandscape() {
  return (
    <section className="relative w-full py-24 lg:py-32 bg-[#0A1828] text-white overflow-hidden border-b border-white/10">
      {/* Background cinematic atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 40%, rgba(37, 99, 235, 0.4) 0%, transparent 60%), radial-gradient(circle at 85% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              OUR PROMISE
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              มาตรฐานความมั่นใจ
              <br />
              ในทุกคำสั่งซื้อ
            </h2>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              เราให้ความสำคัญกับความพึงพอใจของคุณเป็นอันดับแรก เสื้อเชิ้ตทุกตัวผ่านการตัดเย็บ
              และตรวจเช็กคุณภาพอย่างเข้มงวด หากสั่งซื้อไปแล้วใส่ไม่พอดี
              สามารถติดต่อขอเปลี่ยนไซส์ได้ฟรีทันที
            </p>

            <div className="pt-2">
              <Link
                href="https://lin.ee/highbury"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0A1828] font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors duration-200 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>ปรึกษาทีมงานผ่าน LINE Official</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Metric Cards (Matching Quantum) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">7 วัน</div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-0.5">
                  เปลี่ยนไซส์ฟรี
                </div>
                <p className="text-xs text-white/70 mt-1">
                  สั่งไปแล้วใส่ไม่พอดี ส่งเปลี่ยนไซส์ได้ฟรีภายใน 7 วันหลังรับสินค้า
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">0 ความยุ่งยาก</div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mt-0.5">
                  Easy Care Fabric
                </div>
                <p className="text-xs text-white/70 mt-1">
                  เนื้อผ้ายับยาก คืนทรงไว ประหยัดเวลารีดเสื้อในทุกเช้าวันทำงาน
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mt-0.5">
                  QC มาตรฐานสากล
                </div>
                <p className="text-xs text-white/70 mt-1">
                  ช่างผู้ชำนาญการตรวจสอบความสมบูรณ์ของตะเข็บและกระดุมทุกตัวก่อนส่งมอบ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
