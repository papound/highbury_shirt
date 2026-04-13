import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Clock, Star, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[var(--brand-dark)] via-[var(--brand-navy)] to-[var(--brand-blue)] overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="container mx-auto px-4 py-24 md:py-40 relative">
          <div className="max-w-3xl text-white">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6">
              เสื้อเชิ้ต
              <br />
              <span className="text-[var(--brand-blue)] drop-shadow-lg">
                HIGHBURY
              </span>
              <br />
              คุณภาพระดับสากล
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              เสื้อเชิ้ตสำเร็จรูปสำหรับผู้ชายและผู้หญิง คุณภาพสูง หลากสีสัน
              หลายไซส์ ส่งตรงถึงมือคุณ
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-white text-[var(--brand-dark)] hover:bg-white/90 font-semibold" asChild>
                <Link href="/products">
                  ดูสินค้าทั้งหมด
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/15 hover:text-white" asChild>
                <Link href="/about">เกี่ยวกับเรา</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Promotion Banner ──────────────────────────────────────────── */}
      {promotions.length > 0 && (
        <section className="bg-amber-50 border-y border-amber-200 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-amber-800">
              <span>🎉</span>
              {promotions.map((p) => (
                <span key={p.id}>{p.nameTh ?? p.name}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ Icon, titleTh, descTh }) => (
              <div key={titleTh} className="flex flex-col items-center text-center gap-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{titleTh}</h3>
                <p className="text-xs text-muted-foreground">{descTh}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">หมวดหมู่สินค้า</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Button key={cat.id} variant="outline" size="lg" asChild>
                  <Link href={`/products?category=${cat.slug}`}>
                    {cat.nameTh}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">สินค้าแนะนำ</h2>
              <Button variant="ghost" asChild>
                <Link href="/products">
                  ดูทั้งหมด <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => {
                const primaryImage = product.images[0];
                const minPrice = Math.min(...product.variants.map((v) => v.price));
                const maxPrice = Math.max(...product.variants.map((v) => v.price));
                const colors = [...new Set(product.variants.map((v) => v.color))];
                const sizes = [...new Set(product.variants.map((v) => v.size))];
                return (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <Link href={`/products/${product.slug}`}>
                        <div className="aspect-square relative overflow-hidden bg-gray-100">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.altText ?? product.nameTh}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-2">
                              <Shirt className="w-12 h-12 text-slate-300" strokeWidth={1} />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">{product.category.nameTh}</p>
                          <h3 className="font-medium text-sm leading-tight line-clamp-2">{product.nameTh}</h3>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {colors.slice(0, 4).map((c) => (
                              <span key={c} className="text-xs bg-secondary px-1.5 py-0.5 rounded">{c}</span>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{sizes.join(" / ")}</p>
                        </div>
                      </Link>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex items-center justify-between">
                      <span className="font-semibold text-primary text-sm">
                        {minPrice === maxPrice
                          ? `฿${minPrice.toLocaleString()}`
                          : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
                      </span>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/products/${product.slug}`}>ดูสินค้า</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#1c3fc0]">
        <div className="container mx-auto px-4 max-w-lg">
          <p className="text-white/80 text-center text-lg mb-1">สนใจสั่งซื้อสินค้า</p>
          <h2 className="text-white text-center text-3xl font-bold mb-10">หรือสอบถามเพิ่มเติม</h2>
          <div className="flex flex-col gap-4">
            {/* Phone */}
            <a
              href="tel:028968066"
              className="flex items-center gap-4 bg-white rounded-full px-5 py-4 shadow hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#22c55e] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="font-medium text-gray-800 text-lg">02-896-8066 ต่อ 9</span>
            </a>

            {/* Email */}
            <a
              href="mailto:thong_than@hotmail.com"
              className="flex items-center gap-4 bg-white rounded-full px-5 py-4 shadow hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#ef4444] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </span>
              <span className="font-medium text-gray-800">thong_than@hotmail.com</span>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/highbury.shirt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-full px-5 py-4 shadow hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877f2] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>
              <span className="font-medium text-gray-800">highbury.shirt</span>
            </a>

            {/* LINE */}
            <a
              href="https://line.me/ti/p/@highbury"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-full px-5 py-4 shadow hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00b900] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.022.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </span>
              <span className="font-medium text-gray-800">@highbury</span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/highburyshirt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-full px-5 py-4 shadow hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full shrink-0" style={{background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </span>
              <span className="font-medium text-gray-800">@highburyshirt</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-16 bg-[var(--brand-navy)] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            &ldquo;รับผลิต-สั่งทำ ชุดยูนิฟอร์ม&rdquo;
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            ผลิตเสื้อเชิ้ตตามแบบที่คุณต้องการ ทั้งโลโก้ ผ้า และสี
            รับออเดอร์ตั้งแต่ 25 ตัวขึ้นไป ส่งตรงถึงองค์กรของคุณ
          </p>
          <Button size="lg" className="bg-white text-[var(--brand-dark)] hover:bg-white/90 font-semibold">
            <Link href="/contact">ติดต่อเรา</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
