"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStorefrontV3Safe } from "../storefront-shell";

interface ParallaxCraftStandardsProps {
  lang?: "th" | "en";
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export default function ParallaxCraftStandards({
  lang: propLang,
}: ParallaxCraftStandardsProps) {
  const v3 = useStorefrontV3Safe();
  const theme = v3?.theme || "dark";
  const lang = propLang || v3?.lang || "th";
  const isLight = theme === "light";

  // Refs for 60fps RAF Lerp (0.22 factor from parallax-landing-page skill)
  const trackRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const scene1TextRef = useRef<HTMLDivElement>(null);
  const scene1CardsRef = useRef<HTMLDivElement>(null);
  const scene2WrapRef = useRef<HTMLDivElement>(null);
  const scene2TextRef = useRef<HTMLDivElement>(null);
  const scene2CardRef = useRef<HTMLDivElement>(null);
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
      // Crossfade window: 0.38 -> 0.58
      const crossfade = smoothstep(0.38, 0.58, p);
      const op1 = 1 - smoothstep(0.36, 0.50, p);
      const op2 = smoothstep(0.46, 0.62, p);

      // Background 1: Macro Detail Studio (slow upward drift + subtle scale)
      if (bg1Ref.current) {
        const bg1Op = 1 - crossfade;
        const ty1 = -p * 44;
        const s1 = 1 + p * 0.045;
        bg1Ref.current.style.opacity = bg1Op.toFixed(3);
        bg1Ref.current.style.transform = prefersReducedMotion
          ? "none"
          : `translate3d(0, ${ty1.toFixed(1)}px, 0) scale(${s1.toFixed(4)})`;
        bg1Ref.current.style.visibility = bg1Op > 0.002 ? "visible" : "hidden";
      }

      // Background 2: Coastal Highway (counter-drift + settle scale)
      if (bg2Ref.current) {
        const bg2Op = crossfade;
        const ty2 = (1 - p) * 48;
        const s2 = 1.06 - p * 0.06;
        bg2Ref.current.style.opacity = bg2Op.toFixed(3);
        bg2Ref.current.style.transform = prefersReducedMotion
          ? "none"
          : `translate3d(0, ${ty2.toFixed(1)}px, 0) scale(${s2.toFixed(4)})`;
        bg2Ref.current.style.visibility = bg2Op > 0.002 ? "visible" : "hidden";
      }

      // Scene 1 Foreground Copy + Spec Cards (staggered parallax speed)
      if (scene1TextRef.current) {
        const tyText1 = prefersReducedMotion ? 0 : -p * 72;
        scene1TextRef.current.style.opacity = op1.toFixed(3);
        scene1TextRef.current.style.transform = `translate3d(0, ${tyText1.toFixed(1)}px, 0)`;
        scene1TextRef.current.style.visibility =
          op1 > 0.005 ? "visible" : "hidden";
        scene1TextRef.current.style.pointerEvents = op1 > 0.45 ? "auto" : "none";
      }

      if (scene1CardsRef.current) {
        const tyCards1 = prefersReducedMotion ? 0 : -p * 18;
        scene1CardsRef.current.style.transform = `translate3d(0, ${tyCards1.toFixed(1)}px, 0)`;
      }

      // Scene 2 Foreground Copy + Floating Liquid Glass Card (staggered 3D depth)
      if (scene2WrapRef.current) {
        scene2WrapRef.current.style.opacity = op2.toFixed(3);
        scene2WrapRef.current.style.visibility =
          op2 > 0.005 ? "visible" : "hidden";
        scene2WrapRef.current.style.pointerEvents = op2 > 0.45 ? "auto" : "none";
      }

      if (scene2TextRef.current) {
        const tyText2 = prefersReducedMotion ? 0 : (1 - op2) * 34;
        scene2TextRef.current.style.transform = `translate3d(0, ${tyText2.toFixed(1)}px, 0)`;
      }

      if (scene2CardRef.current) {
        // Foreground glass card moves with stronger parallax amplitude for 3D depth
        const tyCard2 = prefersReducedMotion
          ? 0
          : (1 - op2) * 64 + (0.75 - p) * 28;
        scene2CardRef.current.style.transform = `translate3d(0, ${tyCard2.toFixed(1)}px, 0)`;
      }

      // Progress Bar & Scene Counter HUD (01 / 02)
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
      if ( isVisible ) {
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
      className={`relative w-full lg:h-[220vh] transition-colors duration-300 ${
        isLight ? "bg-white" : "bg-[#07080B]"
      }`}
    >
      {/* Hash Navigation Anchors for #details and #standards */}
      <div
        id="details"
        className="absolute top-0 inset-x-0 h-px pointer-events-none scroll-mt-20"
      />
      <div
        id="standards"
        className="hidden lg:block absolute top-[58%] inset-x-0 h-px pointer-events-none scroll-mt-20"
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP PINNED PARALLAX STAGE (lg+: 100vh Pinned Scrollytelling)
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex sticky top-0 w-full h-screen overflow-hidden items-center">
        {/* ── BACKGROUND LAYER 1: Macro Detail Studio (Scene 1) ── */}
        <div
          ref={bg1Ref}
          className="absolute -inset-y-12 inset-x-0 pointer-events-none z-0 will-change-[transform,opacity]"
        >
          <div className="absolute inset-y-0 right-0 w-full lg:w-[78%] xl:w-[74%] 2xl:w-[68%] max-w-[1650px] v3-macro-image-mask">
            <Image
              src="/images/macro-detail.jpg"
              alt="Highbury Asian Fit Tailoring Details"
              fill
              sizes="(min-width: 1536px) 1650px, 100vw"
              className="object-cover object-[80%_20%]"
              priority
            />
          </div>
          {/* Left Readability Dissolve (No bottom fog!) */}
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "linear-gradient(to right, #FFFFFF 0%, #FFFFFF 22%, rgba(255, 255, 255, 0.96) 32%, rgba(255, 255, 255, 0.75) 44%, rgba(255, 255, 255, 0.25) 56%, transparent 70%)"
                : "linear-gradient(to right, #07080B 0%, #07080B 22%, rgba(7, 8, 11, 0.96) 32%, rgba(7, 8, 11, 0.75) 44%, rgba(7, 8, 11, 0.25) 56%, transparent 70%)",
            }}
          />
        </div>

        {/* ── BACKGROUND LAYER 2: Coastal Highway Landscape (Scene 2) ── */}
        <div
          ref={bg2Ref}
          style={{ opacity: 0, visibility: "hidden" }}
          className="absolute -inset-y-12 inset-x-0 pointer-events-none z-0 will-change-[transform,opacity]"
        >
          <Image
            src="/images/standards-landscape.jpg"
            alt="Highbury Standards Coastal Highway Tailoring"
            fill
            sizes="100vw"
            className="object-cover object-[center_32%]"
            priority
          />
          {/* Left Readability Dissolve (Models & Heads in center/right stay 100% clear & bright!) */}
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "linear-gradient(to right, #FFFFFF 0%, rgba(255, 255, 255, 0.94) 18%, rgba(255, 255, 255, 0.68) 28%, rgba(255, 255, 255, 0.12) 40%, transparent 50%)"
                : "linear-gradient(to right, #07080B 0%, rgba(7, 8, 11, 0.92) 18%, rgba(7, 8, 11, 0.62) 28%, rgba(7, 8, 11, 0.10) 40%, transparent 50%)",
            }}
          />
        </div>

        {/* Subtle Top & Bottom Edge Polish (Only 32px so it never creates a foggy band) */}
        <div
          className={`absolute inset-x-0 top-0 h-8 pointer-events-none z-10 ${
            isLight
              ? "bg-gradient-to-b from-white/40 to-transparent"
              : "bg-gradient-to-b from-[#07080B]/40 to-transparent"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-10 pointer-events-none z-10 ${
            isLight
              ? "bg-gradient-to-t from-white/40 to-transparent"
              : "bg-gradient-to-t from-[#07080B]/40 to-transparent"
          }`}
        />

        {/* ── SCENE 1 FOREGROUND: Macro Detail Copy & 3 Spec Cards ── */}
        <div
          ref={scene1TextRef}
          className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 will-change-[transform,opacity]"
        >
          <div className="max-w-md lg:max-w-[430px] space-y-5">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] ${
                isLight ? "text-[#0F172A]" : "text-white"
              }`}
            >
              {lang === "th" ? (
                <>
                  ความประณีต
                  <br />
                  ในทุกรายละเอียดโครงสร้าง.
                </>
              ) : (
                <>
                  Precision
                  <br />
                  in Every Detail.
                </>
              )}
            </h2>

            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? "text-[#475569]" : "text-[#E7E7E7]"
              }`}
            >
              {lang === "th"
                ? "ปกอัดกาวสองชั้นตั้งทรงคมชัด ฝีเข็ม 16–18 เข็มต่อนิ้ว และกระดุม 4 รูเย็บย้ำแน่นหนาเพื่อความทนทาน"
                : "Dual-fused collar stance, 16–18 SPI dense stitching, and cross-stitched 4-hole buttons for lasting durability."}
            </p>

            {/* Staggered Parallax Spec Cards */}
            <div
              ref={scene1CardsRef}
              className="grid grid-cols-3 gap-2.5 pt-2 will-change-transform"
            >
              {[
                {
                  val: "16–18",
                  titleTh: "ฝีเข็มต่อนิ้ว (SPI)",
                  titleEn: "SPI Density",
                  subTh: "ตะเข็บแน่น เรียบเนียน",
                  subEn: "Clean drape",
                },
                {
                  val: "2-Layer",
                  titleTh: "ปกอัดกาวคู่",
                  titleEn: "Dual Fused",
                  subTh: "ปกตั้งทรง ไม่ย้วย",
                  subEn: "Crisp stance",
                },
                {
                  val: "4-Hole",
                  titleTh: "กระดุม 4 รู",
                  titleEn: "Cross-Stitched",
                  subTh: "เย็บย้ำแน่นหนา",
                  subEn: "High strength",
                },
              ].map((spec) => (
                <div
                  key={spec.val}
                  className="p-3 sm:p-3.5 rounded-xl border transition-colors duration-300"
                  style={{
                    backgroundColor: isLight
                      ? "rgba(255, 255, 255, 0.80)"
                      : "rgba(10, 12, 16, 0.72)",
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    borderColor: isLight
                      ? "rgba(226, 232, 240, 0.9)"
                      : "rgba(255, 255, 255, 0.14)",
                    boxShadow: isLight
                      ? "inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), 0 8px 20px -6px rgba(15, 23, 42, 0.06)"
                      : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 10px 25px -8px rgba(0, 0, 0, 0.45)",
                  }}
                >
                  <div
                    className={`text-base sm:text-lg font-bold tracking-tight ${
                      isLight ? "text-[#0F172A]" : "text-white"
                    }`}
                  >
                    {spec.val}
                  </div>
                  <div
                    className={`text-[11px] font-semibold mt-1 ${
                      isLight ? "text-[#334155]" : "text-white/90"
                    }`}
                  >
                    {lang === "th" ? spec.titleTh : spec.titleEn}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${
                      isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                    }`}
                  >
                    {lang === "th" ? spec.subTh : spec.subEn}
                  </div>
                </div>
              ))}
            </div>

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
                  {lang === "th" ? "ดูแบบเสื้อทั้งหมด" : "View All Shirts"}
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

        {/* ── SCENE 2 FOREGROUND: Standards Landscape Copy & Floating Glass Card ── */}
        <div
          ref={scene2WrapRef}
          style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
          className="absolute inset-0 z-20 flex items-center will-change-opacity"
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div
                ref={scene2TextRef}
                className="col-span-7 space-y-6 max-w-xl will-change-transform"
              >
                <h2
                  className={`text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] ${
                    isLight ? "text-[#0F172A]" : "text-white"
                  }`}
                >
                  {lang === "th" ? (
                    <>
                      ขับเคลื่อนด้วย
                      <br />
                      มาตรฐานคุณภาพตรวจสอบ
                      <br />
                      ได้.
                    </>
                  ) : (
                    <>
                      Driven by
                      <br />
                      Verifiable Standards.
                    </>
                  )}
                </h2>

                <p
                  className={`text-sm sm:text-base leading-relaxed max-w-lg ${
                    isLight ? "text-[#475569]" : "text-[#E7E7E7]"
                  }`}
                >
                  {lang === "th"
                    ? "เสื้อเชิ้ตทุกตัวผ่านการตรวจเช็กฝีเข็มก่อนบรรจุ พร้อมการรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน และเวิร์กช็อปรองรับการสั่งตัดยูนิฟอร์มองค์กรตามมาตรฐาน"
                    : "Every shirt undergoes needle-to-seam inspection before packing, backed by a 7-day size exchange guarantee and dedicated OEM workshop capacity."}
                </p>

                <div className="pt-2">
                  <Link
                    href="https://lin.ee/T8tlget"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 group cursor-pointer border ${
                      isLight
                        ? "bg-[#163666] !text-white border-[#163666] hover:bg-[#112a52] shadow-xs"
                        : "bg-white text-[#0B0C0E] border-white hover:bg-white/90"
                    }`}
                  >
                    <span className={isLight ? "!text-white" : ""}>
                      {lang === "th"
                        ? "ปรึกษาสั่งตัดยูนิฟอร์มผ่าน LINE"
                        : "Consult Corporate Tailoring via LINE"}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${
                        isLight ? "!text-white" : ""
                      }`}
                    />
                  </Link>
                </div>
              </div>

              {/* Right Column: Staggered 3D Parallax Liquid Glass Card */}
              <div className="col-span-5 flex justify-end">
                <div
                  ref={scene2CardRef}
                  className="w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border will-change-transform"
                  style={{
                    backgroundColor: isLight
                      ? "rgba(255, 255, 255, 0.80)"
                      : "rgba(10, 12, 16, 0.72)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    borderColor: isLight
                      ? "rgba(255, 255, 255, 0.88)"
                      : "rgba(255, 255, 255, 0.14)",
                    boxShadow: isLight
                      ? "inset 0 1px 1px 0 rgba(255, 255, 255, 0.95), 0 24px 48px -15px rgba(15, 23, 42, 0.12)"
                      : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.18), 0 24px 48px -12px rgba(0, 0, 0, 0.55)",
                  }}
                >
                  <div>
                    <div
                      className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                        isLight ? "text-[#0F172A]" : "text-white"
                      }`}
                    >
                      {lang === "th" ? "7 วัน" : "7 Days"}
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-medium mt-1 ${
                        isLight ? "text-[#0F172A]" : "text-white/90"
                      }`}
                    >
                      {lang === "th"
                        ? "รับประกันเปลี่ยนไซส์ฟรี"
                        : "Free Size Exchange Guarantee"}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                      }`}
                    >
                      {lang === "th"
                        ? "นับจากวันรับพัสดุ หากลองแล้วไม่พอดีเปลี่ยนฟรีทันที"
                        : "From parcel delivery date; instant free exchange if fit is off."}
                    </div>
                  </div>

                  <div
                    className={`border-t pt-5 mt-5 ${
                      isLight ? "border-slate-200/80" : "border-white/10"
                    }`}
                  >
                    <div
                      className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                        isLight ? "text-[#0F172A]" : "text-white"
                      }`}
                    >
                      {lang === "th" ? "3,500 ตัว / เดือน" : "3,500 Pcs / Month"}
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-medium mt-1 ${
                        isLight ? "text-[#0F172A]" : "text-white/90"
                      }`}
                    >
                      {lang === "th"
                        ? "กำลังผลิตเวิร์กช็อป Highbury"
                        : "Highbury Workshop Capacity"}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                      }`}
                    >
                      {lang === "th"
                        ? "สายการผลิตพร้อมรองรับยูนิฟอร์มองค์กรและงานปักโลโก้"
                        : "Dedicated production line for corporate orders & logo embroidery."}
                    </div>
                  </div>

                  <div
                    className={`border-t pt-5 mt-5 ${
                      isLight ? "border-slate-200/80" : "border-white/10"
                    }`}
                  >
                    <div
                      className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                        isLight ? "text-[#0F172A]" : "text-white"
                      }`}
                    >
                      100%
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-medium mt-1 ${
                        isLight ? "text-[#0F172A]" : "text-white/90"
                      }`}
                    >
                      {lang === "th"
                        ? "QC ตรวจสอบรายตัวก่อนจัดส่ง"
                        : "Piece-by-Piece QC Inspection"}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isLight ? "text-[#475569]" : "text-[#D1D5DB]"
                      }`}
                    >
                      {lang === "th"
                        ? "ตรวจเช็กฝีเข็ม ตะเข็บกระดุม และการรีดก่อนส่งถึงมือคุณ"
                        : "Individual check on stitch density, buttons, and iron finish."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PARALLAX SCENE HUD (Inspired by parallax-landing-page frame counter & progress bar) ── */}
        <div
          className={`absolute bottom-6 right-8 z-30 flex items-center gap-3 px-3.5 py-2 rounded-full border backdrop-blur-md transition-colors ${
            isLight
              ? "bg-white/75 border-slate-200/80 text-[#0F172A] shadow-xs"
              : "bg-black/55 border-white/15 text-white"
          }`}
        >
          <button
            ref={dot1Ref}
            type="button"
            onClick={() => scrollToBeat(0)}
            className="text-[11px] font-semibold tracking-wider uppercase cursor-pointer transition-opacity"
          >
            {lang === "th" ? "โครงสร้าง" : "Craft"}
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
            {lang === "th" ? "มาตรฐาน" : "Standards"}
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
          MOBILE & TABLET (< lg): Clean, Fog-Free Curtain Stack
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Mobile Beat 1: Macro Detail */}
        <section className="relative w-full min-h-[600px] flex items-end overflow-hidden py-14">
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src="/images/macro-detail.jpg"
              alt="Highbury Asian Fit Tailoring Details"
              fill
              sizes="100vw"
              className="object-cover object-[75%_top]"
            />
            <div
              className={`absolute inset-0 ${
                isLight
                  ? "bg-gradient-to-t from-white via-white/85 via-42% to-transparent"
                  : "bg-gradient-to-t from-[#07080B] via-[#07080B]/85 via-42% to-transparent"
              }`}
            />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-44">
            <div className="max-w-md space-y-4">
              <h2
                className={`text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.15] ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}
              >
                {lang === "th" ? (
                  <>
                    ความประณีต
                    <br />
                    ในทุกรายละเอียดโครงสร้าง.
                  </>
                ) : (
                  <>
                    Precision
                    <br />
                    in Every Detail.
                  </>
                )}
              </h2>
              <p
                className={`text-sm leading-relaxed ${
                  isLight ? "text-[#475569]" : "text-[#E7E7E7]"
                }`}
              >
                {lang === "th"
                  ? "ปกอัดกาวสองชั้นตั้งทรงคมชัด ฝีเข็ม 16–18 เข็มต่อนิ้ว และกระดุม 4 รูเย็บย้ำแน่นหนาเพื่อความทนทาน"
                  : "Dual-fused collar stance, 16–18 SPI dense stitching, and cross-stitched 4-hole buttons for lasting durability."}
              </p>

              {/* Mobile Spec Cards */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { val: "16–18", label: lang === "th" ? "ฝีเข็ม/นิ้ว" : "SPI Density" },
                  { val: "2-Layer", label: lang === "th" ? "ปกอัดกาวคู่" : "Dual Fused" },
                  { val: "4-Hole", label: lang === "th" ? "กระดุม 4 รู" : "Cross-Stitched" },
                ].map((s) => (
                  <div
                    key={s.val}
                    className={`p-2.5 rounded-xl border backdrop-blur-md ${
                      isLight
                        ? "bg-white/80 border-slate-200/80 text-[#0F172A]"
                        : "bg-black/60 border-white/15 text-white"
                    }`}
                  >
                    <div className="text-sm font-bold">{s.val}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <Link
                  href="#models"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold ${
                    isLight
                      ? "bg-[#163666] !text-white"
                      : "bg-black text-white border border-white/20"
                  }`}
                >
                  <span className={isLight ? "!text-white" : ""}>
                    {lang === "th" ? "ดูแบบเสื้อทั้งหมด" : "View All Shirts"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Beat 2: Standards Landscape */}
        <section className="relative w-full min-h-[640px] flex items-center overflow-hidden py-16 rounded-t-3xl -mt-4 z-10 shadow-xl">
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src="/images/standards-landscape.jpg"
              alt="Highbury Standards Coastal Highway Tailoring"
              fill
              sizes="100vw"
              className="object-cover object-[70%_30%]"
            />
            <div
              className={`absolute inset-0 ${
                isLight
                  ? "bg-gradient-to-t from-white/95 via-white/75 via-45% to-transparent"
                  : "bg-gradient-to-t from-[#07080B]/95 via-[#07080B]/75 via-45% to-transparent"
              }`}
            />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pt-24">
            <div className="space-y-4 max-w-xl">
              <h2
                className={`text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.15] ${
                  isLight ? "text-[#0F172A]" : "text-white"
                }`}
              >
                {lang === "th" ? (
                  <>
                    ขับเคลื่อนด้วย
                    <br />
                    มาตรฐานคุณภาพตรวจสอบได้.
                  </>
                ) : (
                  <>
                    Driven by
                    <br />
                    Verifiable Standards.
                  </>
                )}
              </h2>
              <p
                className={`text-sm leading-relaxed ${
                  isLight ? "text-[#475569]" : "text-[#E7E7E7]"
                }`}
              >
                {lang === "th"
                  ? "เสื้อเชิ้ตทุกตัวผ่านการตรวจเช็กฝีเข็มก่อนบรรจุ พร้อมการรับประกันเปลี่ยนไซส์ฟรีภายใน 7 วัน"
                  : "Every shirt undergoes needle-to-seam inspection before packing, backed by a 7-day size exchange guarantee."}
              </p>
              <Link
                href="https://lin.ee/T8tlget"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold ${
                  isLight
                    ? "bg-[#163666] !text-white"
                    : "bg-white text-[#0B0C0E]"
                }`}
              >
                <span className={isLight ? "!text-white" : ""}>
                  {lang === "th"
                    ? "ปรึกษาสั่งตัดยูนิฟอร์มผ่าน LINE"
                    : "Consult Corporate Tailoring via LINE"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Metrics Glass Card */}
            <div
              className={`w-full max-w-md p-5 rounded-2xl border backdrop-blur-xl space-y-4 ${
                isLight
                  ? "bg-white/80 border-slate-200/80 text-[#0F172A]"
                  : "bg-black/65 border-white/15 text-white"
              }`}
            >
              <div>
                <div className="text-xl font-bold">{lang === "th" ? "7 วัน" : "7 Days"}</div>
                <div className="text-xs font-medium opacity-90">
                  {lang === "th" ? "รับประกันเปลี่ยนไซส์ฟรี" : "Free Size Exchange Guarantee"}
                </div>
              </div>
              <div className={`border-t pt-3 ${isLight ? "border-slate-200/80" : "border-white/10"}`}>
                <div className="text-xl font-bold">
                  {lang === "th" ? "3,500 ตัว / เดือน" : "3,500 Pcs / Month"}
                </div>
                <div className="text-xs font-medium opacity-90">
                  {lang === "th" ? "กำลังผลิตเวิร์กช็อป Highbury" : "Highbury Workshop Capacity"}
                </div>
              </div>
              <div className={`border-t pt-3 ${isLight ? "border-slate-200/80" : "border-white/10"}`}>
                <div className="text-xl font-bold">100%</div>
                <div className="text-xs font-medium opacity-90">
                  {lang === "th" ? "QC ตรวจสอบรายตัวก่อนจัดส่ง" : "Piece-by-Piece QC Inspection"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
