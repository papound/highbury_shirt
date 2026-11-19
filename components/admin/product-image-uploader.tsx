"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getColorHex } from "@/lib/placeholders";

const { uploadFiles } = genUploader<OurFileRouter>({ package: "custom" });

const GENERAL_COLOR_VALUE = "__general__";

export interface ProductImage {
  url: string;
  isPrimary: boolean;
  color?: string | null;
}

export interface ProductColorOption {
  name: string;
  hex: string;
  code?: string;
}

interface ProductImageUploaderProps {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  colorOptions?: ProductColorOption[];
  productName?: string;
}

export default function ProductImageUploader({
  value,
  onChange,
  colorOptions = [],
  productName = "สินค้า",
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColorTag, setSelectedColorTag] = useState<string | null>(
    () => value[0]?.color ?? null
  );
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const valueRef = useRef(value);
  valueRef.current = value;
  const pendingTargetRef = useRef<number | null>(null);
  const lastSettledIndexRef = useRef(0);

  const safeActiveIndex = value.length > 0 ? Math.min(activeIndex, value.length - 1) : 0;
  const activeImage = value[safeActiveIndex] ?? null;

  // Keep activeIndex clamped if value shrinks
  useEffect(() => {
    if (value.length === 0) {
      if (activeIndex !== 0) setActiveIndex(0);
      lastSettledIndexRef.current = 0;
      return;
    }
    if (activeIndex >= value.length) {
      const clamped = value.length - 1;
      setActiveIndex(clamped);
      lastSettledIndexRef.current = clamped;
    }
  }, [value.length, activeIndex]);

  // Combine variant colors with any colors already tagged on existing images
  const allColorOptions = useMemo(() => {
    const map = new Map<string, ProductColorOption>();
    for (const opt of colorOptions) {
      const trimmed = opt.name.trim();
      if (!trimmed) continue;
      if (!map.has(trimmed)) {
        map.set(trimmed, {
          name: trimmed,
          hex: opt.hex || getColorHex(trimmed),
          code: opt.code,
        });
      }
    }
    for (const img of value) {
      const trimmed = img.color?.trim();
      if (trimmed && !map.has(trimmed)) {
        map.set(trimmed, {
          name: trimmed,
          hex: getColorHex(trimmed),
        });
      }
    }
    return Array.from(map.values());
  }, [colorOptions, value]);

  const colorHexMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const opt of allColorOptions) {
      map.set(opt.name, opt.hex);
    }
    return map;
  }, [allColorOptions]);

  // Image count per color tag
  const { colorCounts, untaggedCount } = useMemo(() => {
    const counts = new Map<string, number>();
    let untagged = 0;
    for (const img of value) {
      const c = img.color?.trim() || null;
      if (!c) {
        untagged += 1;
      } else {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    }
    return { colorCounts: counts, untaggedCount: untagged };
  }, [value]);

  const selectedTagCount = useMemo(() => {
    if (!selectedColorTag) return untaggedCount;
    return colorCounts.get(selectedColorTag) ?? 0;
  }, [selectedColorTag, colorCounts, untaggedCount]);

  // Programmatic scroll strictly within the carousel track (never scrolls the page)
  const scrollToSlide = useCallback((targetIdx: number, instant = false) => {
    const imgs = valueRef.current;
    if (imgs.length === 0) return;
    const clamped = Math.max(0, Math.min(targetIdx, imgs.length - 1));
    setActiveIndex(clamped);

    const track = trackRef.current;
    if (!track) {
      lastSettledIndexRef.current = clamped;
      return;
    }

    const slideWidth = track.clientWidth;
    if (slideWidth <= 0) return;

    const targetLeft = clamped * slideWidth;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const alreadyThere = Math.abs(track.scrollLeft - targetLeft) < 2;
    if (instant || prefersReduced || alreadyThere) {
      pendingTargetRef.current = null;
      track.scrollTo({ left: targetLeft, behavior: "instant" as ScrollBehavior });
      lastSettledIndexRef.current = clamped;
      return;
    }

    pendingTargetRef.current = clamped;
    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, []);

  // Sync active slide from native track scroll & settled scroll (scrollend with debounced fallback)
  useEffect(() => {
    const track = trackRef.current;
    if (!track || value.length === 0) return;

    let rafId: number | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    const supportsScrollEnd = typeof window !== "undefined" && "onscrollend" in window;

    const getNearestIndex = () => {
      const w = track.clientWidth;
      if (w <= 0) return 0;
      const raw = Math.round(track.scrollLeft / w);
      return Math.max(0, Math.min(raw, valueRef.current.length - 1));
    };

    const handleSettled = () => {
      const settled = getNearestIndex();
      // Ignore stale settle if a programmatic scroll to another slide just started
      if (
        pendingTargetRef.current !== null &&
        settled !== pendingTargetRef.current &&
        Math.abs(track.scrollLeft - pendingTargetRef.current * track.clientWidth) > 4
      ) {
        return;
      }

      pendingTargetRef.current = null;
      setActiveIndex(settled);

      const settledImg = valueRef.current[settled];
      if (settledImg) {
        setSelectedColorTag(settledImg.color?.trim() || null);
      }

      if (settled !== lastSettledIndexRef.current) {
        lastSettledIndexRef.current = settled;
        const label = settledImg?.color ? `สี${settledImg.color}` : "ทั่วไป";
        setLiveAnnouncement(`รูปที่ ${settled + 1} จาก ${valueRef.current.length} (${label})`);
      }
    };

    const handleScroll = () => {
      if (pendingTargetRef.current === null && rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          const nearest = getNearestIndex();
          if (nearest !== activeIndexRef.current) {
            setActiveIndex(nearest);
          }
        });
      }

      if (!supportsScrollEnd) {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        fallbackTimer = setTimeout(handleSettled, 140);
      }
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    if (supportsScrollEnd) {
      track.addEventListener("scrollend", handleSettled, { passive: true });
    }

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (pendingTargetRef.current !== null) return;
            const w = track.clientWidth;
            if (w > 0) {
              track.scrollTo({
                left: activeIndexRef.current * w,
                behavior: "instant" as ScrollBehavior,
              });
            }
          })
        : null;
    resizeObserver?.observe(track);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      if (supportsScrollEnd) {
        track.removeEventListener("scrollend", handleSettled);
      }
      resizeObserver?.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [value.length]);

  // Keep active thumbnail centered inside the thumbnail strip without scrolling the page
  useEffect(() => {
    const strip = thumbRef.current;
    if (!strip || value.length <= 1) return;
    const activeBtn = strip.children[safeActiveIndex] as HTMLElement | undefined;
    if (!activeBtn) return;

    const targetLeft =
      activeBtn.offsetLeft - strip.clientWidth / 2 + activeBtn.clientWidth / 2;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReduced ? "instant" : "smooth",
    });
  }, [safeActiveIndex, value.length]);

  // Clicking a color tag pill selects upload target AND slides gallery to that color (like storefront)
  function handleColorTagClick(color: string | null) {
    setSelectedColorTag(color);
    const matchIdx = value.findIndex((img) => (img.color?.trim() || null) === color);
    if (matchIdx !== -1) {
      scrollToSlide(matchIdx);
    }
  }

  function handlePrev() {
    if (value.length <= 1) return;
    const base = pendingTargetRef.current ?? safeActiveIndex;
    const prevIdx = (base - 1 + value.length) % value.length;
    scrollToSlide(prevIdx);
    const targetImg = value[prevIdx];
    if (targetImg) setSelectedColorTag(targetImg.color?.trim() || null);
  }

  function handleNext() {
    if (value.length <= 1) return;
    const base = pendingTargetRef.current ?? safeActiveIndex;
    const nextIdx = (base + 1) % value.length;
    scrollToSlide(nextIdx);
    const targetImg = value[nextIdx];
    if (targetImg) setSelectedColorTag(targetImg.color?.trim() || null);
  }

  async function handleFiles(files: File[]) {
    if (!files.length) return;
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ (PNG, JPG, WEBP)");
      return;
    }

    setUploading(true);
    setProgress(0);
    const targetColor = selectedColorTag;

    try {
      const results = await uploadFiles("productImage", {
        files: imageFiles,
        onUploadProgress: ({ progress: p }) => setProgress(Math.round(p)),
      });

      const newImages: ProductImage[] = results.map((r) => ({
        url: r.ufsUrl ?? r.url,
        isPrimary: false,
        color: targetColor,
      }));

      const firstNewIndex = value.length;
      const merged = [...value, ...newImages];

      // If none is primary yet, set the first one as primary
      if (!merged.some((img) => img.isPrimary) && merged.length > 0) {
        merged[0] = { ...merged[0], isPrimary: true };
      }

      onChange(merged);

      const tagLabel = targetColor ? `สี${targetColor}` : "ทั่วไป";
      toast.success(`อัพโหลดสำเร็จ ${newImages.length} รูป (${tagLabel})`);
      setLiveAnnouncement(`อัพโหลดสำเร็จ ${newImages.length} รูป สำหรับ${tagLabel}`);

      // Jump gallery to the first newly uploaded image once rendered
      requestAnimationFrame(() => {
        scrollToSlide(firstNewIndex, firstNewIndex === 0);
      });
    } catch (err) {
      console.error("Upload failed", err);
      toast.error(
        err instanceof Error
          ? `อัพโหลดล้มเหลว: ${err.message}`
          : "อัพโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่"
      );
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    if (index < 0 || index >= value.length) return;
    const wasPrimary = value[index].isPrimary;
    const next = value.filter((_, i) => i !== index);
    if (wasPrimary && next.length > 0) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next);
    const nextIdx = next.length > 0 ? Math.min(index, next.length - 1) : 0;
    requestAnimationFrame(() => {
      if (next.length > 0) {
        scrollToSlide(nextIdx, true);
        setSelectedColorTag(next[nextIdx]?.color?.trim() || null);
      }
    });
  }

  function setPrimaryImage(index: number) {
    if (index < 0 || index >= value.length) return;
    onChange(value.map((img, i) => ({ ...img, isPrimary: i === index })));
    toast.success("ตั้งเป็นรูปหลักแล้ว");
  }

  function updateImageColor(index: number, colorVal: string | null) {
    if (index < 0 || index >= value.length) return;
    const normalized = !colorVal || colorVal === GENERAL_COLOR_VALUE ? null : colorVal;
    const next = value.map((img, i) =>
      i === index ? { ...img, color: normalized } : img
    );
    onChange(next);
    setSelectedColorTag(normalized);
  }

  function moveImage(fromIndex: number, direction: -1 | 1) {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= value.length) return;
    const next = [...value];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
    requestAnimationFrame(() => {
      scrollToSlide(toIndex, true);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    handleFiles(files);
  }

  const selectedTagHex = selectedColorTag
    ? colorHexMap.get(selectedColorTag) || getColorHex(selectedColorTag)
    : null;

  return (
    <div className="space-y-4">
      {/* Live polite status announcements for assistive technology */}
      <p className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </p>

      {/* Color Tag Selector Bar (Switches gallery color like storefront + sets upload tag) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Tag className="w-3.5 h-3.5" />
            <span>เลือกแท็กสี (กดเพื่อเลื่อนดูรูปสีนั้น หรือเลือกสีที่จะอัพโหลด)</span>
          </div>
          {allColorOptions.length > 0 && (
            <span className="text-[11px] text-muted-foreground">
              มีรูปแล้ว{" "}
              <span className="font-semibold text-foreground">
                {allColorOptions.filter((c) => (colorCounts.get(c.name) ?? 0) > 0).length}
              </span>
              /{allColorOptions.length} สี
            </span>
          )}
        </div>

        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="แท็กสีรูปภาพสินค้า"
        >
          {/* General / Untagged chip */}
          <button
            type="button"
            onClick={() => handleColorTagClick(null)}
            aria-pressed={selectedColorTag === null}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              selectedColorTag === null
                ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary/40 shadow-xs"
                : "border-border bg-background/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            <span>ทั่วไป</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 leading-none rounded-full",
                selectedColorTag === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {untaggedCount}
            </span>
          </button>

          {/* Per-color chips */}
          {allColorOptions.map((opt) => {
            const count = colorCounts.get(opt.name) ?? 0;
            const isSelected = selectedColorTag === opt.name;
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => handleColorTagClick(opt.name)}
                aria-pressed={isSelected}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isSelected
                    ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary/40 shadow-xs"
                    : count > 0
                    ? "border-border bg-background/60 text-foreground hover:border-primary/50"
                    : "border-dashed border-border/80 bg-background/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                <span
                  className="inline-block w-3 h-3 rounded-full border border-foreground/25 shrink-0 shadow-xs"
                  style={{ backgroundColor: opt.hex }}
                />
                <span>{opt.code ? `${opt.name} (${opt.code})` : opt.name}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 leading-none rounded-full",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : count > 0
                      ? "bg-muted text-foreground"
                      : "bg-muted/60 text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Helpful notice when selected color tag currently has 0 images while other images exist */}
        {value.length > 0 && selectedTagCount === 0 && (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              {selectedTagHex && (
                <span
                  className="inline-block w-3 h-3 rounded-full border border-foreground/25 shrink-0"
                  style={{ backgroundColor: selectedTagHex }}
                />
              )}
              <span className="text-muted-foreground">
                ยังไม่มีรูปภาพสำหรับ{" "}
                <strong className="text-foreground">
                  {selectedColorTag ? `สี${selectedColorTag}` : "ทั่วไป"}
                </strong>
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="h-7 px-2.5 text-xs shrink-0"
            >
              <ImagePlus className="w-3.5 h-3.5 mr-1" />
              เพิ่มรูป{selectedColorTag ? `สี${selectedColorTag}` : ""}
            </Button>
          </div>
        )}
      </div>

      {/* Main Layout: 2-column on desktop when images exist, single-column when empty */}
      <div
        className={cn(
          value.length > 0
            ? "grid grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr] gap-5 items-start"
            : "space-y-4"
        )}
      >
        {/* Storefront-Style Swipeable Gallery Preview */}
        {value.length > 0 && (
          <section
            role="region"
            aria-roledescription="carousel"
            aria-label={`ตัวอย่างรูปภาพ ${productName}`}
            className="space-y-3"
          >
            {/* Main Viewport */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted/30 border shadow-xs">
              {/* Previous / Next Controls placed before the track in DOM order */}
              {value.length > 1 && (
                <div className="pointer-events-none absolute inset-x-2.5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="รูปก่อนหน้า"
                    className="pointer-events-auto w-9 h-9 rounded-full bg-background/90 hover:bg-background text-foreground border border-border/60 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="รูปถัดไป"
                    className="pointer-events-auto w-9 h-9 rounded-full bg-background/90 hover:bg-background text-foreground border border-border/60 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Scroll-Snap Track */}
              <div
                ref={trackRef}
                tabIndex={0}
                role="group"
                aria-label="สไลด์รูปภาพสินค้า"
                className="admin-gallery-track w-full h-full focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring"
              >
                {value.map((img, idx) => (
                  <div
                    key={`${img.url}-${idx}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`รูปที่ ${idx + 1} จาก ${value.length}${img.color ? ` สี${img.color}` : ""}`}
                    className="admin-gallery-slide relative min-w-0 h-full select-none"
                  >
                    <Image
                      src={img.url}
                      alt={
                        img.color
                          ? `${productName} - สี${img.color}`
                          : `${productName} - รูปที่ ${idx + 1}`
                      }
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 360px"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              {/* Top-left Primary & Color Badges */}
              <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1.5">
                {activeImage?.isPrimary && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-0.5 shadow-sm">
                    <Star className="w-3 h-3 fill-current" />
                    รูปหลัก
                  </span>
                )}
                {activeImage && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 shadow-sm">
                    {activeImage.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                        style={{
                          backgroundColor:
                            colorHexMap.get(activeImage.color) ||
                            getColorHex(activeImage.color),
                        }}
                      />
                    )}
                    <span>{activeImage.color ? `สี${activeImage.color}` : "ทั่วไป"}</span>
                  </span>
                )}
              </div>

              {/* Bottom-left Storefront-style Index Counter Badge */}
              <div className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-black/65 text-white backdrop-blur-sm text-xs font-medium tracking-wide">
                {safeActiveIndex + 1} / {value.length}
                {activeImage?.color && (
                  <span className="ml-1.5 opacity-90 text-[11px]">
                    • สี{activeImage.color}
                  </span>
                )}
              </div>
            </div>

            {/* Storefront-Style Horizontal Thumbnails Strip */}
            <nav
              ref={thumbRef}
              aria-label="เลือกรูปภาพสินค้า"
              className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth"
            >
              {value.map((img, idx) => {
                const isActive = idx === safeActiveIndex;
                const swatchHex = img.color
                  ? colorHexMap.get(img.color) || getColorHex(img.color)
                  : null;
                return (
                  <button
                    key={`thumb-${img.url}-${idx}`}
                    type="button"
                    aria-label={`ดูรูปที่ ${idx + 1}${img.color ? ` สี${img.color}` : " ทั่วไป"}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => {
                      scrollToSlide(idx);
                      setSelectedColorTag(img.color?.trim() || null);
                    }}
                    className={cn(
                      "relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      isActive
                        ? "border-primary ring-2 ring-primary/40 shadow-sm scale-[1.03] opacity-100"
                        : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                    )}
                    title={img.color ? `สี${img.color}` : `รูปที่ ${idx + 1} (ทั่วไป)`}
                  >
                    <Image
                      src={img.url}
                      alt={img.color ? `สี${img.color}` : `รูปที่ ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                    {img.isPrimary && (
                      <span
                        className="absolute top-1 left-1 z-10 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs"
                        title="รูปหลัก"
                      >
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[10px] text-white text-center py-0.5 px-1 truncate font-medium flex items-center justify-center gap-1">
                      {swatchHex && (
                        <span
                          className="inline-block w-2 h-2 rounded-full border border-white/60 shrink-0"
                          style={{ backgroundColor: swatchHex }}
                        />
                      )}
                      <span className="truncate">{img.color || "ทั่วไป"}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </section>
        )}

        {/* Right / Bottom Controls: Active Image Editor + Single Upload Dropzone */}
        <div className="space-y-4">
          {/* Active Slide Controls (always reachable on touch & keyboard) */}
          {activeImage && (
            <div className="rounded-xl border bg-muted/20 p-3.5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground">
                  จัดการรูปที่ {safeActiveIndex + 1} จาก {value.length}
                </p>
                {value.length > 1 && (
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={safeActiveIndex === 0}
                      onClick={() => moveImage(safeActiveIndex, -1)}
                      aria-label="ย้ายรูปไปทางซ้าย"
                      title="ย้ายไปลำดับก่อนหน้า"
                      className="h-7 w-7 p-0"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={safeActiveIndex === value.length - 1}
                      onClick={() => moveImage(safeActiveIndex, 1)}
                      aria-label="ย้ายรูปไปทางขวา"
                      title="ย้ายไปลำดับถัดไป"
                      className="h-7 w-7 p-0"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Re-tag Color Select */}
              <div className="space-y-1.5">
                <label
                  htmlFor="active-image-color-tag"
                  className="text-xs text-muted-foreground block"
                >
                  แท็กสีของรูปนี้
                </label>
                <Select
                  value={activeImage.color?.trim() || GENERAL_COLOR_VALUE}
                  onValueChange={(val) => updateImageColor(safeActiveIndex, val)}
                >
                  <SelectTrigger
                    id="active-image-color-tag"
                    className="w-full h-9 bg-background rounded-lg border-border"
                  >
                    <SelectValue placeholder="เลือกแท็กสี">
                      {(val: string | null) => {
                        if (!val || val === GENERAL_COLOR_VALUE) {
                          return "ทั่วไป (ไม่ระบุสี)";
                        }
                        const opt = allColorOptions.find((c) => c.name === val);
                        const hex = opt?.hex || getColorHex(val);
                        return (
                          <span className="flex items-center gap-2">
                            <span
                              className="inline-block w-3 h-3 rounded-full border border-foreground/25 shrink-0"
                              style={{ backgroundColor: hex }}
                            />
                            <span>
                              {opt?.code ? `${val} (${opt.code})` : val}
                            </span>
                          </span>
                        );
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GENERAL_COLOR_VALUE} label="ทั่วไป (ไม่ระบุสี)">
                      ทั่วไป (ไม่ระบุสี)
                    </SelectItem>
                    {allColorOptions.map((opt) => (
                      <SelectItem
                        key={opt.name}
                        value={opt.name}
                        label={opt.code ? `${opt.name} (${opt.code})` : opt.name}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full border border-foreground/25 shrink-0"
                            style={{ backgroundColor: opt.hex }}
                          />
                          <span>
                            {opt.code ? `${opt.name} (${opt.code})` : opt.name}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Set Primary + Delete */}
              <div className="flex items-center gap-2 pt-0.5">
                <Button
                  type="button"
                  size="sm"
                  variant={activeImage.isPrimary ? "secondary" : "outline"}
                  disabled={activeImage.isPrimary}
                  onClick={() => setPrimaryImage(safeActiveIndex)}
                  className="flex-1 h-8 text-xs"
                >
                  <Star
                    className={cn(
                      "w-3.5 h-3.5 mr-1.5",
                      activeImage.isPrimary && "fill-current text-primary"
                    )}
                  />
                  {activeImage.isPrimary ? "รูปหลักปัจจุบัน" : "ตั้งเป็นรูปหลัก"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(safeActiveIndex)}
                  className="h-8 px-3 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  ลบรูป
                </Button>
              </div>
            </div>
          )}

          {/* Single Consolidated Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!isDragging) setIsDragging(true);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-5 sm:p-6 text-center transition-colors",
              uploading || isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
            )}
          >
            {uploading ? (
              <div className="space-y-2.5 max-w-xs mx-auto">
                <p className="text-sm font-medium text-foreground">
                  กำลังอัพโหลดรูปภาพ
                  {selectedColorTag ? ` (สี${selectedColorTag})` : " (ทั่วไป)"}...
                </p>
                <progress
                  className="admin-upload-progress"
                  max={100}
                  value={progress > 0 ? progress : undefined}
                  aria-label="ความคืบหน้าการอัพโหลดรูปภาพ"
                />
                <p className="text-xs text-muted-foreground">
                  {progress > 0 ? `${progress}%` : "กำลังเตรียมไฟล์..."}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Active Upload Tag Indicator */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
                  <span className="text-muted-foreground">อัพโหลดเข้าแท็ก:</span>
                  {selectedTagHex && (
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full border border-foreground/25 shrink-0"
                      style={{ backgroundColor: selectedTagHex }}
                    />
                  )}
                  <span>
                    {selectedColorTag ? `สี${selectedColorTag}` : "ทั่วไป (ไม่ระบุสี)"}
                  </span>
                </div>

                <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  ลากรูปมาวาง หรือคลิกเพื่อเลือกไฟล์
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP — สูงสุด 4MB/รูป, ได้สูงสุด 10 รูปต่อครั้ง
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  className="active:scale-95 transition-transform"
                >
                  <ImagePlus className="w-3.5 h-3.5 mr-1.5" />
                  {selectedColorTag
                    ? `เลือกรูปภาพ (สี${selectedColorTag})`
                    : "เลือกรูปภาพ"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
      />
    </div>
  );
}
