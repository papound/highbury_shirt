import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MacroDetail() {
  return (
    <section className="w-full py-16 sm:py-20 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Real Fabric & Pattern Information */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172B] tracking-tight leading-tight">
              เนื้อผ้าคัดสรรและการดูแลรักษาง่าย
            </h2>

            <p className="text-sm sm:text-base text-[#79716B] leading-relaxed max-w-xl">
              Highbury เลือกใช้เนื้อผ้า Cotton, Poplin, Chambray และ Linen ที่ผ่านการทดสอบความทนทาน
              เนื้อผ้านุ่มสบาย ยับยาก คืนทรงไว สามารถซักตากแล้วสะบัดแขวนได้โดยแทบไม่ต้องรีด
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-lg border border-[#E7E5E4] bg-[#F9FAFB]">
                <div className="font-semibold text-sm text-[#0F172B]">
                  จัดการความชื้นและระบายอากาศ
                </div>
                <div className="text-xs text-[#79716B] mt-0.5">
                  เส้นใยธรรมชาติช่วยให้อากาศถ่ายเทได้สะดวก ไม่อับชื้นตลอดวันทำงาน
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-[#E7E5E4] bg-[#F9FAFB]">
                <div className="font-semibold text-sm text-[#0F172B]">
                  กระดุมและสาบเสื้อเย็บแน่นหนา
                </div>
                <div className="text-xs text-[#79716B] mt-0.5">
                  เย็บย้ำจุดรับแรงและรังดุมด้วยด้ายคุณภาพสูง ป้องกันการหลุดลุ่ยจากการใช้งานระยะยาว
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#163666] hover:text-[#0A2B5E] transition-colors"
              >
                <span>เลือกดูเสื้อเชิ้ตรุ่นต่างๆ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Real Product Photography */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7E5E4] bg-[#F8FAFC]">
              <Image
                src="/images/placeholders/women-ls.jpg"
                alt="เสื้อเชิ้ตผู้หญิง Highbury"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
