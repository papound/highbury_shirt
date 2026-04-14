/**
 * One-time script: update colorHex of all ProductVariant rows based on the
 * canonical color map (matched by Thai color name, case-insensitive trim).
 *
 * Run with:
 *   npx tsx prisma/patch-color-hex.ts
 */

import { prisma } from "../lib/prisma";

const COLOR_MAP: Record<string, { english: string; hex: string }> = {
  ขาว: { english: "white", hex: "#FFFFFF" },
  ครีม: { english: "cream", hex: "#FFFDD0" },
  ฟ้า: { english: "sky blue", hex: "#87CEEB" },
  ชมพู: { english: "pink", hex: "#FFC0CB" },
  กรม: { english: "navy", hex: "#000080" },
  ดำ: { english: "black", hex: "#000000" },
  เทา: { english: "gray", hex: "#808080" },
  น้ำตาล: { english: "brown", hex: "#8B4513" },
  ฟ้าเข้ม: { english: "dark sky blue", hex: "#4682B4" },
  ม่วง: { english: "purple", hex: "#800080" },
  แดง: { english: "red", hex: "#FF0000" },
  เขียว: { english: "green", hex: "#008000" },
  ส้ม: { english: "orange", hex: "#FFA500" },
  ฟ้าทะเล: { english: "sea blue", hex: "#5F9EA0" },
  โอรส: { english: "peach", hex: "#FFDAB9" },
  กรมเข้ม: { english: "dark navy", hex: "#000066" },
  บานเย็น: { english: "magenta", hex: "#FF00FF" },
  เลือดหมู: { english: "maroon", hex: "#800000" },
  น้ำตาลอมเทา: { english: "grayish brown", hex: "#A0522D" },
  ม่วงเข้ม: { english: "dark purple", hex: "#4B0082" },
  กากี: { english: "khaki", hex: "#F0E68C" },
  เทาอ่อน: { english: "light gray", hex: "#D3D3D3" },
  ฟ้าอมน้ำตาล: { english: "sky brownish", hex: "#B0C4DE" },
  เหลืองเข้ม: { english: "dark yellow", hex: "#FFD700" },
  น้ำตาลทอง: { english: "golden brown", hex: "#996515" },
  เทาดำเข้ม: { english: "dark charcoal", hex: "#2F4F4F" },
  ฟ้าเทา: { english: "bluish gray", hex: "#6699CC" },
  น้ำตาลเข้ม: { english: "dark brown", hex: "#5C4033" },
  ขี้ม้า: { english: "earth brown", hex: "#70543E" },
  ฟ้าอ่อน: { english: "light blue", hex: "#ADD8E6" },
  เขียวอ่อน: { english: "light green", hex: "#90EE90" },
  เทาม่วง: { english: "purple gray", hex: "#8B8BAE" },
  เขียวคล้ำ: { english: "dark green", hex: "#006400" },
  เขียวหัวเป็ด: { english: "teal green", hex: "#006A4E" },
  เหลืองมันปู: { english: "mustard yellow", hex: "#E1B500" },
  กรมเทา: { english: "gray navy", hex: "#343B4C" },
  ชมพูเข้ม: { english: "deep pink", hex: "#FF1493" },
  ครีมอ่อน: { english: "light cream", hex: "#FFF8DC" },
  ม่วงอ่อน: { english: "light purple", hex: "#D8B4FE" },
};

async function main() {
  const variants = await prisma.productVariant.findMany({
    select: { id: true, color: true, colorHex: true },
  });

  console.log(`Found ${variants.length} variant(s) to inspect.\n`);

  let updated = 0;
  let skipped = 0;
  let unknown = 0;

  for (const v of variants) {
    const key = v.color.trim();
    const mapped = COLOR_MAP[key];

    if (!mapped) {
      console.warn(`  [UNKNOWN] id=${v.id} color="${v.color}" — no mapping found, skipping`);
      unknown++;
      continue;
    }

    if (v.colorHex === mapped.hex) {
      skipped++;
      continue;
    }

    await prisma.productVariant.update({
      where: { id: v.id },
      data: { colorHex: mapped.hex },
    });

    console.log(`  [UPDATED] "${v.color}" → ${mapped.hex} (was ${v.colorHex ?? "null"})`);
    updated++;
  }

  console.log(`\nDone. updated=${updated}  skipped=${skipped}  unknown=${unknown}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
