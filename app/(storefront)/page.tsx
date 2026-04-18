import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shirt, Shield, Wind, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, status: "ACTIVE" },
    include: {
      images: { where: { variantId: null }, orderBy: { sortOrder: "asc" }, take: 1 },
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
    Icon: Shirt,
    titleEn: "Premium Fabric",
    titleTh: "เนื้อผ้าพรีเมียม",
    descTh: "ผลิตจากเส้นใยคุณภาพสูง นุ่มสบาย ยับยาก และไม่ต้องรีดบ่อย ให้คุณดูดีได้ตลอดวัน",
  },
  {
    Icon: Shield,
    titleEn: "Perfect Fit",
    titleTh: "ทรงสวย พอดีตัว",
    descTh: "แพทเทิร์นถูกออกแบบมาเพื่อสรีระคนเอเชียโดยเฉพาะ คัตติ้งเนี้ยบ เข้าทรงแต่ไม่อึดอัด",
  },
  {
    Icon: Wind,
    titleEn: "Breathable Comfort",
    titleTh: "ระบายอากาศได้ดี",
    descTh: "ระบายอากาศและจัดการความชื้นได้ดีเป็นพิเศษ เหมาะกับสภาพอากาศร้อนอย่างประเทศไทย",
  },
];

const reviews = [
  {
    name: "คุณธนภัทร",
    text: "เนื้อผ้าดีมากครับ ซักแล้วแทบไม่ต้องรีด ทรงสวยถูกใจ ใส่ไปทำงานมั่นใจขึ้นเยอะเลยครับ",
  },
  {
    name: "คุณทิพย์สุดา",
    text: "ใส่สบาย ไม่ร้อนเลย เหมาะกับอากาศบ้านเรามาก แพทเทิร์นเชิ้ตผู้หญิงเข้ารูปกำลังสวย การตัดเย็บเนี้ยบเกินราคาจริงๆ ค่ะ",
  },
  {
    name: "คุณกิตติกร",
    text: "สั่งมา 3 ตัวแล้ว ทรงสวยพอดีตัวมาก แมทช์กับการแต่งตัวสุดๆ บริการจัดส่งก็ไวมากครับ ประทับใจ",
  },
];

export default async function HomePage() {
  const [featuredProducts, promotions, categories] = await Promise.all([
    getFeaturedProducts(),
    getActivePromotions(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col mx-auto w-full font-sans">
      {/* ── Top Bar (FOMO & Promo) ──────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white text-center py-2 px-4 text-sm font-medium tracking-wide">
        🔥 โปรโมชันพิเศษต้อนรับลูกค้าใหม่ จัดส่งฟรีเมื่อสั่งซื้อครบ 1,000 บาท!
      </div>

      {/* ── Promotion Banner (Optional) ──────────────────────────────────────── */}
      {promotions.length > 0 && (
        <div className="relative overflow-hidden bg-primary text-white shadow-md z-10 py-3 sm:py-4">
          <div className="container relative mx-auto px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-xl sm:text-2xl animate-pulse text-accent">✨</span>
                {promotions.map((p) => (
                  <span 
                    key={p.id} 
                    className="text-sm sm:text-base font-bold tracking-widest uppercase drop-shadow-md"
                  >
                    {p.nameTh ?? p.name}
                  </span>
                ))}
                <span className="text-xl sm:text-2xl animate-pulse delay-75 text-accent">✨</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40 bg-slate-50">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1920&q=80"
            alt="Highbury premium shirts"
            fill
            priority
            className="object-cover object-center md:object-[center_30%]"
            sizes="100vw"
          />
          {/* Gradient Overlay ensuring text is perfectly readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent md:from-white/95 md:via-white/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex items-center">
          <div className="max-w-2xl text-left">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-accent text-white hover:bg-accent/90 border-none transition-colors shadow-sm">
              NEW COLLECTION
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1] drop-shadow-sm">
              สะท้อนความสำเร็จ<br className="hidden md:block" />ในแบบคุณ ด้วยเชิ้ตที่ใช่
            </h1>
            <p className="text-lg md:text-xl text-slate-700 mb-10 leading-relaxed font-medium max-w-xl">
              เสื้อเชิ้ตดีไซน์ทันสมัยสำหรับทั้งผู้ชายและผู้หญิงยุคใหม่ คัตติ้งเนี้ยบ ทรงสวย พอดีตัว พร้อมเนื้อผ้าระบายอากาศได้ดีเยี่ยม ตอบโจทย์ทุกวันทำงานและทุกโอกาสของคุณ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button size="lg" className="rounded-lg px-8 bg-accent hover:bg-accent/90 text-white text-md h-14 shadow-lg transition-all hover:-translate-y-1 w-full sm:w-auto" asChild>
                <Link href="/products">
                  เลือกชมคอลเลกชันใหม่
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Trust Signals Under CTA */}
            <div className="mt-6 flex items-center gap-4 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>จัดส่งฟรี 1,000.- ขึ้นไป</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>เปลี่ยนไซส์ได้ฟรี</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Proposition / Features ─────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">
              ทำไมต้อง Highbury?
            </h2>
            <p className="text-lg text-slate-600">ความใส่ใจในทุกรายละเอียด คือสิ่งที่เรายึดมั่นเพื่อมอบเสื้อเชิ้ตที่ดีที่สุดให้กับคุณ</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map(({ Icon, titleTh, titleEn, descTh }) => (
              <div key={titleEn} className="flex flex-col items-center text-center gap-5 p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-2">
                  <Icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-1">{titleEn}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{titleTh}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">{descTh}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Showcase (Best Sellers) ────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">Signature Collection ของเรา</h2>
                <p className="text-lg text-slate-600">คอลเลกชันเสื้อเชิ้ตยอดนิยมที่ออกแบบมาเพื่อสไตล์ของคุณ</p>
              </div>
              <Button variant="outline" className="rounded-lg border-primary text-primary hover:bg-primary hover:text-white px-6 hidden md:flex transition-colors" asChild>
                <Link href="/products">
                  ดูสินค้าทั้งหมด <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map((product) => {
                const primaryImage = product.images[0];
                const minPrice = Math.min(...product.variants.map((v) => v.price));
                const maxPrice = Math.max(...product.variants.map((v) => v.price));
                const colors = [...new Set(product.variants.map((v) => v.color))];
                
                return (
                  <Card key={product.id} className="group overflow-hidden border-transparent hover:border-slate-200 hover:shadow-2xl transition-all duration-500 rounded-xl bg-white flex flex-col h-full relative">
                    <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col relative w-full h-full">
                      <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.altText ?? product.nameTh}
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-2">
                            <Shirt className="w-12 h-12 text-slate-300" strokeWidth={1} />
                          </div>
                        )}
                        {/* Hover Quick Action Overlay */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 z-10 flex items-end justify-center opacity-0 group-hover:opacity-100 pb-4">
                          <span className="bg-white text-primary text-sm font-semibold px-4 py-2 rounded-lg shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            ดูรายละเอียด
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1">
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{product.category.nameTh}</div>
                        <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.nameTh}</h3>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between">
                           <div className="font-bold text-lg text-primary">
                            {minPrice === maxPrice
                              ? `฿${minPrice.toLocaleString()}`
                              : `฿${minPrice.toLocaleString()} - ฿${maxPrice.toLocaleString()}`}
                          </div>
                          
                          {/* Color indicators */}
                          {colors.length > 0 && (
                             <div className="flex items-center gap-1">
                              <span className="text-xs text-slate-500 mr-1">{colors.length} สี</span>
                             </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Card>
                );
              })}
            </div>
            
            {/* Mobile View All Button */}
            <div className="text-center mt-8 md:hidden">
              <Button variant="outline" className="rounded-lg border-primary text-primary hover:bg-primary hover:text-white w-full" asChild>
                <Link href="/products">ดูสินค้าทั้งหมด</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── Categories ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <span className="px-4 py-2 font-semibold text-slate-700">หมวดหมู่สินค้า :</span>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="px-5 py-2 bg-slate-50 border border-slate-200 rounded-full hover:border-accent hover:text-accent font-medium text-slate-600 transition-colors text-sm sm:text-base shadow-sm hover:shadow"
                >
                  {cat.nameTh}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Social Proof & Trust ────────────────────────────────────────────── */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              เสียงตอบรับจากลูกค้าผู้ใช้งานจริง
            </h2>
            <p className="text-primary-foreground/80 text-lg">กว่า 10,000+ ความประทับใจ ที่เลือกใช้ Highbury</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <Card key={idx} className="bg-white/5 border-none text-white p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
                </div>
                <p className="text-lg leading-relaxed mb-6 font-medium text-white/90">"{review.text}"</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                     {review.name.charAt(0)}
                   </div>
                   <div>
                     <div className="font-semibold">{review.name}</div>
                     <div className="text-xs text-white/60 flex items-center gap-1">
                       <CheckCircle2 size={12} className="text-green-400" />
                       ลูกค้าที่ซื้อจริง (Verified Buyer)
                     </div>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom Call to Action ────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            พร้อมจะยกระดับสไตล์ของคุณหรือยัง?
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            สัมผัสความต่างของเสื้อเชิ้ต Highbury ได้แล้ววันนี้ พร้อมโปรโมชันพิเศษต้อนรับลูกค้าใหม่ ซื้อครบจบในที่เดียว
          </p>
          <Button size="lg" className="rounded-lg px-10 py-7 text-lg bg-accent hover:bg-accent/90 text-white shadow-xl hover:shadow-accent/40 transition-all hover:scale-105" asChild>
            <Link href="/products">
              เริ่มต้นการสั่งซื้อของคุณเลย
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
