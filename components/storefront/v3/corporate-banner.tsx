import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CorporateBanner() {
  return (
    <section id="oem" className="w-full py-16 sm:py-20 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#163666] bg-[#163666] text-white p-8 sm:p-12">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              บริการผลิตเสื้อเชิ้ตยูนิฟอร์มองค์กร และงาน OEM
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Highbury รองรับการสั่งตัดเสื้อเชิ้ตสำหรับบริษัท หน่วยงาน และแบรนด์เสื้อผ้า
              ด้วยทีมช่างตัดเย็บมืออาชีพและการควบคุมคุณภาพมาตรฐาน
            </p>

            {/* Concrete Highbury Manufacturing Details (From real business copy) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2 border-t border-white/15">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  3,500 ตัว/เดือน
                </div>
                <div className="text-xs text-white/75 mt-0.5">
                  กำลังการผลิตรองรับ
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  100 ตัว
                </div>
                <div className="text-xs text-white/75 mt-0.5">
                  เริ่มต้นต่อไซส์และสี
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  3 - 4 สัปดาห์
                </div>
                <div className="text-xs text-white/75 mt-0.5">
                  ระยะเวลาผลิตมาตรฐาน
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3 items-center">
              <a
                href="mailto:contact@highbury.co.th"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#163666] font-bold text-sm hover:bg-[#F9FAFB] transition-colors"
              >
                <span>ขอใบเสนอราคาและปรึกษางานผลิต</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                <span>เกี่ยวกับโรงงาน</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
