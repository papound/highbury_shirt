import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Clock, Star, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, status: "ACTIVE" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      variants: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

async function getActivePromotions() {
  const now = new Date();
  return prisma.promotion.findMany({
    where: {
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    take: 3,
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

const features = [
  {
    Icon: Truck,
    titleTh: "จัดส่งทั่วประเทศ",
    titleEn: "Nationwide Delivery",
    descTh: "ส่งด่วน รวดเร็ว ถึงมือคุณ",
    descEn: "Fast delivery across Thailand",
  },
  {
    Icon: Shield,
    titleTh: "รับประกันคุณภาพ",
    titleEn: "Quality Guaranteed",
    descTh: "วัสดุเกรด A คุณภาพสูง",
    descEn: "Premium Grade A materials",
  },
  {
    Icon: Clock,
    titleTh: "รับผลิต-OEM",
    titleEn: "Custom OEM",
    descTh: "รับงานสั่งทำตามต้องการ",
    descEn: "Custom manufacturing available",
  },
  {
    Icon: Star,
    titleTh: "ลูกค้าพึงพอใจ",
    titleEn: "Customer Satisfaction",
    descTh: "บริการที่ใส่ใจทุกรายละเอียด",
    descEn: "Attentive service at every step",
  },
];

export default async function HomePage() {
  const [featuredProducts, promotions, categories] = await Promise.all([
    getFeaturedProducts(),
    getActivePromotions(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col mx-auto w-full">
      {/* ── Promotion Banner ──────────────────────────────────────────── */}
      {promotions.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-fuchsia-600 to-indigo-600 text-white shadow-lg z-10">
          {/* Animated subtle pattern overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
          
          <div className="container relative mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              <span className="text-xl sm:text-2xl animate-pulse">✨</span>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                {promotions.map((p) => (
                  <span 
                    key={p.id} 
                    className="text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase drop-shadow-md"
                  >
                    {p.nameTh ?? p.name}
                  </span>
                ))}
              </div>
              
              <span className="text-xl sm:text-2xl animate-pulse delay-75">✨</span>
            </div>
            
            {/* Action text */}
            <div className="mt-1 text-center text-xs sm:text-sm font-medium text-white/90 uppercase tracking-widest">
              ช้อปเลย! สิทธิพิเศษมีจำนวนจำกัด
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-32 md:pt-40 md:pb-48">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1920&q=80"
            alt="Premium shirts background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Gradient Overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95 md:from-white/80 md:via-white/60 md:to-white/95" />
          <div className="absolute inset-0 bg-slate-900/10" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 border-none transition-colors shadow-sm">
            เสื้อเชิ้ตคุณภาพระดับสากล
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight drop-shadow-sm">
            ยกระดับบุคลิกภาพกับ <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 drop-shadow-sm">
              HIGHBURY
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            เสื้อเชิ้ตสำเร็จรูปสำหรับผู้ชายและผู้หญิง ตัดเย็บด้วยความประณีต หลากสีสัน หลายไซส์ พร้อมส่งตรงถึงมือคุณแล้ววันนี้
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-md h-14 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1" asChild>
              <Link href="/products">
                เลือกซื้อสินค้า
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-md h-14 bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white text-slate-700 transition-all hover:-translate-y-1 shadow-sm" asChild>
              <Link href="/about">เกี่ยวกับเรา</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ Icon, titleTh, descTh }) => (
              <div key={titleTh} className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1.5">{titleTh}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{descTh}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">หมวดหมู่สินค้า</h2>
              <div className="h-1 w-12 bg-blue-600 mt-4 rounded-full" />
            </div>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative px-6 py-3.5 bg-white border border-slate-200 rounded-full hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-sm sm:text-base font-medium text-slate-700 hover:text-blue-600"
                >
                  {cat.nameTh}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">สินค้าแนะนำ</h2>
                <p className="text-slate-500">คัดสรรคอลเลกชันที่ดีที่สุดสำหรับคุณ</p>
              </div>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                <Link href="/products">
                  ดูทั้งหมด <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => {
                const primaryImage = product.images[0];
                const minPrice = Math.min(...product.variants.map((v) => v.price));
                const maxPrice = Math.max(...product.variants.map((v) => v.price));
                const colors = [...new Set(product.variants.map((v) => v.color))];
                const sizes = [...new Set(product.variants.map((v) => v.size))];
                return (
                  <Card key={product.id} className="group overflow-hidden border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
                    <CardContent className="p-0">
                      <Link href={`/products/${product.slug}`}>
                        <div className="aspect-[4/5] relative overflow-hidden bg-slate-50">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.altText ?? product.nameTh}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-2">
                              <Shirt className="w-12 h-12 text-slate-300" strokeWidth={1} />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm border-none shadow-sm pointer-events-none">
                              แนะนำ
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-xs font-medium text-blue-600 mb-1">{product.category.nameTh}</p>
                          <h3 className="font-semibold text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{product.nameTh}</h3>
                          
                          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                            {colors.length > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="flex -space-x-1">
                                  {colors.slice(0, 3).map((c, i) => (
                                    <div key={i} className="w-3.5 h-3.5 rounded-full border border-white bg-slate-300" title={c} />
                                  ))}
                                </div>
                                <span>{colors.length} สี</span>
                              </div>
                            )}
                            {sizes.length > 0 && (
                              <div className="truncate">
                                {sizes.slice(0, 3).join(", ")}{sizes.length > 3 && ", ..."}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-col items-start gap-4">
                      <div className="font-bold text-lg text-slate-900 border-t border-slate-100 w-full pt-4 mt-1">
                        {minPrice === maxPrice
                          ? `฿${minPrice.toLocaleString()}`
                          : `฿${minPrice.toLocaleString()} - ฿${maxPrice.toLocaleString()}`}
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">พูดคุยกับเรา</h2>
            <p className="text-slate-600 text-lg">สอบถามข้อมูลเพิ่มเติม หรือสั่งซื้อสินค้าผ่านช่องทางที่คุณสะดวก</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="tel:028968066"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 hover:border-green-200 transition-all text-center group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-sm text-slate-500 font-medium mb-1">โทรศัพท์</div>
                <div className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors truncate w-full max-w-[120px]">02-896-8066</div>
              </div>
            </a>

            <a
              href="https://line.me/ti/p/@highbury"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 hover:border-[#00b900]/30 transition-all text-center group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#00b900]/10 text-[#00b900] group-hover:bg-[#00b900] group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.022.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-sm text-slate-500 font-medium mb-1">LINE Official</div>
                <div className="font-semibold text-slate-900 group-hover:text-[#00b900] transition-colors truncate w-full max-w-[120px]">@highbury</div>
              </div>
            </a>

            <a
              href="https://facebook.com/highbury.shirt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 hover:border-[#1877f2]/30 transition-all text-center group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1877f2]/10 text-[#1877f2] group-hover:bg-[#1877f2] group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-sm text-slate-500 font-medium mb-1">Facebook</div>
                <div className="font-semibold text-slate-900 group-hover:text-[#1877f2] transition-colors truncate w-full max-w-[120px]">highbury.shirt</div>
              </div>
            </a>

            <a
              href="mailto:thong_than@hotmail.com"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 hover:border-red-200 transition-all text-center group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-sm text-slate-500 font-medium mb-1">อีเมล</div>
                <div className="font-semibold text-slate-900 group-hover:text-red-500 transition-colors truncate w-full max-w-[120px]" title="thong_than@hotmail.com">thong_than</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-slate-900">
        {/* Abstract background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <svg className="absolute w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/30 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/10 text-white hover:bg-white/20 border-white/20 transition-colors">
            บริการรับสั่งทำ (OEM)
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            รับผลิตและสั่งทำชุดยูนิฟอร์มองค์กร
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            พร้อมบริการตัดเย็บเสื้อเชิ้ตตามแบบที่คุณต้องการ ทั้งออกแบบโลโก้ เลือกเนื้อผ้า และสีที่ใช่ รับออเดอร์เริ่มต้นเพียง 25 ตัว
          </p>
          <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-500 text-white text-md h-14 border-none shadow-lg shadow-blue-900/20" asChild>
            <Link href="/contact">ติดต่อสอบถามข้อมูล</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
