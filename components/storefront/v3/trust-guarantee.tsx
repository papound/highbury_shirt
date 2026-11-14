import Link from "next/link";
import { ShieldCheck, CheckCircle2, MessageSquare, QrCode } from "lucide-react";

export default function TrustGuarantee() {
  return (
    <section className="w-full py-16 sm:py-20 bg-[#F9FAFB] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172B] tracking-tight">
            ความมั่นใจในการบริการ
          </h2>
          <p className="text-sm text-[#79716B] mt-1">
            มาตรฐานการดูแลลูกค้าที่ Highbury ยึดถือปฏิบัติอย่างเคร่งครัด
          </p>
        </div>

        {/* 4 Clean Solid Cards (No frosted glass, no stock shadows, no emoji) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-xl border border-[#E7E5E4] bg-white flex flex-col justify-between space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] text-[#163666] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172B]">
                เปลี่ยนไซส์ฟรี 7 วัน
              </h3>
              <p className="text-xs text-[#79716B] mt-1 leading-relaxed">
                สั่งซื้อไปแล้วใส่ไม่พอดี สามารถติดต่อขอเปลี่ยนไซส์ได้ฟรีภายใน 7 วัน
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#E7E5E4] bg-white flex flex-col justify-between space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] text-[#163666] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172B]">
                ตรวจสอบคุณภาพทุกชิ้น
              </h3>
              <p className="text-xs text-[#79716B] mt-1 leading-relaxed">
                ทีมช่างตรวจสอบความสมบูรณ์ของกระดุมและตะเข็บก่อนบรรจุจัดส่ง
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#E7E5E4] bg-white flex flex-col justify-between space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] text-[#163666] flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172B]">
                Thai QR PromptPay
              </h3>
              <p className="text-xs text-[#79716B] mt-1 leading-relaxed">
                รองรับการชำระเงินสะดวกและปลอดภัยผ่านระบบสแกน QR มาตรฐาน
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#E7E5E4] bg-white flex flex-col justify-between space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] text-[#163666] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172B]">
                ปรึกษาช่างและแอดมิน
              </h3>
              <p className="text-xs text-[#79716B] mt-1 leading-relaxed">
                ให้คำแนะนำเรื่องไซส์และเนื้อผ้าอย่างตรงไปตรงมาผ่าน LINE Official
              </p>
            </div>
          </div>
        </div>

        {/* Clean Contact Callout */}
        <div className="mt-8 p-6 rounded-xl border border-[#E7E5E4] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#0F172B]">
              ต้องการสอบถามขนาดเสื้อหรือสั่งผลิตจำนวนมาก?
            </h3>
            <p className="text-xs text-[#79716B] mt-0.5">
              ทีมงานยินดีให้ข้อมูลและประเมินราคาตามจำนวนที่ต้องการ
            </p>
          </div>
          <Link
            href="https://lin.ee/highbury"
            target="_blank"
            rel="noopener noreferrer"
            className="v3-btn-brand shrink-0"
          >
            <span>ติดต่อ LINE Official</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
