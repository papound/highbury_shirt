import Link from "next/link";
import { ShieldCheck, Scissors, Truck, MessageCircle } from "lucide-react";

const guarantees = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "รับประกันเปลี่ยนไซส์ฟรี 7 วัน",
    desc: "สั่งซื้อไปแล้วใส่ไม่พอดี สามารถติดต่อขอเปลี่ยนขนาดเสื้อได้ฟรีภายใน 7 วันหลังได้รับสินค้า",
  },
  {
    icon: <Scissors className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    title: "มาตรฐานการตัดเย็บประณีต",
    desc: "ดูแลการผลิตโดยช่างชำนาญการ แพทเทิร์นเข้ารูปสมส่วน และตรวจสอบคุณภาพ QC ละเอียดทุกชิ้น",
  },
  {
    icon: <Truck className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    title: "จัดส่งทั่วประเทศอย่างปลอดภัย",
    desc: "บรรจุกล่องพัสดุป้องกันการยับ จัดส่งรวดเร็วพร้อมแจ้งรหัสติดตามพัสดุชัดเจน",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    title: "ปรึกษาผู้เชี่ยวชาญผ่าน LINE",
    desc: "มีทีมงานพร้อมให้คำแนะนำเรื่องขนาดเสื้อ สไตล์ และการเลือกเนื้อผ้าให้เหมาะกับคุณ",
  },
];

export default function TrustGuarantee() {
  return (
    <section className="w-full py-16 md:py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Highbury Commitment
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-2 tracking-tight">
            ความมั่นใจในทุกคำสั่งซื้อ
          </h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            เรามุ่งมั่นส่งมอบเสื้อเชิ้ตที่ใส่สบายและบริการที่จริงใจ
            เพื่อให้คุณมั่นใจในทุกครั้งที่สวมใส่ Highbury
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl border border-border/80 bg-background flex flex-col justify-between space-y-4 hover:border-blue-500/30 transition-[border-color] duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* LINE Contact Callout */}
        <div className="mt-10 p-6 rounded-2xl bg-[#0A2540] dark:bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-base text-white">ต้องการสอบถามขนาดเสื้อเพิ่มเติม?</h3>
            <p className="text-xs text-white/75 mt-0.5">
              ทีมงานยินดีช่วยวัดไซส์และแนะนำรุ่นเสื้อเชิ้ตที่เหมาะสมกับคุณ
            </p>
          </div>
          <Link
            href="https://lin.ee/highbury"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>ติดต่อทาง LINE Official</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
