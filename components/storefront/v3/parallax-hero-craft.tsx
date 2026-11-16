"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

interface ParallaxHeroCraftProps {
  onOpenSizeGuide: () => void;
  lang?: "th" | "en";
  theme?: "dark" | "light";
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export default function ParallaxHeroCraft({
  onOpenSizeGuide,
  lang: propLang,
  theme: propTheme,
}: ParallaxHeroCraftProps) {
  const v3 = useStorefrontV3Safe();
  const theme = propTheme || v3?.theme || "dark";
  const lang = propLang || v3?.lang || "th";
  const isLight = theme === "light";

  // Refs for 60fps RAF Lerp (0.22 factor from parallax-landing-page skill)
  const trackRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const scene1TextRef = useRef<HTMLDivElement>(null);
  const scene1BarRef = useRef<HTMLDivElement>(null);
  const scene2WrapRef = useRef<HTMLDivElement>(null);
  const scene2CardRef = useRef<HTMLDivElement>(null);
  const scene2TextRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterTextRef = useRef<HTMLSpanElement>(null);
  const dot1Ref = useRef<HTMLButtonElement>(null);
  const dot2Ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let targetProgress = 0;
    let currentProgress = 0;
    let rafId: number | null = null;
    let isVisible = true;

    const computeTarget = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      targetProgress = clamp(-rect.top / scrollable, 0, 1);
    };

    const applySceneTransforms = (p: number) => {
      // Crossfade window: 0.36 -> 0.58
      const crossfade = smoothstep(0.36, 0.58, p);
      const op1 = 1 - smoothstep(0.34, 0.50, p);
      const op2 = smoothstep(0.45, 0.62, p);

      // Background 1: Hero Main Models (slow upward drift + subtle zoom)
      if (bg1Ref.current) {
        const bg1Op = 1 - crossfade;
        const ty1 = -p * 42;
        const s1 = 1 + p * 0.045;
        bg1Ref.current.style.opacity = bg1Op.toFixed(3);
        bg1Ref.current.style.transform = prefersReducedMotion
          ? "none"
          : `translate3d(0, ${ty1.toFixed(1)}px, 0) scale(${s1.toFixed(4)})`;
        bg1Ref.current.style.visibility = bg1Op > 0.002 ? "visible" : "hidden";
      }

      // Background 2: Craft Story Workshop (counter-drift + settle scale)
      if (bg2Ref.current) {
        const bg2Op = crossfade;
        const ty2 = (1 - p) * 44;
        const s2 = 1.055 - p * 0.055;
        bg2Ref.current.style.opacity = bg2Op.toFixed(3);
        bg2Ref.current.style.transform = prefersReducedMotion
          ? "none"
          : `translate3d(0, ${ty2.toFixed(1)}px, 0) scale(${s2.toFixed(4)})`;
        bg2Ref.current.style.visibility = bg2Op > 0.002 ? "visible" : "hidden";
      }

      // Scene 1: Hero Headline + CTA
      if (scene1TextRef.current) {
        const tyText1 = prefersReducedMotion ? 0 : -p * 74;
        scene1TextRef.current.style.opacity = op1.toFixed(3);
        scene1TextRef.current.style.transform = `translate3d(0, ${tyText1.toFixed(1)}px, 0)`;
        scene1TextRef.current.style.visibility =
          op1 > 0.005 ? "visible" : "hidden";
        scene1TextRef.current.style.pointerEvents = op1 > 0.45 ? "auto" : "none";
      }

      // Scene 1: Bottom 3-Spec Bar (glides down & fades as CraftStory takes over)
      if (scene1BarRef.current) {
        const barOp = 1 - smoothstep(0.28, 0.46, p);
        const tyBar = prefersReducedMotion ? 0 : (1 - barOp) * 40;
        scene1BarRef.current.style.opacity = barOp.toFixed(3);
        scene1BarRef.current.style.transform = `translate3d(0, ${tyBar.toFixed(1)}px, 0)`;
        scene1BarRef.current.style.visibility =
          barOp > 0.005 ? "visible" : "hidden";
      }

      // Scene 2: CraftStory Left Glass Card & Right Editorial Copy
      if (scene2WrapRef.current) {
        scene2WrapRef.current.style.opacity = op2.toFixed(3);
        scene2WrapRef.current.style.visibility =
          op2 > 0.005 ? "visible" : "hidden";
        scene2WrapRef.current.style.pointerEvents = op2 > 0.45 ? "auto" : "none";
      }

      if (scene2CardRef.current) {
        const tyCard2 = prefersReducedMotion
          ? 0
          : (1 - op2) * 58 + (0.76 - p) * 26;
        scene2CardRef.current.style.transform = `translate3d(0, ${tyCard2.toFixed(1)}px, 0)`;
      }

      if (scene2TextRef.current) {
        const tyText2 = prefersReducedMotion ? 0 : (1 - op2) * 32;
        scene2TextRef.current.style.transform = `translate3d(0, ${tyText2.toFixed(1)}px, 0)`;
      }

      // HUD Progress Bar & Counter (01 / 02 -> 02 / 02)
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      const isBeat2 = p >= 0.48;
      if (counterTextRef.current) {
        counterTextRef.current.textContent = isBeat2 ? "02 / 02" : "01 / 02";
      }
      if (dot1Ref.current && dot2Ref.current) {
        dot1Ref.current.style.opacity = isBeat2 ? "0.45" : "1";
        dot2Ref.current.style.opacity = isBeat2 ? "1" : "0.45";
      }
    };

    const tick = () => {
      if (isVisible) {
        const diff = targetProgress - currentProgress;
        if (Math.abs(diff) > 0.0005) {
          currentProgress += prefersReducedMotion ? diff : diff * 0.22;
          applySceneTransforms(currentProgress);
        } else if (currentProgress !== targetProgress) {
          currentProgress = targetProgress;
          applySceneTransforms(currentProgress);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    computeTarget();
    currentProgress = targetProgress;
    applySceneTransforms(currentProgress);
    rafId = requestAnimationFrame(tick);

    const onScroll = () => computeTarget();
    const onResize = () => {
      computeTarget();
      applySceneTransforms(currentProgress);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) computeTarget();
        });
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(track);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollToBeat = (beatIndex: 0 | 1) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const scrollable = Math.max(0, rect.height - window.innerHeight);
    const targetY = beatIndex === 0 ? trackTop : trackTop + scrollable * 0.78;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div
      ref={trackRef}
      className={`relative w-full lg:h-[215vh] transition-colors duration-300 ${
        isLight ? "bg-white text-[#0F172A]" : "bg-[#07080B] text-white"
      }`}
    >
      {/* Desktop Hash Navigation Anchor for #craftsmanship at 55% of Act I */}
      <div
        id="craftsmanship"
        className="hidden lg:block absolute top-[55%] inset-x-0 h-px pointer-events-none scroll-mt-20"
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          ACT I DESKTOP PINNED PARALLAX STAGE (lg+: 100vh Pinned Scrollytelling)
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex sticky top-0 w-full h-screen overflow-hidden flex-col justify-between">
        {/* ── BACKGROUND LAYER 1: Official Highbury Hero Models (Scene 1) ── */}
        <div
          ref={bg1Ref}
          className="absolute -inset-y-10 inset-x-0 pointer-events-none z-0 will-change-[transform,opacity]"
        >
          <Image
            src="/images/hero-main.jpg"
            alt="Highbury Asian Fit Tailoring Models"
            fill
            priority
            sizes="100vw"
            quality={95}
            className="object-cover object-[72%_center]"
          />
          {/* Crisp Horizontal Readability Gradient (Zero fog across models) */}
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "linear-gradient(to right, #FFFFFF 0%, #FFFFFF 22%, rgba(255, 255, 255, 0.95) 36%, rgba(255, 255, 255, 0.45) 50%, transparent 64%)"
                : "linear-gradient(to right, #07080B 0%, #07080B 20%, rgba(7, 8, 11, 0.80) 35%, rgba(7, 8, 11, 0.20) 48%, transparent 58%)",
            }}
          />
          <div
            className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${
              isLight ? "from-white/85" : "from-[#07080B]/80"
            } to-transparent`}
          />
        </div>

        {/* ── BACKGROUND LAYER 2: Craft Story Workshop (Scene 2) ── */}
        <div
          ref={bg2Ref}
          style={{ opacity: 0, visibility: "hidden" }}
          className="absolute -inset-y-10 inset-x-0 pointer-events-none z-0 will-change-[transform,opacity]"
        >
          <Image
            src="/images/craft-story.jpg"
            alt="Highbury Asian Fit Tailoring Craftsmanship"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[35%_top]"
          />
          {/* Right Readability Dissolve for CraftStory Editorial Heading */}
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "linear-gradient(to left, #FFFFFF 0%, rgba(255, 255, 255, 0.96) 20%, rgba(255, 255, 255, 0.72) 30%, rgba(255, 255, 255, 0.15) 42%, transparent 52%)"
                : "linear-gradient(to left, #07080B 0%, rgba(7, 8, 11, 0.94) 20%, rgba(7, 8, 11, 0.65) 30%, rgba(7, 8, 11, 0.12) 42%, transparent 52%)",
            }}
          />
          <div
            className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${
              isLight ? "from-white/50" : "from-[#07080B]/50"
            } to-transparent`}
          />
        </div>

        {/* ── SCENE 1 FOREGROUND: Hero Headline + Quantum Pill Buttons ── */}
        <div
          ref={scene1TextRef}
          className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 my-auto will-change-[transform,opacity]"
        >
          <div className="max-w-lg lg:max-w-2xl space-y-5">
            {/* Brand Monogram Pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-md shadow-xs"
              style={{
                backgroundColor: isLight ? "rgba(241, 245, 249, 0.9)" : "rgba(255, 255, 255, 0.06)",
                borderColor: isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.12)",
                color: isLight ? "#0F172A" : "#FFFFFF",
              }}
            >
              <Image
                src={isLight ? "/images/logo/home-monogram-black.svg" : "/images/logo/home-monogram-white.svg"}
                alt="Highbury Monogram"
                width={16}
                height={16}
                className="w-4 h-4 object-contain shrink-0 v3-home-monogram"
                priority
              />
              <span className="tracking-[0.16em] uppercase text-[11px] font-medium">
                HIGHBURY INTERNATIONAL
              </span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.35] sm:leading-[1.38] font-sans ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? (
                <>
                  ปฏิวัติความพอดี
                  <br />
                  เสื้อเชิ้ตสำหรับคนไทย
                </>
              ) : (
                <>
                  Revolutionary
                  <br />
                  Asian Fit Tailoring
                </>
              )}
            </h1>

            <div className="space-y-1 max-w-xl">
              <p
                className={`text-base sm:text-lg font-normal leading-relaxed ${
                  isLight ? "text-[#334155]" : "text-[#E7E7E7]"
                }`}
              >
                {lang === "th"
                  ? "ความประณีตระดับพรีเมียม สวมใส่สบาย คัตติ้งพอดีตัวสำหรับคนไทยโดยเฉพาะ"
                  : "Precision Fit. Easy-Care Luxury Designed for Asian Posture."}
              </p>
              <p
                className={`text-xs sm:text-sm ${
                  isLight ? "text-[#64748B]" : "text-[#9496A1]"
                }`}
              >
                {lang === "th"
                  ? "ตัดเย็บอย่างประณีตด้วยเนื้อผ้าระบายอากาศ รีดง่าย ทรงสวยตลอดวันทำงาน"
                  : "Performance. Comfort. Easy-Care Craftsmanship."}
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="#models" className="v3-btn-white">
                <span>
                  {lang === "th" ? "เลือกชมคอลเลกชัน" : "Explore Collection"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="v3-btn-glass"
              >
                <span>
                  {lang === "th" ? "คำนวณไซส์ Smart Size" : "Smart Size Finder"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── SCENE 1 BOTTOM SPEC BAR: S–5XL / 100% Premium Cotton / 7 Days ── */}
        <div
          ref={scene1BarRef}
          className={`relative z-20 w-full border-t py-5 sm:py-6 transition-colors duration-200 will-change-[transform,opacity] ${
            isLight
              ? "border-[#E5E7EB] bg-[#F8F9FA]/95 text-[#0F172A] backdrop-blur-md"
              : "border-[#262830] bg-[#0E1015]/95 text-white backdrop-blur-md"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div
                  className={`text-xl sm:text-2xl font-semibold ${
                    isLight ? "text-[#0F172A]" : "text-white"
                  }`}
                >
                  S – 5XL
                </div>
                <div
                  className={`text-xs mt-0.5 ${
                    isLight ? "text-[#64748B]" : "text-[#9496A1]"
                  }`}
                >
                  {lang === "th"
                    ? 'ช่วงไซส์มาตรฐาน (รอบอก 35" - 52.5")'
                    : 'Standard Range (Chest 35" - 52.5")'}
                </div>
              </div>

              <div
                className={`border-l pl-8 ${
                  isLight ? "border-[#E5E7EB]" : "border-[#262830]"
                }`}
              >
                <div
                  className={`text-xl sm:text-2xl font-semibold ${
                    isLight ? "text-[#0F172A]" : "text-white"
                  }`}
                >
                  100% Premium Cotton
                </div>
                <div
                  className={`text-xs mt-0.5 ${
                    isLight ? "text-[#64748B]" : "text-[#9496A1]"
                  }`}
                >
                  {lang === "th"
                    ? "ผ้าฝ้าย Premium Cotton รีดง่าย คืนทรง"
                    : "Easy-Care Long-Staple Cotton"}
                </div>
              </div>

              <div
                className={`border-l pl-8 ${
                  isLight ? "border-[#E5E7EB]" : "border-[#262830]"
                }`}
              >
                <div
                  className={`text-xl sm:text-2xl font-semibold ${
                    isLight ? "text-[#0F172A]" : "text-white"
                  }`}
                >
                  {lang === "th" ? "7 วัน" : "7 Days"}
                </div>
                <div
                  className={`text-xs mt-0.5 ${
                    isLight ? "text-[#64748B]" : "text-[#9496A1]"
                  }`}
                >
                  {lang === "th"
                    ? "เปลี่ยนไซส์ฟรีภายใน 7 วันหลังรับพัสดุ"
                    : "Free Size Exchange within 7 Days"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE 2 FOREGROUND: CraftStory Left Glass Card & Right Editorial Copy ── */}
        <div
          ref={scene2WrapRef}
          style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
          className="absolute inset-0 z-20 flex items-center will-change-opacity"
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-12 items-center">
              {/* Left Column: Staggered 3D Liquid Glass Card with 3 Craftsmanship Specs */}
              <div className="col-span-5 flex justify-start">
                <div
                  ref={scene2CardRef}
                  className="w-full max-w-md p-6 sm:p-8 rounded-2xl border space-y-6 will-change-transform"
                  style={{
                    backgroundColor: isLight
                      ? "rgba(255, 255, 255, 0.78)"
                      : "rgba(10, 12, 16, 0.72)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    borderColor: isLight
                      ? "rgba(255, 255, 255, 0.88)"
                      : "rgba(255, 255, 255, 0.14)",
                    boxShadow: isLight
                      ? "inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), 0 20px 40px -15px rgba(0, 0, 0, 0.08)"
                      : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.18), 0 24px 48px -12px rgba(0, 0, 0, 0.55)",
                  }}
                >
                  <div>
                    <div
                      className={`text-base font-semibold tracking-tight ${
                        isLight ? "text-[#0F172A]" : "text-white"
                      }`}
                    >
                      {lang === "th"
                        ? "โครงสร้างปกอัดกาวสองชั้น"
                        : "Dual-Fused Collar Stance"}
                    </div>
                    <div
                      className={`text-sm mt-1 leading-relaxed ${
                        isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                      }`}
                    >
                      {lang === "th"
                        ? "ปกตั้งทรงคมชัด ไม่ย้วย อยู่ทรงตลอดวันแม้ไม่ผูกเนกไท"
                        : "Two-layer fusing maintains crisp stance throughout the workday without a tie."}
                    </div>
                  </div>

                  <div
                    className={`border-t pt-5 ${
                      isLight ? "border-slate-200/80" : "border-white/10"
                    }`}
                  >
                    <div
                      className={`text-base font-semibold tracking-tight ${
                        isLight ? "text-[#0F172A]" : "text-white"
                      }`}
                    >
                      {lang === "th"
                        ? "วงแขนคัตติ้งเฉพาะคนไทย"
                        : "Sculpted Asian Fit Armhole"}
                    </div>
                    <div
                      className={`text-sm mt-1 leading-relaxed ${
                        isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                      }`}
                    >
                      {lang === "th"
                        ? "องศาวงแขนเว้าลึกพอดี ลดการรั้งตึงช่วงไหล่ ยกแขนและขยับตัวคล่องตัว"
                        : "Calibrated armhole curvature eliminates shoulder tension during movement."}
                    </div>
                  </div>

                  <div
                    className={`border-t pt-5 ${
                      isLight ? "border-slate-200/80" : "border-white/10"
                    }`}
                  >
                    <div
                      className={`text-base font-semibold tracking-tight ${
                        isLight ? "text-[#0F172A]" : "text-white"
                      }`}
                    >
                      {lang === "th"
                        ? "เนื้อผ้า Easy-Care คืนทรงหลังซัก"
                        : "Easy-Care Wrinkle Recovery"}
                    </div>
                    <div
                      className={`text-sm mt-1 leading-relaxed ${
                        isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                      }`}
                    >
                      {lang === "th"
                        ? "สะบัดแขวนหลังซัก คืนทรงไว ประหยัดเวลารีดกว่า 50%"
                        : "Rebounds post-wash to reduce ironing time by half."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Heading, Copy & Pill CTA */}
              <div
                ref={scene2TextRef}
                className="col-span-7 space-y-6 max-w-xl ml-auto will-change-transform"
              >
                <h2
                  className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] ${
                    isLight ? "text-[#0F172A]" : "text-white"
                  }`}
                >
                  {lang === "th" ? (
                    <>
                      มิติใหม่ของงานตัดเย็บ
                      <br />
                      ที่ใส่สบายได้ทุกวันทำงาน.
                    </>
                  ) : (
                    <>
                      A New Era
                      <br />
                      of Everyday Tailoring.
                    </>
                  )}
                </h2>

                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isLight ? "text-[#475569]" : "text-[#E7E7E7]"
                  }`}
                >
                  {lang === "th"
                    ? "คำนวณสัดส่วนช่วงไหล่ วงแขน และความยาวเสื้อให้พอดีเมื่อสอดเข้ากางเกง ตัดเย็บจากเวิร์กช็อปที่มีกำลังผลิต 3,500 ตัวต่อเดือน"
                    : "Engineered shoulder widths, sculpted armholes, and tuck-in lengths crafted in our 3,500 pcs/month workshop."}
                </p>

                <div className="pt-2">
                  <Link
                    href="#models"
                    className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 group cursor-pointer ${
                      isLight
                        ? "bg-[#163666] !text-white hover:bg-[#112a52] shadow-xs"
                        : "bg-black text-white border border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <span className={isLight ? "!text-white" : ""}>
                      {lang === "th"
                        ? "เลือกดูคอลเลกชันสินค้า"
                        : "Explore Collection"}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${
                        isLight ? "!text-white" : ""
                      }`}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACT I SCENE HUD (Bottom-Right Chapter Switcher & Progress Bar) ── */}
        <div
          className={`absolute bottom-24 right-8 z-30 flex items-center gap-3 px-3.5 py-2 rounded-full border backdrop-blur-md transition-colors ${
            isLight
              ? "bg-white/80 border-slate-200/80 text-[#0F172A] shadow-xs"
              : "bg-black/60 border-white/15 text-white"
          }`}
        >
          <button
            ref={dot1Ref}
            type="button"
            onClick={() => scrollToBeat(0)}
            className="text-[11px] font-semibold tracking-wider uppercase cursor-pointer transition-opacity"
          >
            {lang === "th" ? "จุดเริ่มต้น" : "Hero"}
          </button>
          <div
            className={`w-14 h-1 rounded-full overflow-hidden ${
              isLight ? "bg-slate-900/15" : "bg-white/20"
            }`}
          >
            <div
              ref={progressBarRef}
              className={`h-full w-full origin-left ${
                isLight ? "bg-[#163666]" : "bg-white"
              }`}
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <button
            ref={dot2Ref}
            type="button"
            onClick={() => scrollToBeat(1)}
            style={{ opacity: 0.45 }}
            className="text-[11px] font-semibold tracking-wider uppercase cursor-pointer transition-opacity"
          >
            {lang === "th" ? "งานตัดเย็บ" : "Tailoring"}
          </button>
          <span
            ref={counterTextRef}
            className={`text-[10px] font-mono pl-1.5 border-l ${
              isLight
                ? "border-slate-300 text-slate-500"
                : "border-white/20 text-white/70"
            }`}
          >
            01 / 02
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE & TABLET (< lg): Clean Curtain Stack
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Mobile Beat 1: Hero */}
        <section
          className={`relative w-full min-h-[88vh] flex flex-col justify-between overflow-hidden ${
            isLight ? "bg-white text-[#0F172A]" : "bg-[#07080B] text-white"
          }`}
        >
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src="/images/hero-main.jpg"
              alt="Highbury Asian Fit Tailoring Models"
              fill
              priority
              sizes="100vw"
              quality={90}
              className="object-cover object-[62%_center] sm:object-[68%_center]"
            />
            <div
              className={`absolute inset-0 ${
                isLight
                  ? "bg-gradient-to-t from-white via-white/80 via-40% to-transparent"
                  : "bg-gradient-to-t from-[#07080B] via-[#07080B]/80 via-40% to-transparent"
              }`}
            />
          </div>

          <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-32 pb-12 mt-auto">
            <div className="max-w-lg space-y-4">
              {/* Brand Monogram Pill Mobile */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-md shadow-xs"
                style={{
                  backgroundColor: isLight ? "rgba(241, 245, 249, 0.9)" : "rgba(255, 255, 255, 0.06)",
                  borderColor: isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.12)",
                  color: isLight ? "#0F172A" : "#FFFFFF",
                }}
              >
                <Image
                  src={isLight ? "/images/logo/home-monogram-black.svg" : "/images/logo/home-monogram-white.svg"}
                  alt="Highbury Monogram"
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain shrink-0 v3-home-monogram"
                  priority
                />
                <span className="tracking-[0.16em] uppercase text-[11px] font-medium">
                  HIGHBURY INTERNATIONAL
                </span>
              </div>

              <h1
                className={`text-4xl sm:text-5xl font-medium tracking-tight leading-[1.32] ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}
              >
                {lang === "th" ? (
                  <>
                    ปฏิวัติความพอดี
                    <br />
                    เสื้อเชิ้ตสำหรับคนไทย
                  </>
                ) : (
                  <>
                    Revolutionary
                    <br />
                    Asian Fit Tailoring
                  </>
                )}
              </h1>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isLight ? "text-[#334155]" : "text-[#E7E7E7]"
                }`}
              >
                {lang === "th"
                  ? "ความประณีตระดับพรีเมียม สวมใส่สบาย คัตติ้งพอดีตัวสำหรับคนไทยโดยเฉพาะ"
                  : "Precision Fit. Easy-Care Luxury Designed for Asian Posture."}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="#models" className="v3-btn-white">
                  <span>
                    {lang === "th" ? "เลือกชมคอลเลกชัน" : "Explore Collection"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="v3-btn-glass"
                >
                  <span>
                    {lang === "th"
                      ? "คำนวณไซส์ Smart Size"
                      : "Smart Size Finder"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Spec Bar */}
          <div
            className={`relative z-10 w-full border-t py-4 px-4 sm:px-6 ${
              isLight
                ? "border-[#E5E7EB] bg-[#F8F9FA] text-[#0F172A]"
                : "border-[#262830] bg-[#0E1015] text-white"
            }`}
          >
            <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
              <div>
                <div className="text-base sm:text-lg font-semibold">S – 5XL</div>
                <div className="text-[10px] opacity-75">
                  {lang === "th" ? 'รอบอก 35"-52.5"' : 'Chest 35"-52.5"'}
                </div>
              </div>
              <div
                className={`border-l pl-3 ${
                  isLight ? "border-[#E5E7EB]" : "border-[#262830]"
                }`}
              >
                <div className="text-base sm:text-lg font-semibold">Cotton</div>
                <div className="text-[10px] opacity-75">
                  {lang === "th" ? "รีดง่าย คืนทรง" : "Easy-Care"}
                </div>
              </div>
              <div
                className={`border-l pl-3 ${
                  isLight ? "border-[#E5E7EB]" : "border-[#262830]"
                }`}
              >
                <div className="text-base sm:text-lg font-semibold">
                  {lang === "th" ? "7 วัน" : "7 Days"}
                </div>
                <div className="text-[10px] opacity-75">
                  {lang === "th" ? "เปลี่ยนไซส์ฟรี" : "Free Exchange"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Beat 2: CraftStory */}
        <section className="relative w-full min-h-[620px] flex items-center overflow-hidden py-16">
          <Image
            src="/images/craft-story.jpg"
            alt="Highbury Asian Fit Tailoring Craftsmanship"
            fill
            sizes="100vw"
            className="object-cover object-[25%_top]"
          />
          <div
            className={`absolute inset-0 ${
              isLight
                ? "bg-gradient-to-t from-white/95 via-white/80 via-40% to-transparent"
                : "bg-gradient-to-t from-[#07080B]/95 via-[#07080B]/80 via-40% to-transparent"
            }`}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pt-24">
            <div className="space-y-4 max-w-xl">
              <h2
                className={`text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.15] ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}
              >
                {lang === "th" ? (
                  <>
                    มิติใหม่ของงานตัดเย็บ
                    <br />
                    ที่ใส่สบายได้ทุกวันทำงาน.
                  </>
                ) : (
                  <>
                    A New Era
                    <br />
                    of Everyday Tailoring.
                  </>
                )}
              </h2>
              <p
                className={`text-sm leading-relaxed ${
                  isLight ? "text-[#475569]" : "text-[#E7E7E7]"
                }`}
              >
                {lang === "th"
                  ? "คำนวณสัดส่วนช่วงไหล่ วงแขน และความยาวเสื้อให้พอดีเมื่อสอดเข้ากางเกง ตัดเย็บจากเวิร์กช็อปที่มีกำลังผลิต 3,500 ตัวต่อเดือน"
                  : "Engineered shoulder widths, sculpted armholes, and tuck-in lengths crafted in our 3,500 pcs/month workshop."}
              </p>
            </div>

            <div
              className={`w-full max-w-md p-5 rounded-2xl border backdrop-blur-xl space-y-4 ${
                isLight
                  ? "bg-white/80 border-slate-200/80 text-[#0F172A]"
                  : "bg-black/65 border-white/15 text-white"
              }`}
            >
              <div>
                <div className="text-sm font-semibold">
                  {lang === "th"
                    ? "โครงสร้างปกอัดกาวสองชั้น"
                    : "Dual-Fused Collar Stance"}
                </div>
                <div className="text-xs opacity-80 mt-0.5">
                  {lang === "th"
                    ? "ปกตั้งทรงคมชัด ไม่ย้วย อยู่ทรงตลอดวันแม้ไม่ผูกเนกไท"
                    : "Two-layer fusing maintains crisp stance without a tie."}
                </div>
              </div>
              <div
                className={`border-t pt-3 ${
                  isLight ? "border-slate-200/80" : "border-white/10"
                }`}
              >
                <div className="text-sm font-semibold">
                  {lang === "th"
                    ? "วงแขนคัตติ้งเฉพาะคนไทย"
                    : "Sculpted Asian Fit Armhole"}
                </div>
                <div className="text-xs opacity-80 mt-0.5">
                  {lang === "th"
                    ? "องศาวงแขนเว้าลึกพอดี ลดการรั้งตึงช่วงไหล่"
                    : "Calibrated armhole curvature eliminates shoulder tension."}
                </div>
              </div>
              <div
                className={`border-t pt-3 ${
                  isLight ? "border-slate-200/80" : "border-white/10"
                }`}
              >
                <div className="text-sm font-semibold">
                  {lang === "th"
                    ? "เนื้อผ้า Easy-Care คืนทรงหลังซัก"
                    : "Easy-Care Wrinkle Recovery"}
                </div>
                <div className="text-xs opacity-80 mt-0.5">
                  {lang === "th"
                    ? "สะบัดแขวนหลังซัก คืนทรงไว ประหยัดเวลารีดกว่า 50%"
                    : "Rebounds post-wash to reduce ironing time by half."}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
