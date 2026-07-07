import Link from "next/link";
import Image from "next/image";
import { 
  Shirt, 
  Sparkles, 
  Palette, 
  Ruler, 
  Scissors, 
  Factory, 
  Award, 
  Truck, 
  ChevronRight, 
  Check, 
  Mail, 
  Star, 
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { getProductPlaceholderImage } from "@/lib/placeholders";
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
  { icon: <Shirt className="h-5 w-5 text-blue-500 dark:text-blue-400" />, title: "เสื้อเชิ้ตผู้ชาย", sub: "Oxford · Poplin · Chambray · Linen", href: "/products?category=mens-shirts" },
  { icon: <Sparkles className="h-5 w-5 text-pink-500 dark:text-pink-400" />, title: "เสื้อเชิ้ตผู้หญิง", sub: "Slim Fit · Regular Fit · Oversized", href: "/products?category=womens-shirts" },
  { icon: <Palette className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />, title: "หลากหลายรูปแบบ", sub: "ผ้าสีพื้น · ลายริ้ว · ลายสก็อต", href: "/products" },
  { icon: <Ruler className="h-5 w-5 text-amber-500 dark:text-amber-400" />, title: "ไซส์ครบทุกรูปทรง", sub: "XS · S · M · L · XL · 2XL · 3XL · 4XL", href: "/products" },
  { icon: <Scissors className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />, title: "คัตติ้งเนี้ยบ พอดีตัว", sub: "แพทเทิร์นออกแบบสำหรับสรีระคนไทย", href: "/products" },
];

const trustItems = [
  { icon: <Shirt className="h-4.5 w-4.5 text-blue-500" />, label: "เนื้อผ้าพรีเมียม" },
  { icon: <Scissors className="h-4.5 w-4.5 text-emerald-500" />, label: "ตัดเย็บโดยช่างมืออาชีพ" },
  { icon: <Ruler className="h-4.5 w-4.5 text-amber-500" />, label: "แพทเทิร์นสำหรับคนไทย" },
  { icon: <Sparkles className="h-4.5 w-4.5 text-sky-500" />, label: "ระบายอากาศได้ดี" },
  { icon: <Truck className="h-4.5 w-4.5 text-rose-500" />, label: "จัดส่งทั่วประเทศ" },
];

const aboutStats = [
  { icon: <Factory className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto" />, num: "พรีเมียม", label: "เนื้อผ้าคัดสรร", accent: "" },
  { icon: <Award className="h-8 w-8 text-rose-600 dark:text-rose-400 mx-auto" />, num: "Expert", label: "ช่างตัดเย็บมืออาชีพ", accent: "red" },
  { icon: <Palette className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto" />, num: "หลาก", label: "สีสันให้เลือก", accent: "gold" },
  { icon: <Ruler className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto" />, num: "7+", label: "ไซส์ครบทุกรูปทรง", accent: "" },
];

const features = [
  {
    icon: <Shirt className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    titleEn: "Premium Fabric",
    titleTh: "เนื้อผ้าพรีเมียม",
    desc: "ผลิตจากเส้นใยคุณภาพสูง นุ่มสบาย ยับยาก ไม่ต้องรีดบ่อย ให้คุณดูดีได้ตลอดวัน",
  },
  {
    icon: <Scissors className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    titleEn: "Perfect Cut",
    titleTh: "คัตติ้งเนี้ยบ พอดีตัว",
    desc: "แพทเทิร์นออกแบบมาเพื่อสรีระคนเอเชียโดยเฉพาะ ทรงสวย เข้ารูปแต่ไม่อึดอัด",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-sky-600 dark:text-sky-400" />,
    titleEn: "Breathable Comfort",
    titleTh: "ระบายอากาศได้ดี",
    desc: "จัดการความชื้นได้ดีเป็นพิเศษ เหมาะกับสภาพอากาศร้อนอย่างประเทศไทย",
  },
  {
    icon: <Palette className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
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
    q: "จัดส่งให้ในกี่วัน?",
    a: "จัดส่งทั่วประเทศ ใช้เวลา 2-3 วันทำการหลังจากชำระเงิน สำหรับ Bangkok และปริมณฑล บางออเดอร์จัดส่งวันถัดไป",
  },
];

const oemFeatures = [
  { icon: <Factory className="h-5 w-5 text-amber-500" />, title: "กำลังผลิต", desc: "ขั้นต่ำ 3,500 ตัว/เดือน รองรับออเดอร์จำนวนมาก" },
  { icon: <Check className="h-5 w-5 text-amber-500" />, title: "MOQ ยืดหยุ่น", desc: "เริ่มต้นที่ 100 ตัวต่อไซส์/สี" },
  { icon: <Award className="h-5 w-5 text-amber-500" />, title: "QC เข้มงวด", desc: "ตรวจสอบคุณภาพทุกชิ้นก่อนส่ง" },
  { icon: <Sparkles className="h-5 w-5 text-amber-500" />, title: "Lead Time", desc: "ผลิตเสร็จภายใน 3–4 สัปดาห์" },
];

const uniformFeatures = [
  { icon: <Palette className="h-5 w-5 text-blue-500" />, title: "ปักโลโก้ / พิมพ์ลาย", desc: "สีและดีไซน์ตามแบรนด์องค์กร" },
  { icon: <Ruler className="h-5 w-5 text-blue-500" />, title: "วัดไซส์รายบุคคล", desc: "ครอบคลุมทุกรูปทรง XS–4XL" },
  { icon: <Award className="h-5 w-5 text-blue-500" />, title: "ราคา Bulk พิเศษ", desc: "ราคาลดหลั่นตามจำนวนสั่ง" },
  { icon: <Truck className="h-5 w-5 text-blue-500" />, title: "จัดส่งถึงองค์กร", desc: "ตรงเวลา ครบถ้วน ตามที่ตกลงไว้" },
];

// ---------- Shared: Section label ----------
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[12px] text-blue-600 dark:text-blue-400 font-bold tracking-[0.25em] uppercase mb-4">
      <span className="w-6 h-[2px] bg-red-500 rounded-full" />
      {children}
    </div>
  );
}

// ---------- Main Component ----------
export default function HomeV2({ featuredProducts, categories }: HomeV2Props) {
  return (
    <div className="flex flex-col w-full bg-background text-foreground antialiased selection:bg-blue-500/20">

      {/* ─────────────────── HERO ─────────────────── */}
      <section
        className="min-h-[calc(100vh-80px)] grid md:grid-cols-[1.1fr_0.9fr] items-center overflow-hidden relative bg-gradient-to-br from-slate-50 via-blue-50/10 to-slate-100 dark:from-slate-950 dark:via-slate-900/60 dark:to-blue-950/20 py-12 md:py-0"
      >
        {/* Radial bg pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(10,43,94,0.05) 0%, transparent 40%)",
          }}
        />
        {/* Diagonal right panel */}
        <div
          className="absolute top-0 right-0 hidden md:block h-full bg-[#0A2B5E]/95 dark:bg-slate-900/60 border-l dark:border-border/30 shadow-[inset_20px_0_40px_rgba(0,0,0,0.15)]"
          style={{ width: "45%", clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />

        {/* Left: text content */}
        <div className="relative z-10 px-6 sm:px-12 md:pl-[8vw] md:pr-12">
          {/* Eyebrow */}
          <div className="v2-hero-anim v2-hero-anim-d1 inline-flex items-center gap-2 bg-blue-500/5 border border-blue-500/10 dark:bg-blue-400/10 dark:border-blue-400/20 text-[#0A2B5E] dark:text-blue-400 px-4 py-1.5 rounded-full text-[12px] font-bold tracking-[0.1em] uppercase mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            เสื้อเชิ้ตคุณภาพพรีเมียม · ออกแบบสำหรับคนไทย
          </div>

          {/* Headline */}
          <h1
            className="v2-hero-anim v2-hero-anim-d2 font-black leading-[1.12] text-slate-900 dark:text-foreground mb-6"
            style={{ fontSize: "clamp(32px, 4.2vw, 56px)" }}
          >
            ดูดีได้ <span className="v2-shimmer-text">ทุกวัน</span>
            <br />
            ด้วยเสื้อเชิ้ต
            <br />
            <Typewriter
              texts={["ที่ใช่สำหรับคุณ", "ที่ทำให้คุณมั่นใจ", "ที่ใส่สบายทั้งวัน"]}
              className="text-blue-600 dark:text-blue-400 font-extrabold"
            />
          </h1>

          {/* Sub headline */}
          <p
            className="v2-hero-anim v2-hero-anim-d3 text-muted-foreground leading-[1.8] mb-10 max-w-[480px] text-[16px] md:text-[18px]"
          >
            Highbury International มุ่งมั่นสร้างเสื้อเชิ้ตคุณภาพสูงจากเนื้อผ้าพรีเมียม
            คัตติ้งเนี้ยบ ทรงสวย พอดีตัว ออกแบบมาเพื่อสรีระคนเอเชียโดยเฉพาะ
          </p>

          {/* Stats row */}
          <div className="v2-hero-anim v2-hero-anim-d4 flex gap-8 mb-10 border-t border-border/60 pt-8 max-w-[480px]">
            <div className="flex-1">
              <div className="text-2xl font-black text-slate-800 dark:text-foreground leading-none">
                หลาย<span className="text-red-500 dark:text-red-400">สี</span>
              </div>
              <div className="text-[12px] text-muted-foreground mt-2 font-medium">สีสันให้เลือกมากมาย</div>
            </div>
            <div className="flex-1 border-x border-border px-8">
              <div className="text-2xl font-black text-slate-800 dark:text-foreground leading-none">
                7<span className="text-red-500 dark:text-red-400">+</span>
              </div>
              <div className="text-[12px] text-muted-foreground mt-2 font-medium">ไซส์ครบทุกรูปทรง</div>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-black text-slate-800 dark:text-foreground leading-none">พรีเมียม</div>
              <div className="text-[12px] text-muted-foreground mt-2 font-medium">เนื้อผ้าอย่างดี</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="v2-hero-anim v2-hero-anim-d5 flex gap-4 flex-wrap">
            <Link
              href="/products"
              className="v2-btn-pulse inline-flex items-center gap-2 bg-[#0A2B5E] dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-[16px] transition-all duration-300 hover:bg-[#1a4484] dark:hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              ดูสินค้าทั้งหมด →
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-border bg-background hover:bg-muted text-foreground px-8 py-4 rounded-xl font-bold text-[16px] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              เลือกตามหมวดหมู่
            </Link>
          </div>
        </div>

        {/* Right: floating product cards on dark panel */}
        <div className="relative z-10 px-6 md:pl-12 md:pr-[8vw] hidden md:block">
          <div className="flex flex-col gap-3.5">
            {heroCards.map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className="v2-hero-card-anim flex items-center gap-4 bg-white/10 dark:bg-slate-950/30 backdrop-blur-md border border-white/15 dark:border-border/40 rounded-xl px-5 py-4 hover:bg-white/20 dark:hover:bg-slate-900/50 hover:-translate-x-1.5 hover:scale-[1.01] transition-all duration-300 shadow-lg"
                style={{ animationDelay: `${0.15 + i * 0.15}s` }}
              >
                <div className="w-11 h-11 bg-white/15 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                  {card.icon}
                </div>
                <div>
                  <div className="font-bold text-[15px] text-white mb-0.5">{card.title}</div>
                  <div className="text-[13px] text-white/70 dark:text-muted-foreground">{card.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── TRUST BAR (Marquee) ─────────────────── */}
      <div className="bg-[#0A2B5E] dark:bg-slate-950/90 py-4.5 px-0 overflow-hidden border-y border-white/5 dark:border-border/30 shadow-md">
        <Marquee speed={22} className="py-1">
          {trustItems.map((t, i) => (
            <div key={i} className="flex items-center gap-3 text-white/90 dark:text-foreground text-[14px] md:text-[15px] font-bold tracking-wide uppercase px-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 dark:bg-slate-900">{t.icon}</span>
              {t.label}
            </div>
          ))}
        </Marquee>
      </div>

      {/* ─────────────────── ABOUT ─────────────────── */}
      <section className="py-24 px-6 sm:px-12 md:px-[6vw] bg-background relative overflow-hidden">
        <FloatingBlobs />
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
          {/* Stats grid */}
          <Reveal direction="left">
            <div className="grid grid-cols-2 gap-4.5 v2-stagger">
              {aboutStats.map((stat, i) => (
                <TiltCard key={i}>
                  <div
                    className="relative overflow-hidden rounded-2xl px-6 py-8 text-center border border-border bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:bg-card hover:shadow-lg transition-all duration-300"
                  >
                    {/* top color accent */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{
                        background:
                          stat.accent === "red" ? "var(--destructive)" : stat.accent === "gold" ? "#E8A800" : "var(--primary)",
                      }}
                    />
                    <div className="flex justify-center mb-3.5 transform group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                    <div className="text-2xl font-black text-foreground leading-none">{stat.num}</div>
                    <div className="text-[14px] text-muted-foreground mt-2 font-medium">{stat.label}</div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </Reveal>

          {/* Text content */}
          <Reveal direction="right" delay={150}>
            <SectionLabel>เกี่ยวกับเรา</SectionLabel>
            <h2
              className="font-black text-foreground leading-[1.15] mb-5"
              style={{ fontSize: "clamp(28px, 3.6vw, 46px)" }}
            >
              Highbury International
              <br />
              <span className="text-blue-600 dark:text-blue-400">เสื้อเชิ้ตพรีเมียมสำหรับคนไทย</span>
            </h2>
            <p className="text-[17px] md:text-[18px] text-muted-foreground leading-[1.8] mb-8">
              เราคือแบรนด์เสื้อเชิ้ตคุณภาพสูงที่ออกแบบและตัดเย็บโดยช่างมืออาชีพ
              ด้วยความใส่ใจในทุกรายละเอียดตั้งแต่การเลือกเนื้อผ้า การออกแบบแพทเทิร์น
              ไปจนถึงการตัดเย็บขั้นสุดท้าย เพื่อให้คุณได้รับเสื้อเชิ้ตที่ดีที่สุด
            </p>
            {/* Pills */}
            <div className="flex flex-wrap gap-2.5">
              {["เสื้อเชิ้ตผู้ชาย", "เสื้อเชิ้ตผู้หญิง", "Cotton Premium", "Poplin", "Chambray", "Linen"].map((p) => (
                <span
                  key={p}
                  className="bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[14px] font-bold px-4.5 py-2 rounded-full shadow-sm"
                >
                  {p}
                </span>
              ))}
              {["จัดส่งทั่วประเทศ"].map((p) => (
                <span
                  key={p}
                  className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[14px] font-bold px-4.5 py-2 rounded-full shadow-sm animate-pulse"
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
        <section className="py-24 px-6 sm:px-12 md:px-[6vw] bg-muted/20 relative overflow-hidden border-y border-border/30 shadow-inner">
          <FloatingBlobs />
          <div className="max-w-[1200px] mx-auto relative z-10">
            <Reveal>
              <div className="text-center mb-16 max-w-xl mx-auto">
                <SectionLabel>สินค้าแนะนำ</SectionLabel>
                <h2
                  className="font-black text-foreground leading-[1.15] mb-4"
                  style={{ fontSize: "clamp(28px, 3.6vw, 46px)" }}
                >
                  Signature Collection
                  <br />
                  <span className="text-blue-600 dark:text-blue-400">คอลเลกชันที่ได้รับความนิยมสูงสุด</span>
                </h2>
                <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7]">
                  เสื้อเชิ้ตคุณภาพสูงหลากหลายรุ่นที่เป็นเอกลักษณ์ของ Highbury สวมใส่สบาย ลงตัวกับทุกโอกาสสำคัญ
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 v2-stagger">
              {featuredProducts.slice(0, 6).map((product, i) => {
                const img = product.images[0];
                const prices = product.variants.map((v) => v.price);
                const minPrice = prices.length ? Math.min(...prices) : product.basePrice;
                const maxPrice = prices.length ? Math.max(...prices) : product.basePrice;

                return (
                  <Reveal key={product.id} delay={i * 120} direction="scale">
                    <Link
                      href={`/products/${product.slug}`}
                      className="v2-glow-card group relative bg-card border border-border/40 rounded-xl overflow-hidden hover:border-primary/25 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Top gradient highlight strip */}
                      <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-blue-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-10" />

                      {/* Product image container */}
                      <div className="aspect-[4/5] relative bg-muted/30 overflow-hidden">
                        {img ? (
                          <Image
                            src={img.url}
                            alt={img.altText ?? product.nameTh}
                            fill
                            className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <Image
                            src={getProductPlaceholderImage(product.slug)}
                            alt={product.nameTh}
                            fill
                            className="object-contain p-2 bg-[#FAF6EE] dark:bg-[#1f2125] group-hover:scale-[1.03] transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        )}
                        {/* Interactive overlay card */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100">
                          <span className="bg-background text-foreground text-[14px] font-bold px-6 py-2.5 rounded-lg shadow-md translate-y-3 group-hover:translate-y-0 transition-transform duration-300 border border-border">
                            ดูรายละเอียดสินค้า →
                          </span>
                        </div>
                      </div>

                      {/* Product info and specifications */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-primary dark:text-blue-400 mb-1.5">
                            {product.category.nameTh}
                          </div>
                          <h3 className="font-bold text-[18px] text-foreground mb-3 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {product.nameTh}
                          </h3>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {[...new Set(product.variants.map((v) => v.size))].slice(0, 5).map((s) => (
                              <span
                                key={s}
                                className="text-[11px] font-bold px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                          <div className="font-black text-[20px] text-foreground">
                            {minPrice === maxPrice
                              ? `฿${minPrice.toLocaleString()}`
                              : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#0A2B5E] dark:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-[16px] hover:bg-[#1a4484] dark:hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(59,130,246,0.25)] transition-all duration-200"
              >
                ดูสินค้าทั้งหมด →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────── CATEGORIES (if no featured products) ─────────────────── */}
      {featuredProducts.length === 0 && categories.length > 0 && (
        <section className="py-24 px-6 sm:px-12 bg-muted/20 border-y border-border/30">
          <div className="max-w-[1200px] mx-auto">
            <SectionLabel>หมวดหมู่สินค้า</SectionLabel>
            <h2 className="font-black text-foreground mb-10" style={{ fontSize: "clamp(28px, 3.6vw, 46px)" }}>
              เลือกสินค้าตามหมวดหมู่ที่เหมาะสม
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {(() => {
                const filtered = categories.filter(
                  (cat) => cat.slug !== "mens-shirts" && cat.slug !== "womens-shirts"
                );
                const othersIndex = filtered.findIndex(
                  (cat) => cat.nameTh === "อื่นๆ" || cat.slug.toLowerCase().includes("other")
                );
                if (othersIndex !== -1) {
                  const othersCat = filtered[othersIndex];
                  filtered.splice(othersIndex, 1);
                  filtered.push(othersCat);
                }
                return filtered.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="bg-card border border-border rounded-xl p-8 hover:border-primary hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-center"
                  >
                    <div className="text-3xl mb-4">👔</div>
                    <div className="font-bold text-foreground text-xl">{cat.nameTh}</div>
                    <div className="text-[14px] text-muted-foreground mt-1.5">{cat.name}</div>
                  </Link>
                ));
              })()}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────── FEATURES / WHY HIGHBURY ─────────────────── */}
      <section className="py-24 px-6 sm:px-12 md:px-[6vw] bg-background relative overflow-hidden">
        <FloatingBlobs />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-16 max-w-xl mx-auto">
              <SectionLabel>ทำไมต้อง Highbury</SectionLabel>
              <h2
                className="font-black text-foreground leading-[1.15] mb-4"
                style={{ fontSize: "clamp(28px, 3.6vw, 46px)" }}
              >
                คุณภาพในทุกรายละเอียด
                <br />
                <span className="text-blue-600 dark:text-blue-400">ที่เรามอบให้คุณอย่างจริงใจ</span>
              </h2>
              <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7]">
                ทุกชิ้นงานผ่านกระบวนการคัดกรอง คัดเลือก และตรวจสอบความสมบูรณ์เพื่อให้แน่ใจในความพึงพอใจสูงสุด
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, i) => (
              <Reveal key={feat.titleEn} delay={i * 120} direction="scale">
                <TiltCard className="h-full">
                  <div
                    className="v2-glow-card bg-card border border-border rounded-xl p-8 text-center hover:border-primary/25 hover:shadow-md transition-all duration-300 h-full flex flex-col items-center"
                  >
                    <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-border/40">
                      {feat.icon}
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-primary dark:text-blue-400 mb-2">
                      {feat.titleEn}
                    </div>
                    <h3 className="font-bold text-[18px] text-foreground mb-3">{feat.titleTh}</h3>
                    <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.65]">{feat.desc}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── SERVICES / SELLING POINTS ─────────────────── */}
      <section className="py-24 px-6 sm:px-12 md:px-[6vw] bg-muted/20 border-y border-border/30">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1.1fr_1.1fr] gap-16 md:gap-24 items-center">
          {/* Left: service list */}
          <Reveal direction="left">
            <SectionLabel>บริการของเรา</SectionLabel>
            <h2
              className="font-black text-foreground leading-[1.15] mb-5"
              style={{ fontSize: "clamp(28px, 3.6vw, 46px)" }}
            >
              บริการแบบครบวงจร
              <br />
              ตั้งแต่เริ่มต้นจนถึงความสำเร็จ
            </h2>
            <p className="text-[17px] md:text-[18px] text-muted-foreground leading-[1.8] mb-8">
              ทีมผู้เชี่ยวชาญของเรายินดีดูแลคุณในทุกส่วนงาน เพื่อมอบประสบการณ์การเลือกซื้อสินค้าที่สะดวกสบายและมั่นใจ
            </p>

            <div className="flex flex-col gap-2">
              {[
                { num: "01", title: "คำแนะนำการเลือกไซส์อย่างแม่นยำ", desc: "ทีมงานดูแลพร้อมให้คำปรึกษาเพื่อรับคำแนะนำไซส์เสื้อเชิ้ตที่กระชับและเข้ารูปที่สุด" },
                { num: "02", title: "จัดส่งด่วนพิเศษทั่วประเทศ", desc: "ขนส่งตรงเวลาโดยเครือข่ายพันธมิตรคุณภาพ พร้อมระบุเลขแทร็กการจัดส่งทันที" },
                { num: "03", title: "รับประกันความพึงพอใจการบริการ", desc: "คอยดูแลอำนวยความสะดวก สอบถามข้อมูล และแก้ไขปัญหารวดเร็วเป็นกันเอง" },
              ].map((svc) => (
                <div
                  key={svc.num}
                  className="flex gap-5 p-4 rounded-xl border border-transparent hover:border-border hover:bg-card hover:translate-x-1.5 transition-all duration-300"
                >
                  <div className="text-3xl font-black text-blue-200 dark:text-blue-900/60 leading-none flex-shrink-0 w-11 mt-1">
                    {svc.num}
                  </div>
                  <div>
                    <div className="font-bold text-[18px] text-foreground mb-1">{svc.title}</div>
                    <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.65]">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right: channels card */}
          <Reveal direction="right" delay={150}>
            <div className="bg-[#0A2B5E] dark:bg-card border border-white/10 dark:border-border/60 rounded-2xl p-8 md:p-10 text-white dark:text-foreground shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-radial-gradient" />
              <div className="relative z-10">
                <div className="font-black text-[24px] mb-1">ช่องทางการสั่งซื้อ</div>
                <div className="text-[14px] text-white/70 dark:text-muted-foreground mb-6">เชื่อมต่อกับเราทางช่องทางที่ท่านสะดวกสบายที่สุด</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Website", highlight: true },
                    { label: "LINE Official" },
                    { label: "Facebook Shop" },
                    { label: "Instagram" },
                  ].map((ch) => (
                    <div
                      key={ch.label}
                      className={`flex items-center gap-2.5 text-[14px] md:text-[15px] font-bold px-4 py-3 rounded-lg border transition-colors duration-200 cursor-pointer ${
                        ch.highlight
                          ? "bg-[#E8A800]/15 border-[#E8A800]/40 text-[#E8A800] dark:bg-[#E8A800]/10 dark:border-[#E8A800]/20"
                          : "bg-white/10 dark:bg-background border-white/10 dark:border-border hover:bg-white/15 dark:hover:bg-muted"
                      }`}
                    >
                      <span className="text-lg">🛒</span>
                      {ch.label}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-white/10 dark:border-border/50 text-[13px] text-white/50 dark:text-muted-foreground text-center leading-relaxed font-medium">
                  💳 รองรับการชำระเงินด่วนด้วยระบบสแกน Thai QR Promptpay
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── OEM & UNIFORM ─────────────────── */}
      <section className="py-24 px-6 sm:px-12 md:px-[6vw] bg-background relative overflow-hidden">
        <FloatingBlobs />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-16 max-w-xl mx-auto">
              <SectionLabel>บริการ B2B</SectionLabel>
              <h2
                className="font-black text-foreground leading-[1.15] mb-4"
                style={{ fontSize: "clamp(28px, 3.6vw, 46px)" }}
              >
                บริการสำหรับองค์กรและแบรนด์
                <br />
                <span className="text-blue-600 dark:text-blue-400">ออกแบบและรับจ้างผลิตครบวงจร</span>
              </h2>
              <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7]">
                ตอบสนองความต้องการสำหรับบริษัท ร้านค้า และแบรนด์แฟชั่นด้วยระบบจัดการมาตรฐานสูงสุด
              </p>
            </div>
          </Reveal>

          {/* Main two-card grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* OEM Card */}
            <Reveal direction="left">
              <div className="bg-gradient-to-br from-[#0A2B5E] to-[#143E7A] dark:from-card dark:to-card/80 border dark:border-border rounded-2xl p-8 text-white dark:text-foreground flex flex-col h-full shadow-lg relative overflow-hidden">
                <div className="inline-flex items-center gap-2 bg-[#E8A800]/15 border border-[#E8A800]/30 text-[#E8A800] px-3.5 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase mb-6 self-start">
                  🏭 OEM Production
                </div>
                <h3 className="font-black text-[24px] mb-2">รับผลิต OEM ปริมาณงาน</h3>
                <div className="flex items-baseline gap-2 mb-4 border-b border-white/10 dark:border-border/40 pb-4">
                  <span className="font-black text-[52px] leading-none text-[#E8A800]">3,500</span>
                  <span className="text-white/70 dark:text-muted-foreground text-[18px]">ตัว / เดือน</span>
                </div>
                <p className="text-white/80 dark:text-muted-foreground text-[15px] md:text-[16px] leading-[1.7] mb-6">
                  ทีมตัดเย็บคุณภาพพร้อมรองรับการสั่งสไตล์พิเศษ กำหนดประเภทผ้า โครงสร้างปก คัดเกรดด้ายอย่างเป็นเอกลักษณ์
                </p>
                <div className="grid grid-cols-2 gap-2.5 mb-8">
                  {oemFeatures.map((f) => (
                    <div key={f.title} className="bg-white/[0.06] dark:bg-background/80 border border-white/10 dark:border-border rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="mb-2 bg-white/10 dark:bg-muted w-8 h-8 rounded-lg flex items-center justify-center">{f.icon}</div>
                        <div className="font-bold text-[14px] text-white dark:text-foreground mb-1">{f.title}</div>
                      </div>
                      <div className="text-[12px] text-white/60 dark:text-muted-foreground leading-normal">{f.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <a
                    href="mailto:contact@highbury.co.th"
                    className="inline-flex items-center justify-center w-full md:w-auto bg-[#E8A800] text-[#0A2B5E] px-8 py-3.5 rounded-xl font-black text-[15px] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  >
                    ปรึกษาและประมาณราคา OEM →
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Uniform Card */}
            <Reveal direction="right" delay={150}>
              <div className="bg-card border border-border rounded-2xl p-8 flex flex-col h-full hover:border-primary/25 hover:shadow-lg transition-all duration-300">
                <div className="inline-flex items-center gap-2 bg-[#1A6CC8]/10 border border-[#1A6CC8]/25 text-[#1A6CC8] px-3.5 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase mb-6 self-start">
                  🎽 Corporate Uniform
                </div>
                <h3 className="font-black text-[24px] text-foreground mb-2">เสื้อเชิ้ตยูนิฟอร์มพนักงาน</h3>
                <p className="text-muted-foreground text-[15px] md:text-[16px] leading-[1.7] mb-6">
                  สร้างความน่าเชื่อถือให้กับภาพลักษณ์องค์กรด้วยแพทเทิร์นที่สมส่วน ใส่สบาย ทรงสวย ทนทานต่อการซักรีดบ่อยครั้ง
                </p>
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {uniformFeatures.map((f) => (
                    <div key={f.title} className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between hover:border-primary transition-colors duration-200">
                      <div>
                        <div className="mb-2 bg-muted w-8 h-8 rounded-lg flex items-center justify-center">{f.icon}</div>
                        <div className="font-bold text-[14px] text-foreground mb-1">{f.title}</div>
                      </div>
                      <div className="text-[12px] text-muted-foreground leading-normal">{f.desc}</div>
                    </div>
                  ))}
                </div>
                {/* Fit block info */}
                <div className="flex items-center gap-3.5 p-4 bg-muted/40 border border-border rounded-xl mb-6">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <div className="font-bold text-[14px] text-foreground">เหมาะสำหรับทุกประเภทกลุ่มธุรกิจ</div>
                    <div className="text-[12px] text-muted-foreground leading-tight">องค์กรทั่วไป · สำนักงานราชการ · โรงแรม · ร้านอาหาร · SME และ Startups</div>
                  </div>
                </div>
                <div className="mt-auto">
                  <a
                    href="mailto:contact@highbury.co.th"
                    className="inline-flex items-center justify-center w-full md:w-auto bg-[#0A2B5E] dark:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-[15px] hover:bg-[#1a4484] dark:hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  >
                    ขอรับข้อมูลใบเสนอราคา →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Process steps */}
          <Reveal delay={200}>
            <div className="bg-card border border-border/80 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="text-center mb-10">
                <div className="font-bold text-[12px] uppercase tracking-widest text-primary dark:text-blue-400 mb-1">ขั้นตอนการให้บริการ</div>
                <h3 className="font-black text-[22px] text-foreground">ง่าย · รวดเร็ว · ใส่ใจทุกขั้นตอน</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { step: "01", icon: "💬", title: "ปรึกษาและวางแผน", desc: "แจ้งความต้องการ จำนวน สไตล์ และงบประมาณ" },
                  { step: "02", icon: "✏️", title: "ออกแบบและยืนยัน", desc: "รับแบบร่าง เลือกผ้า สี โลโก้ และอนุมัติแบบ" },
                  { step: "03", icon: "🏭", title: "เข้าสู่การผลิต", desc: "ตัดเย็บ ตรวจ QC และบรรจุตามรายการสั่ง" },
                  { step: "04", icon: "📦", title: "จัดส่งครบถ้วน", desc: "แพ็กแยกรายชื่อ จัดส่งพร้อมรายงานครบทุกไซส์" },
                ].map((s, i) => (
                  <div key={s.step} className="text-center relative group">
                    <div className="relative w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center text-3xl mx-auto mb-4 border border-border/40 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      {s.icon}
                    </div>
                    {i < 3 && (
                      <div className="hidden md:block absolute left-[calc(50%+4rem)] top-8 w-[calc(100%-8rem)] h-[1.5px] bg-border/80" />
                    )}
                    <div className="text-[12px] font-black text-primary dark:text-blue-400 tracking-wider mb-1.5">{s.step}</div>
                    <div className="font-bold text-[16px] text-foreground mb-1">{s.title}</div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed px-2">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <section className="py-24 px-6 sm:px-12 md:px-[6vw] bg-background">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start">
          <Reveal>
            <div className="md:sticky md:top-24">
              <SectionLabel>คำถามที่พบบ่อย</SectionLabel>
              <h2
                className="font-black text-foreground leading-[1.15] mb-4"
                style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
              >
                มีคำถามหรือ
                <br />
                ข้อสงสัยใด ๆ ไหม?
              </h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                เราได้รวบรวมคำถามที่ลูกค้าสอบถามบ่อยที่สุดเพื่อช่วยอำนวยความสะดวกในการตัดสินใจ
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {faqItems.map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div
                  className="bg-card border border-border/80 rounded-xl p-6.5 hover:border-primary/25 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3.5 mb-3">
                    <span className="flex items-center justify-center w-6.5 h-6.5 bg-blue-500/10 text-primary dark:text-blue-400 rounded-lg text-[13px] font-black flex-shrink-0 mt-0.5 border border-blue-500/20">
                      Q
                    </span>
                    <p className="font-bold text-[17px] text-foreground leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.q}</p>
                  </div>
                  <p className="text-[15px] text-muted-foreground leading-relaxed pl-[42px]">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── REVIEWS ─────────────────── */}
      <section className="py-24 px-6 sm:px-12 md:px-[6vw] bg-muted/20 border-y border-border/30">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <div className="text-center mb-16 max-w-xl mx-auto">
              <SectionLabel>รีวิวจากลูกค้า</SectionLabel>
              <h2
                className="font-black text-foreground leading-[1.15] mb-4"
                style={{ fontSize: "clamp(28px, 3.6vw, 46px)" }}
              >
                ลูกค้าของเรา
                <br />
                <span className="text-blue-600 dark:text-blue-400">พูดถึงความพึงพอใจอย่างไร</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <Reveal key={i} delay={i * 150} direction="scale">
                <div
                  className="v2-glow-card bg-card border border-border/60 rounded-xl p-8 hover:border-primary/25 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-4.5 w-4.5 fill-[#E8A800] text-[#E8A800]" />
                      ))}
                    </div>
                    <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.7] mb-6 italic">&ldquo;{r.text}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-3.5 border-t border-border/40 pt-5 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-primary dark:text-blue-400 flex items-center justify-center font-black text-[15px] flex-shrink-0 border border-blue-500/20">
                      {r.name.slice(2, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-[16px] text-foreground">{r.name}</div>
                      <div className="text-[13px] text-muted-foreground">{r.role}</div>
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
        className="py-24 px-6 text-white text-center relative overflow-hidden shadow-xl"
        style={{ background: "linear-gradient(135deg, #0A2B5E 0%, #1A3D75 50%, #2255A0 100%)" }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 40%)",
          }}
        />
        <Reveal direction="up">
          <div className="relative z-10 max-w-2xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 px-4 py-2 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#E8A800] rounded-full animate-pulse" />
              พร้อมให้บริการสั่งผลิตแล้ววันนี้
            </div>
            <h2 className="font-black text-3xl md:text-5xl leading-tight mb-5 text-white">
              เริ่มต้นสัมผัสความดูดีได้เลย
              <br />
              <span className="text-[#E8A800]">กับ Highbury International</span>
            </h2>
            <p className="text-white/80 text-[16px] md:text-[18px] leading-relaxed mb-10 max-w-lg mx-auto">
              เลือกสินค้าหลากหลายรุ่นในคอลเลกชันเพื่อสวมใส่และเสริมสร้างความเชื่อมั่นให้กับไลฟ์สไตล์คุณ
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-[#0A2B5E] px-9 py-4 rounded-xl font-black text-[16px] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.3)] transition-all duration-200 cursor-pointer"
              >
                ดูสินค้าทั้งหมด →
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-9 py-4 rounded-xl font-bold text-[16px] hover:border-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                สมัครสมาชิกใหม่
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
