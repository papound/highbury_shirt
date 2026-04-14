import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Factory, Shirt, Users, Globe, MapPin } from "lucide-react";

export const metadata = {
  title: "เกี่ยวกับเรา",
  description: "ประวัติความเป็นมาและปรัชญาของ Highbury International",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 space-y-16 md:space-y-24">
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
          เกี่ยวกับ Highbury International
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          ผู้เชี่ยวชาญด้านเสื้อเชิ้ตสำเร็จรูป
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          ความใส่ใจในทุกฝีเข็ม เพื่อส่งมอบเสื้อเชิ้ตคุณภาพสูงที่ตอบโจทย์ทุกไลฟ์สไตล์ 
          ให้คุณมั่นใจในทุกโอกาสสำคัญ
        </p>
      </section>

      {/* 2. Story / Origin */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
          {/* You can replace this placeholder with an actual image of the factory or team */}
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <Factory className="w-32 h-32" />
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">จากประสบการณ์ สู่ความเชี่ยวชาญ</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Highbury International ก่อตั้งขึ้นจากความมุ่งมั่นที่จะยกระดับมาตรฐานเสื้อเชิ้ตในประเทศไทย 
              เรารวมเอาประณีตศิลป์ในการตัดเย็บผสมผสานกับเทคโนโลยีการผลิตที่ทันสมัย 
              เพื่อให้ได้เสื้อเชิ้ตที่ทรงสวย สวมใส่สบาย และทนทาน
            </p>
            <p>
              ด้วยประสบการณ์ในอุตสาหกรรมเครื่องนุ่งห่ม เราเข้าใจถึงความต้องการที่หลากหลาย 
              จึงได้พัฒนาแพทเทิร์นที่เหมาะสมกับสรีระ พร้อมคัดสรรเนื้อผ้าคุณภาพสูง 
              เพื่อส่งมอบความมั่นใจให้กับลูกค้าทุกท่าน
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div>
              <p className="text-4xl font-bold text-primary">20+</p>
              <p className="text-sm text-muted-foreground mt-1">ไซส์และสีให้เลือก</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">100k+</p>
              <p className="text-sm text-muted-foreground mt-1">ความไว้วางใจจากลูกค้า</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="bg-slate-50 rounded-3xl p-8 md:p-16">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl font-bold">ปณิธานของเรา</h2>
          <p className="text-muted-foreground">สิ่งที่เรายึดมั่นและใส่ใจในทุกขั้นตอน</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Shirt className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">คุณภาพต้องมาก่อน</h3>
              <p className="text-muted-foreground">
                คัดสรรวัตถุดิบและเนื้อผ้าอย่างพิถีพิถัน ผ่านกระบวนการควบคุมคุณภาพที่เข้มงวดในทุกขั้นตอนการผลิต
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">ความหลากหลายที่ตอบโจทย์</h3>
              <p className="text-muted-foreground">
                มีแพทเทิร์นสำหรับทั้งชายและหญิง พร้อมไซส์ที่ครอบคลุมและหลากหลายเฉดสี เพื่อทุกสไตล์ของคุณ
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">บริการด้วยความจริงใจ</h3>
              <p className="text-muted-foreground">
                เราถือว่าทุกความคิดเห็นของลูกค้าคือส่วนสำคัญในการพัฒนา และพร้อมให้บริการอย่างเป็นมิตรเสมอ
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Contact / Shop Action */}
      <section className="text-center max-w-2xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold">สัมผัสประสบการณ์ตรงด้วยตัวคุณเอง</h2>
        <p className="text-muted-foreground">
          เลือกชมคอลเลกชันเสื้อเชิ้ตล่าสุดของเราได้แล้ววันนี้ พร้อมโปรโมชันพิเศษเมื่อสั่งซื้อผ่านช่องทางออนไลน์
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/products" 
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            เลือกชมสินค้า
          </a>
          <a 
            href="/contact" 
            className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            ติดต่อสอบถาม
          </a>
        </div>
      </section>
    </div>
  );
}
