/**
 * Local Highbury placeholder image mappings (Zero hotlinked stock photos).
 * SKU Rules:
 * - 14xxxx: Men's Long Sleeve
 * - 13xxxx: Women's Long Sleeve
 * - 24xxxx: Men's Short Sleeve
 * - 23xxxx: Women's Short Sleeve
 * - 33xxxx: Women's 3/4 Sleeve
 * - Pxxxxx: Polo Shirt
 */

export const CATEGORY_REAL_IMAGES: Record<string, string> = {
  "mens-ls": "/images/placeholders/men-ls.jpg",
  "womens-ls": "/images/placeholders/women-ls.jpg",
  "mens-ss": "/images/placeholders/men-ss.jpg",
  "womens-ss": "/images/placeholders/women-ss.jpg",
  "womens-34": "/images/placeholders/women-34.jpg",
  "polo": "/images/placeholders/men-ss.jpg",
  "default": "/images/hero-main.jpg",
};

export function getProductPlaceholderImage(slug: string, categoryNameOrSlug?: string): string {
  const cat = (categoryNameOrSlug || "").toLowerCase();
  const s = (slug || "").toUpperCase();

  if (cat.includes("โปโล") || cat.includes("polo") || s.startsWith("P")) {
    return CATEGORY_REAL_IMAGES["polo"];
  }
  if (cat.includes("สามส่วน") || cat.includes("3/4") || s.startsWith("33")) {
    return CATEGORY_REAL_IMAGES["womens-34"];
  }
  if ((cat.includes("ผู้หญิง") && cat.includes("แขนสั้น")) || s.startsWith("23")) {
    return CATEGORY_REAL_IMAGES["womens-ss"];
  }
  if ((cat.includes("ผู้ชาย") && cat.includes("แขนสั้น")) || s.startsWith("24")) {
    return CATEGORY_REAL_IMAGES["mens-ss"];
  }
  if ((cat.includes("ผู้หญิง") && cat.includes("แขนยาว")) || s.startsWith("13")) {
    return CATEGORY_REAL_IMAGES["womens-ls"];
  }
  if ((cat.includes("ผู้ชาย") && cat.includes("แขนยาว")) || s.startsWith("14")) {
    return CATEGORY_REAL_IMAGES["mens-ls"];
  }

  if (s.length >= 2) {
    const type = s[0];
    const gender = s[1];
    if (gender === "3") {
      if (type === "2") return CATEGORY_REAL_IMAGES["womens-ss"];
      if (type === "3") return CATEGORY_REAL_IMAGES["womens-34"];
      return CATEGORY_REAL_IMAGES["womens-ls"];
    } else {
      if (type === "2") return CATEGORY_REAL_IMAGES["mens-ss"];
      return CATEGORY_REAL_IMAGES["mens-ls"];
    }
  }

  return CATEGORY_REAL_IMAGES["default"];
}

export const COLOR_MAP: Record<string, string> = {
  "ดำ": "#000000",
  "กรม": "#0F1E36",
  "กรมท่า": "#0F1E36",
  "ม่วง": "#6B21A8",
  "ขาว": "#FFFFFF",
  "ฟ้า": "#38BDF8",
  "น้ำเงิน": "#1D4ED8",
  "เขียว": "#15803D",
  "แดง": "#B91C1C",
  "ชมพู": "#EC4899",
  "เหลือง": "#EAB308",
  "ส้ม": "#F97316",
  "ครีม": "#FFF7ED",
  "เทา": "#6B7280",
  "น้ำตาล": "#78350F",
  "มัสตาร์ด": "#CA8A04",
  "กากี": "#C5A880",
  "โอวัลติน": "#A17A5A",
};

export function getColorHex(colorName: string): string {
  const clean = colorName.trim();
  if (COLOR_MAP[clean]) return COLOR_MAP[clean];
  
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (clean.includes(key)) return value;
  }
  
  return "#262830";
}
