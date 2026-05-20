"use client";

import { useEffect, useRef, type ReactNode } from "react";

// ─── Scroll-triggered reveal ───────────────────────────────────────────────────
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}

export function Reveal({ children, className = "", delay = 0, direction = "up" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("v2-revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const dirClass =
    direction === "left"
      ? "v2-reveal-left"
      : direction === "right"
        ? "v2-reveal-right"
        : direction === "scale"
          ? "v2-reveal-scale"
          : "v2-reveal-up";

  return (
    <div ref={ref} className={`v2-reveal ${dirClass} ${className}`}>
      {children}
    </div>
  );
}

// ─── Infinite marquee ──────────────────────────────────────────────────────────
interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Marquee({ children, speed = 30, className = "" }: MarqueeProps) {
  return (
    <div className={`v2-marquee-wrapper overflow-hidden ${className}`}>
      <div
        className="v2-marquee-track flex gap-12 whitespace-nowrap"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

// ─── Floating particles / decorative blobs ─────────────────────────────────────
export function FloatingBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="v2-blob v2-blob-1 absolute w-[300px] h-[300px] rounded-full bg-[#1A6CC8]/5 blur-[80px]" />
      <div className="v2-blob v2-blob-2 absolute w-[250px] h-[250px] rounded-full bg-[#D42B2B]/5 blur-[60px]" />
      <div className="v2-blob v2-blob-3 absolute w-[200px] h-[200px] rounded-full bg-[#E8A800]/5 blur-[70px]" />
    </div>
  );
}

// ─── Animated counter ──────────────────────────────────────────────────────────
interface CounterProps {
  target: number;
  suffix?: string;
  className?: string;
}

export function Counter({ target, suffix = "", className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount(el, target);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  function animateCount(el: HTMLSpanElement, target: number) {
    const duration = 1500;
    const start = performance.now();

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  return <span ref={ref} className={className}>0{suffix}</span>;
}

// ─── Tilt card on hover ────────────────────────────────────────────────────────
interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)";
  }

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// ─── Typewriter text ───────────────────────────────────────────────────────────
interface TypewriterProps {
  texts: string[];
  className?: string;
}

export function Typewriter({ texts, className = "" }: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const idx = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let charIdx = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      const current = texts[idx.current];
      if (!isDeleting) {
        charIdx++;
        el!.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          timeout = setTimeout(() => { isDeleting = true; tick(); }, 2000);
          return;
        }
        timeout = setTimeout(tick, 60);
      } else {
        charIdx--;
        el!.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          isDeleting = false;
          idx.current = (idx.current + 1) % texts.length;
          timeout = setTimeout(tick, 400);
          return;
        }
        timeout = setTimeout(tick, 30);
      }
    }

    tick();
    return () => clearTimeout(timeout);
  }, [texts]);

  return (
    <span className={className}>
      <span ref={ref} />
      <span className="v2-cursor">|</span>
    </span>
  );
}
