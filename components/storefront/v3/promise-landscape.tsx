import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Award, MessageCircle } from "lucide-react";

export default function PromiseLandscape() {
  return (
    <section id="promise" className="relative w-full py-28 lg:py-36 bg-[#0A0B0E] text-[#F8FAFC] overflow-hidden border-b border-white/[0.08]">
      {/* Background cinematic atmosphere matching Quantum coastal highway scene */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 40%, rgba(46, 144, 250, 0.35) 0%, transparent 60%), radial-gradient(circle at 90% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              OUR COMMITMENT
            </span>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.05]">
              Driven by
              <br />
              <span className="italic font-light text-white/90">Uncompromising Quality</span>
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl font-sans">
              เราให้ความสำคัญกับความพึงพอใจของคุณเป็นอันดับแรก เสื้อเชิ้ตทุกตัวผ่านการตัดเย็บ
              และตรวจเช็กคุณภาพอย่างเข้มงวด หากสั่งซื้อไปแล้วใส่ไม่พอดี
              สามารถติดต่อขอเปลี่ยนไซส์ได้ฟรีทันที
            </p>

            <div className="pt-2">
              <Link
                href="https://lin.ee/highbury"
                target="_blank"
                rel="noopener noreferrer"
                className="v3-btn-white"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>ปรึกษาทีมงานผ่าน LINE Official</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Metric Cards (Matching Quantum) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-start gap-5 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-mono text-3xl font-bold text-white">7 วัน</div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-1">
                  เปลี่ยนไซส์ฟรี
                </div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  สั่งไปแล้วใส่ไม่พอดี ส่งเปลี่ยนไซส์ได้ฟรีภายใน 7 วันหลังรับสินค้า
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-start gap-5 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="font-mono text-3xl font-bold text-white">0 ความยุ่งยาก</div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mt-1">
                  Easy Care Fabric
                </div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  เนื้อผ้ายับยาก คืนทรงไว ประหยัดเวลารีดเสื้อในทุกเช้าวันทำงาน
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-start gap-5 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="font-mono text-3xl font-bold text-white">100%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mt-1">
                  QC มาตรฐานสากล
                </div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
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
