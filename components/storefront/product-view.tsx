"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Ruler, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/hooks/use-cart";
import { useStorefrontV3Safe } from "./storefront-shell";
import { toast } from "sonner";
import colorMap from "@/lib/color-map.json";

export interface ProductImageItem {
  id: string;
  url: string;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
  variantId?: string | null;
}

export interface ProductVariantItem {
  id: string;
  color: string;
  colorHex?: string | null;
  size: string;
  sku: string;
  price: number;
  stock: number;
  images?: ProductImageItem[];
}

export interface ProductViewProps {
  product: {
    id: string;
    name: string;
    nameTh: string;
    slug: string;
    description?: string | null;
    descTh?: string | null;
    status: string;
    category: {
      nameTh: string;
      slug: string;
    };
    images: ProductImageItem[];
    variants: ProductVariantItem[];
  };
  placeholderImage: string;
}

interface GalleryImage {
  id: string;
  url: string;
  altText: string | null;
  color?: string | null;
  isPrimary?: boolean;
}

export default function ProductView({ product, placeholderImage }: ProductViewProps) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const v3 = useStorefrontV3Safe();

  const openSizeGuide = () => {
    v3?.openSizeGuide?.();
  };

  // Build unique gallery images combining product-level & variant-level images
  const gallery = useMemo(() => {
    const list: GalleryImage[] = [];
    const seen = new Set<string>();

    // 1. Add product-level images
    for (const img of product.images || []) {
      if (!seen.has(img.url)) {
        seen.add(img.url);

        let color: string | null = null;
        if (img.variantId) {
          const v = product.variants.find((variant) => variant.id === img.variantId);
          if (v) color = v.color;
        }

        // Fallback 1: match altText with known colors
        if (!color && img.altText) {
          const matched = product.variants.find(
            (v) => v.color.trim().toLowerCase() === img.altText?.trim().toLowerCase()
          );
          if (matched) color = matched.color;
        }

        // Fallback 2: match from filename pattern with variant SKU and color-map
        if (!color && img.url) {
          const m = img.url.match(/[-_]([0-9]+)(?:[-_][0-9]+)?\.[a-zA-Z0-9]+$/);
          if (m) {
            const code = m[1];
            const matchedBySku = product.variants.find((v) => {
              const parts = v.sku.split("_");
              return parts.length >= 2 && parts[1] === code;
            });
            if (matchedBySku) {
              color = matchedBySku.color;
            } else {
              const thaiColor = (colorMap as Record<string, { thai: string }>)[code]?.thai;
              if (thaiColor) {
                const matchedByThai = product.variants.find(
                  (v) => v.color.trim() === thaiColor.trim()
                );
                if (matchedByThai) color = matchedByThai.color;
              }
            }
          }
        }

        list.push({
          id: img.id,
          url: img.url,
          altText: img.altText ?? null,
          color,
          isPrimary: img.isPrimary,
        });
      }
    }

    // 2. Add variant-level images
    for (const v of product.variants || []) {
      for (const vImg of v.images || []) {
        if (!seen.has(vImg.url)) {
          seen.add(vImg.url);
          list.push({
            id: vImg.id,
            url: vImg.url,
            altText: vImg.altText ?? `${product.nameTh} - สี${v.color}`,
            color: v.color,
            isPrimary: vImg.isPrimary,
          });
        } else {
          // If already in list but lacked color, link it
          const existing = list.find((item) => item.url === vImg.url);
          if (existing && !existing.color) {
            existing.color = v.color;
          }
        }
      }
    }

    return list;
  }, [product.images, product.variants, product.nameTh]);

  const displayImages = useMemo(() => {
    if (gallery.length > 0) return gallery;
    return [
      {
        id: "placeholder",
        url: placeholderImage,
        altText: product.nameTh,
        color: null,
        isPrimary: true,
      },
    ];
  }, [gallery, placeholderImage, product.nameTh]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Main Image Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: displayImages.length > 1,
    skipSnaps: false,
    duration: 25,
  });

  // Fullscreen Lightbox Carousel
  const [lightboxRef, lightboxApi] = useEmblaCarousel({
    loop: displayImages.length > 1,
    skipSnaps: false,
    duration: 25,
  });

  const thumbRef = useRef<HTMLDivElement>(null);

  // Sync selected index when user swipes on main gallery
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
    const activeImg = displayImages[idx];
    if (activeImg?.color && activeImg.color !== selectedColor) {
      setSelectedColor(activeImg.color);
    }
  }, [emblaApi, displayImages, selectedColor]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Sync when user swipes inside Lightbox
  const onLightboxSelect = useCallback(() => {
    if (!lightboxApi) return;
    const idx = lightboxApi.selectedScrollSnap();
    setSelectedIndex(idx);
    if (emblaApi && emblaApi.selectedScrollSnap() !== idx) {
      emblaApi.scrollTo(idx, true);
    }
  }, [lightboxApi, emblaApi]);

  useEffect(() => {
    if (!lightboxApi) return;
    lightboxApi.on("select", onLightboxSelect);
    lightboxApi.on("reInit", onLightboxSelect);
    return () => {
      lightboxApi.off("select", onLightboxSelect);
      lightboxApi.off("reInit", onLightboxSelect);
    };
  }, [lightboxApi, onLightboxSelect]);

  // When Lightbox opens, scroll to selectedIndex
  useEffect(() => {
    if (isLightboxOpen && lightboxApi) {
      lightboxApi.scrollTo(selectedIndex, true);
    }
  }, [isLightboxOpen, lightboxApi, selectedIndex]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (!thumbRef.current) return;
    const activeThumb = thumbRef.current.children[selectedIndex] as HTMLElement | undefined;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedIndex]);

  // Lightbox keyboard navigation (Escape, Left, Right) & scroll locking
  useEffect(() => {
    if (!isLightboxOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        lightboxApi?.scrollPrev();
      } else if (e.key === "ArrowRight") {
        lightboxApi?.scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, lightboxApi]);


  // Available colors
  const colors = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.color)));
  }, [product.variants]);

  // Total stock per color across all sizes, and total stock across entire product
  const colorStockMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of product.variants) {
      const key = v.color.trim();
      map.set(key, (map.get(key) ?? 0) + (v.stock ?? 0));
    }
    return map;
  }, [product.variants]);

  const totalProductStock = useMemo(() => {
    return product.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  }, [product.variants]);

  function isColorOutOfStock(color?: string | null): boolean {
    if (!color) return product.variants.length === 0 || totalProductStock <= 0;
    const key = color.trim();
    if (!colorStockMap.has(key)) return product.variants.length === 0 || totalProductStock <= 0;
    return (colorStockMap.get(key) ?? 0) <= 0;
  }

  // Sizes for the product
  const standardSizes = ["SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
  const variantSizes = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.size)));
  }, [product.variants]);

  const displaySizes = useMemo(() => {
    const inStandard = standardSizes.filter((s) => variantSizes.includes(s));
    const nonStandard = variantSizes.filter((s) => !standardSizes.includes(s));
    return [...inStandard, ...nonStandard];
  }, [variantSizes]);

  // Currently selected variant
  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const cartQty = selectedVariant
    ? (cartItems.find((i) => i.variantId === selectedVariant.id)?.quantity ?? 0)
    : 0;
  const remaining = selectedVariant ? Math.max(0, selectedVariant.stock - cartQty) : 0;

  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const maxPrice = Math.max(...product.variants.map((v) => v.price));
  const displayPrice = selectedVariant
    ? selectedVariant.price
    : minPrice === maxPrice
    ? minPrice
    : null;

  // Find image matching color
  function getImageForColor(color: string): string | null {
    // 1. Direct color tag in gallery
    const inGallery = gallery.find((img) => img.color === color);
    if (inGallery) return inGallery.url;

    // 2. Variant image for this color
    const variantWithImg = product.variants.find(
      (v) => v.color === color && v.images && v.images.length > 0
    );
    if (variantWithImg?.images?.[0]?.url) return variantWithImg.images[0].url;

    // 3. AltText matching color
    const altMatch = gallery.find(
      (img) => img.altText && img.altText.toLowerCase().includes(color.toLowerCase())
    );
    if (altMatch) return altMatch.url;

    // 4. Match URL pattern with variant SKU color code
    const variantForColor = product.variants.find((v) => v.color === color);
    if (variantForColor?.sku) {
      const parts = variantForColor.sku.split("_");
      if (parts.length >= 2) {
        const code = parts[1];
        const matchByCode = gallery.find((img) => {
          const m = img.url.match(/[-_]([0-9]+)(?:[-_][0-9]+)?\.[a-zA-Z0-9]+$/);
          return m && m[1] === code;
        });
        if (matchByCode) return matchByCode.url;
      }
    }

    return null;
  }

  // Handle color selection
  function handleColorSelect(color: string) {
    setSelectedColor(color);
    setSelectedSize(null);

    const matchingImage = getImageForColor(color);
    if (matchingImage) {
      const idx = displayImages.findIndex((img) => img.url === matchingImage);
      if (idx !== -1) {
        setSelectedIndex(idx);
        emblaApi?.scrollTo(idx);
      }
    }
  }

  // Handle thumbnail click
  function handleThumbnailClick(img: GalleryImage, idx: number) {
    setSelectedIndex(idx);
    emblaApi?.scrollTo(idx);
    if (img.color && img.color !== selectedColor) {
      setSelectedColor(img.color);
      setSelectedSize(null);
    }
  }

  // Add to cart
  function handleAddToCart() {
    if (!selectedVariant) {
      toast.error("กรุณาเลือกสีและไซส์");
      return;
    }
    if (qty > remaining) {
      toast.error(remaining === 0 ? "สินค้าหมดแล้ว" : `คงเหลือเพียง ${remaining} ตัว`);
      return;
    }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productNameTh: product.nameTh,
      slug: product.slug,
      color: selectedVariant.color,
      size: selectedVariant.size,
      sku: selectedVariant.sku,
      imageUrl: selectedVariant.images?.[0]?.url || displayImages[selectedIndex]?.url || placeholderImage,
      unitPrice: selectedVariant.price,
      quantity: qty,
      stock: selectedVariant.stock,
    });
    toast.success(`เพิ่ม "${product.nameTh}" ลงตะกร้าแล้ว 🛒`);
  }

  const currentImg = displayImages[selectedIndex]?.url || placeholderImage;
  const isPlaceholder = currentImg === placeholderImage || currentImg.includes("placeholders");

  const activeGalleryItem = useMemo(
    () => gallery.find((img) => img.url === currentImg),
    [gallery, currentImg]
  );
  const activeColor = selectedColor ?? activeGalleryItem?.color ?? null;
  const isActiveVariantOutOfStock = isColorOutOfStock(activeColor);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Left: Image Gallery with Swipe & Zoom */}
      <div className="space-y-4">
        {/* Main Image Slider with Swipe */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted/20 border shadow-sm group">
          {/* Embla Viewport for Swiping */}
          <div
            ref={emblaRef}
            className="overflow-hidden w-full h-full cursor-grab active:cursor-grabbing"
          >
            <div className="flex h-full touch-pan-y">
              {displayImages.map((img, idx) => {
                const isPlaceholder =
                  img.url === placeholderImage || img.url.includes("placeholders");
                return (
                  <div
                    key={img.id || img.url || idx}
                    className="relative flex-[0_0_100%] min-w-0 h-full select-none cursor-pointer"
                    onClick={() => {
                      setSelectedIndex(idx);
                      setIsLightboxOpen(true);
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${product.nameTh} - รูปที่ ${idx + 1}`}
                      fill
                      className={
                        isPlaceholder
                          ? "object-contain p-6 bg-[#FAF6EE]"
                          : "object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      }
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={idx === 0}
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Out of Stock Overlay on active variant */}
          {isActiveVariantOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-black/65 !text-white text-base sm:text-xl font-medium flex items-center justify-center text-center whitespace-nowrap shadow-md">
                สินค้าหมด
              </div>
            </div>
          )}

          {/* Floating Action: View Fullscreen Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm text-xs font-medium transition-all duration-150 shadow-md hover:scale-105 cursor-pointer"
            title="กดเพื่อดูรูปภาพขนาดเต็ม"
            aria-label="ดูรูปภาพขนาดเต็ม"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ดูรูปใหญ่</span>
          </button>

          {/* Floating Index Counter Badge */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm text-xs font-medium tracking-wide">
              {selectedIndex + 1} / {displayImages.length}
              {displayImages[selectedIndex]?.color && (
                <span className="ml-1.5 opacity-90 text-[11px]">
                  • สี{displayImages[selectedIndex].color}
                </span>
              )}
            </div>
          )}

          {/* Floating Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  emblaApi?.scrollPrev();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 dark:bg-black/70 dark:hover:bg-black/90 dark:text-white shadow-md flex items-center justify-center transition-all duration-150 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 cursor-pointer"
                aria-label="รูปก่อนหน้า"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  emblaApi?.scrollNext();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 dark:bg-black/70 dark:hover:bg-black/90 dark:text-white shadow-md flex items-center justify-center transition-all duration-150 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 cursor-pointer"
                aria-label="รูปถัดไป"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails Strip */}
        {displayImages.length > 1 && (
          <div
            ref={thumbRef}
            className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scroll-smooth"
          >
            {displayImages.map((img, idx) => {
              const isActive = idx === selectedIndex;
              const isThumbOutOfStock = isColorOutOfStock(img.color);
              return (
                <button
                  key={img.id || img.url || idx}
                  type="button"
                  onClick={() => handleThumbnailClick(img, idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 relative rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer focus:outline-none ${
                    isActive
                      ? "border-primary ring-2 ring-primary/40 shadow-sm scale-[1.02]"
                      : "border-muted hover:border-primary/50 opacity-70 hover:opacity-100"
                  }`}
                  title={img.altText || (img.color ? `สี ${img.color}` : `รูปที่ ${idx + 1}`)}
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? `${product.nameTh} - รูปที่ ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  {isThumbOutOfStock && (
                    <div className="absolute inset-0 pb-3 flex items-center justify-center pointer-events-none z-10">
                      <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/65 !text-white text-[9px] sm:text-[10px] font-medium flex items-center justify-center text-center leading-none whitespace-nowrap">
                        สินค้าหมด
                      </span>
                    </div>
                  )}
                  {img.color && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[10px] !text-white text-center py-0.5 truncate px-1 font-medium z-20">
                      {img.color}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Product Info & Purchase Form */}
      <div className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{product.category.nameTh}</p>
          <h1 className="text-2xl md:text-3xl font-bold">{product.nameTh}</h1>
          {product.name !== product.nameTh && (
            <p className="text-muted-foreground">{product.name}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">SKU by variant</Badge>
          {product.status === "ACTIVE" && !isActiveVariantOutOfStock ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-none">
              มีสินค้า
            </Badge>
          ) : (
            <Badge variant="destructive">สินค้าหมด</Badge>
          )}
        </div>

        {product.descTh && (
          <p className="text-muted-foreground leading-relaxed">{product.descTh}</p>
        )}

        {/* Pricing */}
        <div className="text-2xl font-bold text-primary">
          {displayPrice != null
            ? `฿${displayPrice.toLocaleString()}`
            : `฿${minPrice.toLocaleString()} – ฿${maxPrice.toLocaleString()}`}
        </div>

        {/* Color Selection */}
        <div>
          <p className="text-sm font-medium mb-2">
            สี: {selectedColor && <span className="text-muted-foreground font-normal">{selectedColor}</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = product.variants.find((v) => v.color === color);
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`px-3 py-1.5 text-sm rounded-md border-2 transition-all flex items-center cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 font-medium text-primary shadow-sm"
                      : "border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  {variant?.colorHex && (
                    <span
                      className="inline-block w-3.5 h-3.5 rounded-full mr-1.5 border border-black/10 shadow-sm shrink-0"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                  )}
                  {color}
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Selection */}
        {selectedColor ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">ไซส์:</p>
              <button
                type="button"
                onClick={openSizeGuide}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer group"
              >
                <Ruler className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
                <span className="underline underline-offset-4">ดูตารางไซส์</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {displaySizes.map((size) => {
                const variant = product.variants.find(
                  (v) => v.color === selectedColor && v.size === size
                );
                const inStock = (variant?.stock ?? 0) > 0;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => inStock && setSelectedSize(size)}
                    disabled={!inStock}
                    className={`w-12 h-12 text-sm rounded-md border-2 transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 font-semibold text-primary shadow-sm"
                        : inStock
                        ? "border-border hover:border-primary/50 text-foreground"
                        : "border-border opacity-40 cursor-not-allowed line-through text-muted-foreground"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">เลือกสีก่อนเพื่อตรวจสอบไซส์ที่พร้อมส่ง</span>
            <button
              type="button"
              onClick={openSizeGuide}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className="underline underline-offset-4">ดูตารางเทียบไซส์</span>
            </button>
          </div>
        )}

        {/* Stock indicator */}
        {selectedVariant && (
          <p className="text-sm text-muted-foreground">
            🏷 SKU: <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{selectedVariant.sku}</code>{" "}
            {remaining > 0 ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-none ml-1">
                คงเหลือ {remaining} ตัว
              </Badge>
            ) : (
              <Badge variant="destructive" className="ml-1">
                {selectedVariant.stock === 0 ? "หมด" : "เพิ่มในตะกร้าครบแล้ว"}
              </Badge>
            )}
          </p>
        )}

        {/* Quantity + Add to Cart */}
        <div className="flex gap-3 pt-2">
          <div className="flex items-center border rounded-md bg-background">
            <button
              type="button"
              className="px-3.5 py-2 hover:bg-secondary transition-colors text-base font-semibold"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="px-4 text-sm font-medium">{qty}</span>
            <button
              type="button"
              className="px-3.5 py-2 hover:bg-secondary transition-colors text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setQty((q) => Math.min(remaining, q + 1))}
              disabled={!selectedVariant || qty >= remaining}
            >
              +
            </button>
          </div>

          <Button
            size="lg"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0 || remaining === 0}
          >
            {isActiveVariantOutOfStock || (remaining === 0 && selectedVariant)
              ? "สินค้าหมด"
              : "🛒 เพิ่มลงตะกร้า"}
          </Button>
        </div>

        {/* Size Guide Helper */}
        <div
          onClick={openSizeGuide}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openSizeGuide();
            }
          }}
          className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/70 cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Ruler className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground">ไม่มั่นใจไซส์เสื้อ? เปิดตารางเทียบไซส์ Highbury</p>
              <p className="text-[11px] text-muted-foreground truncate">ตารางรอบอก ความยาวเสื้อ แขนเสื้อ ชาย/หญิง พร้อมระบบช่วยคำนวณไซส์</p>
            </div>
          </div>
          <span className="text-xs font-medium text-primary shrink-0 group-hover:underline">
            ดูตารางไซส์ &rarr;
          </span>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <Card>
            <CardContent className="p-3 text-sm">
              <p className="font-medium">🚚 จัดส่งทั่วประเทศ</p>
              <p className="text-muted-foreground text-xs">ค่าส่ง ฿50</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-sm">
              <p className="font-medium">💳 PromptPay</p>
              <p className="text-muted-foreground text-xs">ชำระสะดวก รวดเร็ว</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`ดูรูปภาพ ${product.nameTh}`}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white backdrop-blur-md animate-in fade-in duration-200"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 shrink-0 select-none">
            <div className="min-w-0 pr-4">
              <h2 className="text-sm sm:text-base font-semibold truncate text-white">
                {product.nameTh}
              </h2>
              <p className="text-xs text-white/70">
                รูปที่ {selectedIndex + 1} จาก {displayImages.length}
                {displayImages[selectedIndex]?.color && (
                  <span className="ml-2 font-medium text-white/90">
                    (สี{displayImages[selectedIndex].color})
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="ปิด (Esc)"
              aria-label="ปิด"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Lightbox Carousel with Swipe */}
          <div className="relative flex-1 min-h-0 w-full overflow-hidden flex items-center justify-center p-2 sm:p-6">
            <div
              ref={lightboxRef}
              className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <div className="flex h-full touch-pan-y">
                {displayImages.map((img, idx) => (
                  <div
                    key={`lightbox-${img.id || img.url || idx}`}
                    className="relative flex-[0_0_100%] min-w-0 h-full flex items-center justify-center select-none"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        setIsLightboxOpen(false);
                      }
                    }}
                  >
                    <div className="relative w-full h-full max-w-4xl max-h-[75vh] sm:max-h-[82vh] flex items-center justify-center pointer-events-none">
                      <Image
                        src={img.url}
                        alt={img.altText || product.nameTh}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        priority
                        draggable={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left & Right Navigation Buttons */}
            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    lightboxApi?.scrollPrev();
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 active:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all duration-150 shadow-lg cursor-pointer"
                  title="รูปก่อนหน้า (ลูกศรซ้าย)"
                  aria-label="รูปก่อนหน้า"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    lightboxApi?.scrollNext();
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 active:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all duration-150 shadow-lg cursor-pointer"
                  title="รูปถัดไป (ลูกศรขวา)"
                  aria-label="รูปถัดไป"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          {displayImages.length > 1 && (
            <div className="shrink-0 px-4 py-3 border-t border-white/10 bg-black/50 backdrop-blur-sm overflow-x-auto">
              <div className="flex gap-2 justify-center max-w-full min-w-max mx-auto">
                {displayImages.map((img, idx) => {
                  const isActive = idx === selectedIndex;
                  return (
                    <button
                      key={`lightbox-thumb-${img.id || img.url || idx}`}
                      type="button"
                      onClick={() => {
                        setSelectedIndex(idx);
                        lightboxApi?.scrollTo(idx);
                        if (emblaApi) emblaApi.scrollTo(idx);
                      }}
                      className={`relative w-14 h-14 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-white ring-2 ring-white/50 scale-105 opacity-100"
                          : "border-white/20 opacity-50 hover:opacity-80"
                      }`}
                      title={img.altText || `ภาพ ${idx + 1}`}
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || `ภาพ ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
