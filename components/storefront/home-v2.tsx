import Link from "next/link";
import Image from "next/image";
import { Shirt } from "lucide-react";
import { Prisma } from "@prisma/client";
import { Reveal, Marquee, FloatingBlobs, TiltCard, Typewriter } from "./home-v2-animations";

// ---------- types ----------
type FeaturedProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    category: true;
  };
}>;

type Category = Prisma.CategoryGetPayload<Record<string, never>>;

interface HomeV2Props {
  featuredProducts: FeaturedProduct[];
  categories: Category[];
}

// ---------- static data ----------
const heroCards = [
  { icon: "👔", title: "เสื้อเชิ้ตผู้ชาย", sub: "Oxford · Poplin · Chambray · Linen", href: "/products?category=mens-shirts" },
  { icon: "👗", title: "เสื้อเชิ้ตผู้หญิง", sub: "Slim Fit · Regular Fit · Oversized", href: "/products?category=womens-shirts" },
  { icon: "🎨", title: "หลากหลายรูปแบบ", sub: "ผ้าสีพื้น · ลายริ้ว · ลายสก็อต", href: "/products" },
  { icon: "📐", title: "ไซส์ครบทุกรูปทรง", sub: "XS · S · M · L · XL · 2XL · 3XL · 4XL", href: "/products" },
  { icon: "✂️", title: "คัตติ้งเนี้ยบ พอดีตัว", sub: "แพทเทิร์นออกแบบสำหรับสรีระคนไทย", href: "/products" },
];

const trustItems = [
  { icon: "🧵", label: "เนื้อผ้าพรีเมียม" },
  { icon: "✂️", label: "ตัดเย็บโดยช่างมืออาชีพ" },
  { icon: "📐", label: "แพทเทิร์นสำหรับคนไทย" },
  { icon: "💨", label: "ระบายอากาศได้ดี" },
  { icon: "🔄", label: "เปลี่ยนไซส์ได้ฟรี" },
  { icon: "📦", label: "จัดส่งทั่วประเทศ" },
];

const aboutStats = [
  { icon: "🏭", num: "พรีเมียม", label: "เนื้อผ้าคัดสรร", accent: "" },
  { icon: "🏆", num: "Expert", label: "ช่างตัดเย็บมืออาชีพ", accent: "red" },
  { icon: "🎨", num: "หลาก", label: "สีสันให้เลือก", accent: "gold" },
  { icon: "📏", num: "7+", label: "ไซส์ครบทุกรูปทรง", accent: "" },
];

const features = [
  {
    icon: "🧵",
    titleEn: "Premium Fabric",
    titleTh: "เนื้อผ้าพรีเมียม",
    desc: "ผลิตจากเส้นใยคุณภาพสูง นุ่มสบาย ยับยาก ไม่ต้องรีดบ่อย ให้คุณดูดีได้ตลอดวัน",
  },
  {
    icon: "✂️",
    titleEn: "Perfect Cut",
    titleTh: "คัตติ้งเนี้ยบ พอดีตัว",
    desc: "แพทเทิร์นออกแบบมาเพื่อสรีระคนเอเชียโดยเฉพาะ ทรงสวย เข้ารูปแต่ไม่อึดอัด",
  },
  {
    icon: "💨",
    titleEn: "Breathable Comfort",
    titleTh: "ระบายอากาศได้ดี",
    desc: "จัดการความชื้นได้ดีเป็นพิเศษ เหมาะกับสภาพอากาศร้อนอย่างประเทศไทย",
  },
  {
    icon: "🎨",
    titleEn: "Versatile Style",
    titleTh: "สไตล์หลากหลาย",
    desc: "ดีไซน์ทันสมัย แมทช์ได้กับทุก Look ทั้งงานทางการและลำลอง",
  },
];

const reviews = [
  {
    name: "คุณธนภัทร",
    role: "วิศวกร",
    text: "เนื้อผ้าดีมากครับ ซักแล้วแทบไม่ต้องรีด ทรงสวยถูกใจ ใส่ไปทำงานมั่นใจขึ้นเยอะเลย",
  },
  {
    name: "คุณทิพย์สุดา",
    role: "นักออกแบบ",
    text: "ใส่สบาย ไม่ร้อนเลย เหมาะกับอากาศบ้านเรามาก เชิ้ตผู้หญิงเข้ารูปกำลังสวยค่ะ",
  },
  {
    name: "คุณกิตติกร",
    role: "ผู้จัดการ",
    text: "สั่งมา 3 ตัวแล้ว ทรงสวยพอดีตัวมาก แมทช์กับการแต่งตัวสุดๆ บริการจัดส่งก็ไวมาก",
  },
];

const faqItems = [
  {
    q: "Highbury ใช้เนื้อผ้าอะไรในการผลิต?",
    a: "เราใช้เนื้อผ้าคุณภาพพรีเมียมหลายประเภท ได้แก่ Cotton, Cotton-Blend, Poplin, Chambray และ Linen ทุกชนิดผ่านการคัดสรรเพื่อความนุ่มสบายและทนทาน",
  },
  {
    q: "ไซส์เสื้อ Highbury เหมาะกับสรีระแบบไหน?",
    a: "แพทเทิร์นของเราออกแบบมาเพื่อสรีระคนเอเชียโดยเฉพาะ มีหลายไซส์ตั้งแต่ XS ถึง 3XL พร้อมตาราง Size Guide ละเอียดให้ดูก่อนสั่ง",
  },
  {
    q: "สามารถเปลี่ยนหรือคืนสินค้าได้ไหม?",
    a: "สามารถเปลี่ยนไซส์ได้ฟรีภายใน 14 วัน (สินค้าต้องอยู่ในสภาพดีไม่ผ่านการใช้งาน) โดยแจ้งผ่าน Line หรืออีเมลของเรา",
  },
  {
    q: "จัดส่งให้ในกี่วัน?",
    a: "จัดส่งทั่วประเทศ ใช้เวลา 2-3 วันทำการหลังจากชำระเงิน สำหรับ Bangkok และปริมณฑล บางออเดอร์จัดส่งวันถัดไป",
  },
];

const oemFeatures = [
  { icon: "🏭", title: "กำลังผลิต", desc: "ขั้นต่ำ 3,500 ตัว/เดือน รองรับออเดอร์จำนวนมาก" },
  { icon: "📋", title: "MOQ ยืดหยุ่น", desc: "เริ่มต้นที่ 100 ตัวต่อไซส์/สี" },
  { icon: "✅", title: "QC เข้มงวด", desc: "ตรวจสอบคุณภาพทุกชิ้นก่อนส่ง" },
  { icon: "⏱️", title: "Lead Time", desc: "ผลิตเสร็จภายใน 3–4 สัปดาห์" },
];

const uniformFeatures = [
  { icon: "🎨", title: "ปักโลโก้ / พิมพ์ลาย", desc: "สีและดีไซน์ตามแบรนด์องค์กร" },
  { icon: "📏", title: "วัดไซส์รายบุคคล", desc: "ครอบคลุมทุกรูปทรง XS–4XL" },
  { icon: "💼", title: "ราคา Bulk พิเศษ", desc: "ราคาลดหลั่นตามจำนวนสั่ง" },
  { icon: "🚀", title: "จัดส่งถึงองค์กร", desc: "ตรงเวลา ครบถ้วน ตามที่ตกลงไว้" },
];

// ---------- Shared: Section label ----------
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 text-[13px] text-[#1A6CC8] font-bold tracking-[0.2em] uppercase mb-3">
      <span className="w-7 h-[3px] bg-[#D42B2B] rounded-full" />
      {children}
    </div>
  );
}

// ---------- Main Component ----------
export default function HomeV2({ featuredProducts, categories }: HomeV2Props) {
  return (
    <div className="flex flex-col w-full">

      {/* ─────────────────── HERO ─────────────────── */}
      <section
        className="min-h-[calc(100vh-80px)] grid md:grid-cols-2 items-center overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #F5F9FF 0%, #E8F2FC 60%, #C8DDFA 100%)" }}
      >
        {/* Radial bg pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(26,108,200,0.07) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(10,43,94,0.05) 0%, transparent 40%)",
          }}
        />
        {/* Dark navy diagonal right panel */}
        <div
          className="absolute top-0 right-0 hidden md:block h-full bg-[#0A2B5E]"
          style={{ width: "55%", clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />

        {/* Left: text content */}
        <div className="relative z-10 px-8 md:px-[7vw] py-20">
          {/* Eyebrow */}
          <div className="v2-hero-anim v2-hero-anim-d1 inline-flex items-center gap-2 bg-[rgba(10,43,94,0.08)] border border-[rgba(10,43,94,0.15)] text-[#0A2B5E] px-4 py-1.5 rounded-full text-[13px] font-bold tracking-[0.1em] uppercase mb-6">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            เสื้อเชิ้ตคุณภาพพรีเมียม · ออกแบบสำหรับคนไทย
          </div>

          {/* Headline */}
          <h1
            className="v2-hero-anim v2-hero-anim-d2 font-black leading-[1.15] text-[#0A2B5E] mb-5"
            style={{ fontSize: "clamp(28px, 3.8vw, 54px)" }}
          >
            ดูดีได้ <span className="v2-shimmer-text">ทุกวัน</span>
            <br />
            ด้วยเสื้อเชิ้ต
            <br />
            <Typewriter
              texts={["ที่ใช่สำหรับคุณ", "ที่ทำให้คุณมั่นใจ", "ที่ใส่สบายทั้งวัน"]}
              className="text-[#1A6CC8]"
            />
          </h1>

          {/* Sub headline */}
          <p
            className="v2-hero-anim v2-hero-anim-d3 text-[#3D5278] leading-[1.8] mb-9 max-w-[460px]"
            style={{ fontSize: "clamp(16px, 1.5vw, 19px)" }}
          >
            Highbury International มุ่งมั่นสร้างเสื้อเชิ้ตคุณภาพสูงจากเนื้อผ้าพรีเมียม
            คัตติ้งเนี้ยบ ทรงสวย พอดีตัว ออกแบบมาเพื่อสรีระคนเอเชียโดยเฉพาะ
          </p>

          {/* Stats row */}
          <div className="v2-hero-anim v2-hero-anim-d4 flex gap-7 mb-9">
            <div className="pr-7 border-r border-[#C8D8EE]">
              <div className="text-2xl font-black text-[#0A2B5E] leading-none">
                หลาย<span className="text-[#D42B2B]">สี</span>
              </div>
              <div className="text-[13px] text-[#4A6080] mt-1 font-medium">สีสันให้เลือกมากมาย</div>
            </div>
            <div className="pr-7 border-r border-[#C8D8EE]">
              <div className="text-2xl font-black text-[#0A2B5E] leading-none">
                7<span className="text-[#D42B2B]">+</span>
              </div>
              <div className="text-[13px] text-[#4A6080] mt-1 font-medium">ไซส์ครบทุกรูปทรง</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#0A2B5E] leading-none">พรีเมียม</div>
              <div className="text-[13px] text-[#4A6080] mt-1 font-medium">เนื้อผ้าอย่างดี</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="v2-hero-anim v2-hero-anim-d5 flex gap-3 flex-wrap">
            <Link
              href="/products"
              className="v2-btn-pulse inline-flex items-center gap-2 bg-[#0A2B5E] text-white px-7 py-3 rounded-md font-bold text-[17px] transition-all duration-200 hover:bg-[#2255A0] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(10,43,94,0.3)]"
            >
              ดูสินค้าทั้งหมด →
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border-2 border-[#0A2B5E] text-[#0A2B5E] px-7 py-3 rounded-md font-bold text-[17px] transition-all duration-200 hover:bg-[#0A2B5E] hover:text-white"
            >
              เลือกตามหมวดหมู่
            </Link>
          </div>
        </div>

        {/* Right: floating product cards on dark panel */}
        <div className="relative z-10 px-[3vw] py-16 hidden md:block">
          <div className="flex flex-col gap-2.5">
            {heroCards.map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className="v2-hero-card-anim block bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 flex items-center gap-3.5 hover:bg-white/[0.18] hover:-translate-x-1 hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              >
                <div className="w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <div className="font-bold text-[15px] text-white mb-0.5">{card.title}</div>
                  <div className="text-[13px] text-white/65">{card.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── TRUST BAR (Marquee) ─────────────────── */}
      <div className="bg-[#0A2B5E] py-4 px-0 overflow-hidden">
        <Marquee speed={25} className="py-1">
          {trustItems.map((t, i) => (
            <div key={i} className="flex items-center gap-2.5 text-white/85 text-[15px] font-semibold">
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </div>
          ))}
        </Marquee>
      </div>

      {/* ─────────────────── ABOUT ─────────────────── */}
      <section className="py-[88px] px-[5vw] bg-white relative overflow-hidden">
        <FloatingBlobs />
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          {/* Stats grid */}
          <Reveal direction="left">
            <div className="grid grid-cols-2 gap-4 v2-stagger">
              {aboutStats.map((stat, i) => (
                <TiltCard key={i}>
                  <div
                    className={`relative overflow-hidden rounded-xl px-6 py-7 text-center border border-[#C8D8EE] bg-[#F5F9FF] hover:border-[#1A6CC8] hover:shadow-[0_4px_20px_rgba(26,108,200,0.12)] transition-all duration-300 ${
                      stat.accent === "red" ? "before:bg-[#D42B2B]" : stat.accent === "gold" ? "before:bg-[#E8A800]" : "before:bg-[#1A6CC8]"
                    }`}
                style={{
                  "--tw-before-bg":
                    stat.accent === "red" ? "#D42B2B" : stat.accent === "gold" ? "#E8A800" : "#1A6CC8",
                } as React.CSSProperties}
              >
                {/* top color bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                  style={{
                    background:
                      stat.accent === "red" ? "#D42B2B" : stat.accent === "gold" ? "#E8A800" : "#1A6CC8",
                  }}
                />
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-[#0A2B5E] leading-none">{stat.num}</div>
                <div className="text-[15px] text-[#3D5278] mt-1.5 font-medium">{stat.label}</div>
              </div>
              </TiltCard>
              ))}
            </div>
          </Reveal>

          {/* Text content */}
          <Reveal direction="right" delay={200}>
            <SectionLabel>เกี่ยวกับเรา</SectionLabel>
            <h2
              className="font-black text-[#0A2B5E] leading-[1.2] mb-4"
              style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
            >
              Highbury International
              <br />
              เสื้อเชิ้ตพรีเมียมสำหรับคนไทย
            </h2>
            <p className="text-[18px] text-[#3D5278] leading-[1.85] mb-6">
              เราคือแบรนด์เสื้อเชิ้ตคุณภาพสูงที่ออกแบบและตัดเย็บโดยช่างมืออาชีพ
              ด้วยความใส่ใจในทุกรายละเอียดตั้งแต่การเลือกเนื้อผ้า การออกแบบแพทเทิร์น
              ไปจนถึงการตัดเย็บขั้นสุดท้าย เพื่อให้คุณได้รับเสื้อเชิ้ตที่ดีที่สุด
            </p>
            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {["เสื้อเชิ้ตผู้ชาย", "เสื้อเชิ้ตผู้หญิง", "Cotton Premium", "Poplin", "Chambray", "Linen"].map((p) => (
                <span
                  key={p}
                  className="bg-[#E8F2FC] border border-[#C8DDFA] text-[#0A2B5E] text-[15px] font-semibold px-4 py-1.5 rounded-full"
                >
                  {p}
                </span>
              ))}
              {["จัดส่งทั่วประเทศ", "เปลี่ยนไซส์ได้ฟรี"].map((p) => (
                <span
                  key={p}
                  className="bg-[#FFF0F0] border border-[#FFCACA] text-[#D42B2B] text-[15px] font-semibold px-4 py-1.5 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── FEATURED PRODUCTS ─────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-[88px] px-[5vw] bg-[#F5F9FF] relative overflow-hidden">
          <FloatingBlobs />
          <div className="max-w-[1200px] mx-auto relative z-10">
            <Reveal>
              <div className="mb-14">
                <SectionLabel>สินค้าแนะนำ</SectionLabel>
              <h2
                className="font-black text-[#0A2B5E] leading-[1.2] mb-3"
                style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
              >
                Signature Collection ของเรา
                <br />
                <span className="text-[#1A6CC8]">เสื้อเชิ้ตยอดนิยม</span>
              </h2>
              <p className="text-[18px] text-[#3D5278] leading-[1.8] max-w-[540px]">
                คอลเลกชันเสื้อเชิ้ตแนะนำ ออกแบบมาเพื่อทุกสไตล์การแต่งตัวของคุณ
              </p>
            </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 v2-stagger">
              {featuredProducts.slice(0, 6).map((product, i) => {
                const img = product.images[0];
                const prices = product.variants.map((v) => v.price);
                const minPrice = prices.length ? Math.min(...prices) : product.basePrice;
                const maxPrice = prices.length ? Math.max(...prices) : product.basePrice;

                return (
                  <Reveal key={product.id} delay={i * 100}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="v2-glow-card group relative bg-white border-[1.5px] border-[#C8D8EE] rounded-[14px] overflow-hidden hover:border-[#1A6CC8] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(26,108,200,0.12)] transition-all duration-300"
                  >
                    {/* Bottom gradient accent on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[14px] bg-gradient-to-r from-[#0A2B5E] to-[#1A6CC8] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-10" />

                    {/* Product image */}
                    <div className="aspect-[4/5] relative bg-slate-100 overflow-hidden">
                      {img ? (
                        <Image
                          src={img.url}
                          alt={img.altText ?? product.nameTh}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#E8F2FC]">
                          <Shirt className="w-16 h-16 text-[#C8DDFA]" strokeWidth={1} />
                        </div>
                      )}
                      {/* Quick view overlay */}
                      <div className="absolute inset-0 bg-[#0A2B5E]/0 group-hover:bg-[#0A2B5E]/5 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                        <span className="bg-white text-[#0A2B5E] text-[15px] font-bold px-5 py-2 rounded-lg shadow-lg translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                          ดูรายละเอียด
                        </span>
                      </div>
                    </div>

                    {/* Product info */}
                    <div className="p-6">
                      <div className="text-[13px] font-bold uppercase tracking-widest text-[#1A6CC8] mb-1.5">
                        {product.category.nameTh}
                      </div>
                      <h3 className="font-bold text-[19px] text-[#0A2B5E] mb-3 leading-snug line-clamp-2 group-hover:text-[#1A6CC8] transition-colors">
                        {product.nameTh}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {[...new Set(product.variants.map((v) => v.size))].slice(0, 5).map((s) => (
                          <span
                            key={s}
                            className="text-[12px] font-bold px-2 py-0.5 bg-[#E8F2FC] border border-[#C8DDFA] text-[#2255A0] rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="font-black text-[20px] text-[#0A2B5E]">
                        {minPrice === maxPrice
                          ? `฿${minPrice.toLocaleString()}`
                          : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
                      </div>
                    </div>
                  </Link>
                  </Reveal>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#0A2B5E] text-white px-8 py-3 rounded-md font-bold text-[17px] hover:bg-[#2255A0] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(10,43,94,0.3)] transition-all duration-200"
              >
                ดูสินค้าทั้งหมด →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────── CATEGORIES (if no featured products) ─────────────────── */}
      {featuredProducts.length === 0 && categories.length > 0 && (
        <section className="py-[88px] px-[5vw] bg-[#F5F9FF]">
          <div className="max-w-[1200px] mx-auto">
            <SectionLabel>หมวดหมู่สินค้า</SectionLabel>
            <h2 className="font-black text-[#0A2B5E] mb-10" style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
              เลือกสินค้าตามหมวดหมู่
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="bg-white border-[1.5px] border-[#C8D8EE] rounded-xl p-6 hover:border-[#1A6CC8] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(10,43,94,0.1)] transition-all duration-300 text-center"
                >
                  <div className="text-3xl mb-3">👔</div>
                  <div className="font-bold text-[#0A2B5E] text-xl">{cat.nameTh}</div>
                  <div className="text-[15px] text-[#4A6080] mt-1">{cat.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────── FEATURES / WHY HIGHBURY ─────────────────── */}
      <section className="py-[88px] px-[5vw] bg-white relative overflow-hidden">
        <FloatingBlobs />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <Reveal>
            <div className="mb-14">
              <SectionLabel>ทำไมต้อง Highbury</SectionLabel>
            <h2
              className="font-black text-[#0A2B5E] leading-[1.2] mb-3"
              style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
            >
              คุณภาพในทุกรายละเอียด
              <br />
              <span className="text-[#1A6CC8]">ที่เราใส่ใจเพื่อคุณ</span>
            </h2>
            <p className="text-[18px] text-[#3D5278] leading-[1.8] max-w-[520px]">
              ทุกขั้นตอนการผลิตถูกออกแบบมาเพื่อให้คุณได้เสื้อเชิ้ตที่ดีที่สุด
            </p>
          </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, i) => (
              <Reveal key={feat.titleEn} delay={i * 120} direction="scale">
                <TiltCard className="h-full">
                  <div
                    className="v2-glow-card bg-[#F5F9FF] border-[1.5px] border-[#C8D8EE] rounded-[14px] p-8 text-center hover:border-[#0A2B5E] hover:shadow-[0_8px_28px_rgba(10,43,94,0.10)] transition-all duration-300 h-full"
                  >
                    <div className="w-14 h-14 bg-[#E8F2FC] rounded-[14px] flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>
                    <div className="text-[13px] font-bold uppercase tracking-widest text-[#1A6CC8] mb-2">
                      {feat.titleEn}
                    </div>
                    <h3 className="font-bold text-[18px] text-[#0A2B5E] mb-3">{feat.titleTh}</h3>
                    <p className="text-[15px] text-[#3D5278] leading-[1.65]">{feat.desc}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── SERVICES / SELLING POINTS ─────────────────── */}
      <section className="py-[88px] px-[5vw] bg-[#F5F9FF]">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1.1fr_1fr] gap-20 items-start">
          {/* Left: service list */}
          <Reveal direction="left">
            <SectionLabel>บริการของเรา</SectionLabel>
            <h2
              className="font-black text-[#0A2B5E] leading-[1.2] mb-3"
              style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
            >
              บริการครบวงจร
              <br />
              ตั้งแต่ต้นจนจบ
            </h2>
            <p className="text-[18px] text-[#3D5278] leading-[1.8] mb-10 max-w-[460px]">
              เราดูแลคุณตั้งแต่การเลือกสินค้าไปจนถึงหลังการขาย
            </p>

            <div className="flex flex-col gap-1">
              {[
                { num: "01", title: "คำแนะนำการเลือกไซส์", desc: "ทีมงานพร้อมช่วยคุณเลือกไซส์ที่เหมาะสม มีตาราง Size Guide ละเอียด" },
                { num: "02", title: "จัดส่งทั่วประเทศ", desc: "จัดส่งด้วยบริษัทขนส่งชั้นนำ ติดตามพัสดุได้แบบ Real-time" },
                { num: "03", title: "เปลี่ยนไซส์ได้ฟรี", desc: "ไม่ถูกใจไซส์หรือทรง เปลี่ยนได้ฟรีภายใน 14 วัน ไม่มีเงื่อนไข" },
                { num: "04", title: "บริการหลังการขาย", desc: "ทีมงานพร้อมให้คำปรึกษาและแก้ปัญหาให้คุณ 7 วันต่อสัปดาห์" },
              ].map((svc) => (
                <div
                  key={svc.num}
                  className="flex gap-5 px-[18px] py-[22px] rounded-xl border-[1.5px] border-transparent hover:border-[#C8D8EE] hover:bg-white hover:translate-x-1.5 transition-all duration-300"
                >
                  <div className="text-3xl font-black text-[#C8DDFA] leading-none flex-shrink-0 w-11">
                    {svc.num}
                  </div>
                  <div>
                    <div className="font-bold text-[19px] text-[#0A2B5E] mb-1.5">{svc.title}</div>
                    <p className="text-[16px] text-[#3D5278] leading-[1.65]">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right: sticky coverage card → repurposed as "กลุ่มสินค้า" */}
          <Reveal direction="right" delay={200}>
          <div className="bg-[#0A2B5E] rounded-2xl p-9 text-white md:sticky md:top-24">
            <div className="font-black text-[22px] mb-1">ช่องทางการสั่งซื้อ</div>
            <div className="text-[15px] text-white/60 mb-5">สะดวก รวดเร็ว ปลอดภัย</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Website", highlight: true },
                { label: "LINE Official" },
                { label: "Facebook Shop" },
                { label: "Instagram" },
              ].map((ch) => (
                <div
                  key={ch.label}
                  className={`flex items-center gap-2 text-[15px] font-semibold px-3.5 py-2.5 rounded-lg border transition-colors duration-200 hover:bg-white/15 ${
                    ch.highlight
                      ? "bg-[rgba(232,168,0,0.18)] border-[rgba(232,168,0,0.35)] text-[#E8A800]"
                      : "bg-white/8 border-white/12"
                  }`}
                >
                  <span className="text-lg">🛒</span>
                  {ch.label}
                </div>
              ))}
            </div>
            <div className="mt-5 pt-3.5 border-t border-white/10 text-[13px] text-white/40 text-center leading-relaxed">
              รองรับการจ่ายเงินผ่าน Thai QR Promptpay
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── OEM & UNIFORM ─────────────────── */}
      <section className="py-[88px] px-[5vw] bg-white relative overflow-hidden">
        <FloatingBlobs />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <SectionLabel>บริการ B2B</SectionLabel>
              <h2
                className="font-black text-[#0A2B5E] leading-[1.2] mb-3"
                style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
              >
                บริการสำหรับองค์กรและธุรกิจ
                <br />
                <span className="text-[#1A6CC8]">OEM · ยูนิฟอร์มพนักงาน</span>
              </h2>
              <p className="text-[18px] text-[#3D5278] leading-[1.8] max-w-[580px] mx-auto">
                รองรับทั้งการรับจ้างผลิต OEM และออกแบบเสื้อเชิ้ตยูนิฟอร์มพนักงานแบบครบวงจร
              </p>
            </div>
          </Reveal>

          {/* Main two-card grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* OEM Card */}
            <Reveal direction="left">
              <div className="bg-[#0A2B5E] rounded-2xl p-8 text-white flex flex-col h-full">
                <div className="inline-flex items-center gap-2 bg-[rgba(232,168,0,0.18)] border border-[rgba(232,168,0,0.35)] text-[#E8A800] px-3 py-1 rounded-full text-[12px] font-bold tracking-widest uppercase mb-5 self-start">
                  🏭 OEM Production
                </div>
                <h3 className="font-black text-[24px] mb-2">รับผลิต OEM ขั้นต่ำ</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-black text-[52px] leading-none text-[#E8A800]">3,500</span>
                  <span className="text-white/65 text-[18px]">ตัว / เดือน</span>
                </div>
                <p className="text-white/70 text-[16px] leading-[1.75] mb-6">
                  รองรับการผลิตเสื้อเชิ้ตในปริมาณมากด้วยกระบวนการที่ได้มาตรฐาน
                  มี QC ทุกขั้นตอน เหมาะสำหรับแบรนด์และผู้ประกอบการที่ต้องการพาร์ตเนอร์ผู้ผลิตที่เชื่อถือได้
                </p>
                <div className="grid grid-cols-2 gap-2 mb-7">
                  {oemFeatures.map((f) => (
                    <div key={f.title} className="bg-white/[0.08] border border-white/[0.12] rounded-xl p-3.5">
                      <div className="text-xl mb-1.5">{f.icon}</div>
                      <div className="font-bold text-[14px] text-white mb-0.5">{f.title}</div>
                      <div className="text-[13px] text-white/55 leading-snug">{f.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <a
                    href="mailto:contact@highbury.co.th"
                    className="inline-flex items-center gap-2 bg-[#E8A800] text-[#0A2B5E] px-6 py-3 rounded-md font-black text-[16px] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(232,168,0,0.45)] transition-all duration-200"
                  >
                    สอบถามราคา OEM →
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Uniform Card */}
            <Reveal direction="right" delay={150}>
              <div className="bg-[#F5F9FF] border-[2px] border-[#C8D8EE] rounded-2xl p-8 flex flex-col h-full hover:border-[#1A6CC8] hover:shadow-[0_12px_40px_rgba(26,108,200,0.10)] transition-all duration-300">
                <div className="inline-flex items-center gap-2 bg-[#1A6CC8]/10 border border-[#1A6CC8]/25 text-[#1A6CC8] px-3 py-1 rounded-full text-[12px] font-bold tracking-widest uppercase mb-5 self-start">
                  🎽 Corporate Uniform
                </div>
                <h3 className="font-black text-[24px] text-[#0A2B5E] mb-2">เสื้อยูนิฟอร์มพนักงาน</h3>
                <p className="text-[#3D5278] text-[16px] leading-[1.75] mb-6">
                  ออกแบบและผลิตยูนิฟอร์มพนักงานแบบครบวงจร ตั้งแต่คอนเซ็ปต์ดีไซน์
                  ปักโลโก้ สีประจำองค์กร ไปจนถึงการจัดส่งถึงมือพนักงานทุกคน
                </p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {uniformFeatures.map((f) => (
                    <div key={f.title} className="bg-white border border-[#C8D8EE] rounded-xl p-3.5 hover:border-[#1A6CC8] transition-colors duration-200">
                      <div className="text-xl mb-1.5">{f.icon}</div>
                      <div className="font-bold text-[14px] text-[#0A2B5E] mb-0.5">{f.title}</div>
                      <div className="text-[13px] text-[#4A6080] leading-snug">{f.desc}</div>
                    </div>
                  ))}
                </div>
                {/* Suitable for */}
                <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#C8D8EE] mb-6">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <div className="font-bold text-[15px] text-[#0A2B5E]">เหมาะสำหรับทุกประเภทองค์กร</div>
                    <div className="text-[13px] text-[#4A6080]">SME · บริษัทขนาดกลาง-ใหญ่ · โรงแรม · โรงพยาบาล · ร้านอาหาร</div>
                  </div>
                </div>
                <div className="mt-auto">
                  <a
                    href="mailto:contact@highbury.co.th"
                    className="inline-flex items-center gap-2 bg-[#0A2B5E] text-white px-6 py-3 rounded-md font-black text-[16px] hover:bg-[#2255A0] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(10,43,94,0.3)] transition-all duration-200"
                  >
                    ขอใบเสนอราคา →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Process steps */}
          <Reveal delay={200}>
            <div className="bg-[#F5F9FF] border border-[#C8D8EE] rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="font-bold text-[13px] uppercase tracking-widest text-[#1A6CC8] mb-1">ขั้นตอนการสั่งผลิต</div>
                <h3 className="font-black text-[22px] text-[#0A2B5E]">ง่าย · รวดเร็ว · มืออาชีพ</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { step: "01", icon: "💬", title: "ปรึกษาและวางแผน", desc: "แจ้งความต้องการ จำนวน สไตล์ และงบประมาณ" },
                  { step: "02", icon: "✏️", title: "ออกแบบและยืนยัน", desc: "รับแบบร่าง เลือกผ้า สี โลโก้ และอนุมัติแบบ" },
                  { step: "03", icon: "🏭", title: "เข้าสู่การผลิต", desc: "ตัดเย็บ ตรวจ QC และบรรจุตามรายการสั่ง" },
                  { step: "04", icon: "📦", title: "จัดส่งครบถ้วน", desc: "แพ็กแยกรายชื่อ จัดส่งพร้อมรายงานครบทุกไซส์" },
                ].map((s, i) => (
                  <div key={s.step} className="text-center">
                    <div className="relative w-14 h-14 rounded-full bg-[#E8F2FC] flex items-center justify-center text-2xl mx-auto mb-3">
                      {s.icon}
                      {i < 3 && (
                        <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#C8D8EE]" />
                      )}
                    </div>
                    <div className="text-[12px] font-black text-[#1A6CC8] tracking-widest mb-1">{s.step}</div>
                    <div className="font-bold text-[15px] text-[#0A2B5E] mb-1">{s.title}</div>
                    <p className="text-[13px] text-[#4A6080] leading-[1.55]">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <section className="py-[88px] px-[5vw] bg-white">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
          <div className="mb-14">
            <SectionLabel>คำถามที่พบบ่อย</SectionLabel>
            <h2
              className="font-black text-[#0A2B5E] leading-[1.2]"
              style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
            >
              มีข้อสงสัยอะไรไหม?
            </h2>
          </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            {faqItems.map((item, i) => (
              <Reveal key={i} delay={i * 100}>
              <div
                className="bg-[#F5F9FF] border-[1.5px] border-[#C8D8EE] rounded-xl p-7 hover:border-[#1A6CC8] hover:shadow-[0_4px_20px_rgba(26,108,200,0.10)] transition-all duration-300"
              >
                <div className="flex items-start gap-2.5 mb-3">
                  <div className="w-6 h-6 bg-[#1A6CC8] text-white rounded-md flex items-center justify-center text-[12px] font-black flex-shrink-0 mt-0.5">
                    Q
                  </div>
                  <p className="font-bold text-[17px] text-[#0A2B5E] leading-snug">{item.q}</p>
                </div>
                <p className="text-[16px] text-[#3D5278] leading-[1.7] pl-[34px]">{item.a}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── REVIEWS ─────────────────── */}
      <section className="py-[88px] px-[5vw] bg-[#F5F9FF]">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
          <div className="mb-14">
            <SectionLabel>รีวิวจากลูกค้า</SectionLabel>
            <h2
              className="font-black text-[#0A2B5E] leading-[1.2]"
              style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
            >
              ลูกค้าของเราพูดถึง
              <br />
              <span className="text-[#1A6CC8]">Highbury ว่าอย่างไร</span>
            </h2>
          </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <Reveal key={i} delay={i * 150} direction="scale">
              <div
                className="v2-glow-card bg-white border-[1.5px] border-[#C8D8EE] rounded-xl p-7 hover:border-[#1A6CC8] hover:shadow-[0_4px_20px_rgba(26,108,200,0.10)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="text-[#E8A800] text-lg">★</span>
                  ))}
                </div>
                <p className="text-[16px] text-[#3D5278] leading-[1.7] mb-5 italic">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E8F2FC] flex items-center justify-center text-[#0A2B5E] font-black text-[15px] flex-shrink-0">
                    {r.name.slice(2, 3)}
                  </div>
                  <div>
                    <div className="font-bold text-[16px] text-[#0A2B5E]">{r.name}</div>
                    <div className="text-[14px] text-[#4A6080]">{r.role}</div>
                  </div>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── CTA BANNER ─────────────────── */}
      <section
        className="py-20 px-[5vw] text-white text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A2B5E 0%, #1A3D75 50%, #2255A0 100%)" }}
      >
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 40%)",
          }}
        />
        <Reveal direction="up">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-[13px] font-bold tracking-[0.1em] uppercase mb-6">
            <span className="w-1.5 h-1.5 bg-[#E8A800] rounded-full animate-pulse" />
            พร้อมให้บริการแล้ววันนี้
          </div>
          <h2 className="font-black text-3xl md:text-5xl leading-tight mb-4">
            เริ่มต้นดูดีได้เลย
            <br />
            <span className="text-[#E8A800]">กับ Highbury</span>
          </h2>
          <p className="text-white/75 text-[18px] leading-relaxed mb-8">
            เลือกสินค้าจากคอลเลกชันหลากหลายของเรา
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-[#0A2B5E] px-8 py-3.5 rounded-md font-black text-[17px] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,255,255,0.3)] transition-all duration-200"
            >
              ดูสินค้าทั้งหมด →
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-8 py-3.5 rounded-md font-bold text-[17px] hover:border-white hover:bg-white/10 transition-all duration-200"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
        </Reveal>
      </section>
    </div>
  );
}
