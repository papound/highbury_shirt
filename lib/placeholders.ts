/**
 * Helper to get the correct placeholder image path based on the product slug and/or category.
 * Rules based on Highbury SKU system:
 * - 14xxxx: เสื้อเชิ้ตผู้ชาย แขนยาว (Men's Long Sleeve)
 * - 13xxxx: เสื้อเชิ้ตผู้หญิง แขนยาว (Women's Long Sleeve)
 * - 24xxxx: เสื้อเชิ้ตผู้ชาย แขนสั้น (Men's Short Sleeve)
 * - 23xxxx: เสื้อเชิ้ตผู้หญิง แขนสั้น (Women's Short Sleeve)
 * - 33xxxx: เสื้อเชิ้ตผู้หญิง แขนสามส่วน (Women's 3/4 Sleeve)
 * - Pxxxxx: เสื้อโปโล (Polo Shirt)
 */

export const CATEGORY_REAL_IMAGES: Record<string, string> = {
  // Men Long Sleeve
  "mens-ls": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop",
  // Women Long Sleeve
  "womens-ls": "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=900&auto=format&fit=crop",
  // Men Short Sleeve
  "mens-ss": "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=900&auto=format&fit=crop",
  // Women Short Sleeve
  "womens-ss": "https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=900&auto=format&fit=crop",
  // Women 3/4 Sleeve
  "womens-34": "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=900&auto=format&fit=crop",
  // Polo Shirt
  "polo": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=900&auto=format&fit=crop",
  // Default Flagship
  "default": "https://images.unsplash.com/photo-1620012253295-c15c429fbb41?q=80&w=900&auto=format&fit=crop",
};

export function getProductPlaceholderImage(slug: string, categoryNameOrSlug?: string): string {
  const cat = (categoryNameOrSlug || "").toLowerCase();
  const s = (slug || "").toUpperCase();

  // 1. By Category Name if provided
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

  // 2. By legacy slug length / format
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
  
  // Look for sub-string matches
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (clean.includes(key)) return value;
  }
  
  return "#E2E8F0"; // Default light gray fallback
}
