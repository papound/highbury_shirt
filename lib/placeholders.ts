/**
 * Helper to get the correct placeholder image path based on the product slug.
 * Rules:
 * - Char 1 (Type): 1 = Long Sleeve (LS), 2 = Short Sleeve (SS), 3 = 3/4 Sleeve (34)
 * - Char 2 (Gender): 3 = Women, 4 = Men
 */
export function getProductPlaceholderImage(slug: string): string {
  if (!slug || slug.length < 2) {
    return "/images/placeholders/men-ls.jpg";
  }
  const type = slug[0];
  const gender = slug[1];

  if (gender === "3") {
    // Women
    if (type === "2") return "/images/placeholders/women-ss.jpg";
    if (type === "3") return "/images/placeholders/women-34.jpg";
    return "/images/placeholders/women-ls.jpg";
  } else {
    // Men / Default
    if (type === "2") return "/images/placeholders/men-ss.jpg";
    return "/images/placeholders/men-ls.jpg";
  }
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
