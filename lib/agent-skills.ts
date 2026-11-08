import { prisma } from "@/lib/prisma";
import { evaluatePromotions } from "@/lib/promotions";
import { calcShippingFee } from "@/lib/shipping";
import { generatePromptPayPayload } from "@/lib/promptpay";
import { notifyAdminNewOrder } from "@/lib/line-notify";
import type { CartItem } from "@/types";
import colorMap from "./color-map.json";

// ═══════════════════════════════════════════════════════════════════════════
// ZONE 1: THAI NLP & ATTRIBUTE EXTRACTION
// ฟังก์ชันช่วยตัดคำ สกัดคุณลักษณะสินค้า (ความยาวแขน, เพศ, ลายผ้า, สี, ไซส์, รหัส)
// ═══════════════════════════════════════════════════════════════════════════

// รายการสีภาษาไทย เรียงจากยาวไปสั้น เพื่อให้แมตช์คำเฉพาะเจาะจงก่อน (เช่น "ฟ้าอ่อน" ก่อน "ฟ้า")
const THAI_COLORS = Object.values(colorMap)
  .map((c) => c.thai)
  .sort((a, b) => b.length - a.length);

export interface ExtractedAttributes {
  productCode?: string;
  sleeveCode?: string; // "1"=long, "2"=short, "3"=3/4, "4"=polo
  genderCode?: string; // "4"=men, "3"=women
  patternCode?: string; // "1"=stripe, "2"=check, "3"=dot, "4"=plain, "5"=print
  color?: string;
  size?: string;
  cleanQuery?: string;
}

/**
 * ฟังก์ชันช่วยสกัดคุณลักษณะสินค้า (ความยาวแขน, เพศ, ลายผ้า, สี, ไซส์, รหัสสินค้า) จากข้อความค้นหาภาษาไทย
 */
export function extractSearchAttributes(rawText?: string): ExtractedAttributes {
  if (!rawText) return {};
  const text = rawText.trim();
  const res: ExtractedAttributes = {};

  // 1. ตรวจหารหัสสินค้าตัวเลข เช่น 144813 หรือ 144813_3 หรือ 144813_3_L
  const codeMatch = text.match(/\b\d{5,6}(?:_\d+)?(?:_[A-Za-z0-9]+)?\b/);
  if (codeMatch) {
    res.productCode = codeMatch[0];
  }

  // 2. ตรวจหาความยาวแขน
  if (text.includes("แขนยาว") || text.includes("ยาว")) {
    res.sleeveCode = "1";
  } else if (text.includes("แขนสั้น") || text.includes("สั้น")) {
    res.sleeveCode = "2";
  } else if (text.includes("สามส่วน")) {
    res.sleeveCode = "3";
  } else if (text.includes("โปโล") || text.toLowerCase().includes("polo")) {
    res.sleeveCode = "4";
  }

  // 3. ตรวจหาเพศ
  if (text.includes("ผู้ชาย") || text.includes("ชาย")) {
    res.genderCode = "4";
  } else if (text.includes("ผู้หญิง") || text.includes("หญิง")) {
    res.genderCode = "3";
  }

  // 4. ตรวจหาลวดลาย
  if (text.includes("ลายริ้ว") || text.includes("ริ้ว")) {
    res.patternCode = "1";
  } else if (text.includes("สก๊อต") || text.includes("สก็อต") || text.includes("ลายสก๊อต") || text.includes("ลายสก็อต")) {
    res.patternCode = "2";
  } else if (text.includes("ลายจุด") || text.includes("จุด")) {
    res.patternCode = "3";
  } else if (text.includes("ผ้าพื้น") || text.includes("สีพื้น") || text.includes("เรียบ") || text.includes("พื้น")) {
    res.patternCode = "4";
  } else if (text.includes("ลายพิมพ์") || text.includes("พิมพ์") || text.includes("ดอก") || text.includes("ลายดอก")) {
    res.patternCode = "5";
  }

  // 5. ตรวจหาสี (เทียบจาก color-map.json)
  for (const c of THAI_COLORS) {
    if (text.includes(c) || text.includes(`สี${c}`)) {
      res.color = c;
      break;
    }
  }

  // 6. ตรวจหาไซส์ (เช่น S, M, L, XL, 2XL เป็นต้น)
  const sizeMatch = text.match(/(?:ไซส์|ไซส|size)?\s*\b(6XL|5XL|4XL|3XL|2XL|XXXL|XXL|XL|SS|S|M|L)\b/i);
  if (sizeMatch) {
    let s = sizeMatch[1].toUpperCase();
    if (s === "XXL") s = "2XL";
    if (s === "XXXL") s = "3XL";
    res.size = s;
  }

  // 7. สกัด Residual Text สำหรับการค้นหาข้อความทั่วไป (ลบคำฟิลเลอร์ออก)
  let clean = text
    .replace(/\b\d{5,6}(?:_\d+)?(?:_[A-Za-z0-9]+)?\b/g, "")
    .replace(/(?:ไซส์|ไซส|size)?\s*\b(6XL|5XL|4XL|3XL|2XL|XXXL|XXL|XL|SS|S|M|L)\b/gi, "")
    .replace(/เสื้อเชิ้ต|เสื้อ|เชิ้ต|แขนยาว|แขนสั้น|สามส่วน|โปโล|ผู้ชาย|ผู้หญิง|ชาย|หญิง/g, "")
    .replace(/ลายริ้ว|ริ้ว|ลายสก๊อต|ลายสก็อต|สก๊อต|สก็อต|ลายจุด|จุด|ผ้าพื้น|สีพื้น|ลายพิมพ์|พิมพ์/g, "")
    .replace(/มีไหม|มีมั้ย|ไหมครับ|ไหมค่ะ|มั้ยครับ|มั้ยค่ะ|ครับ|ค่ะ|หน่อย|ขอดู|สต็อก|สต้อค|ราคา|เท่าไหร่|เท่าไร/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (res.color) {
    clean = clean.replace(new RegExp(`สี?${res.color}`, "g"), "").trim();
  }

  res.cleanQuery = clean.length >= 2 ? clean : undefined;

  return res;
}

// ═══════════════════════════════════════════════════════════════════════════
// ZONE 2: CATALOG & STOCK QUERY SKILLS
// สกิลค้นหาสินค้า ดึงรายละเอียด สำรวจตัวเลือกพร้อมส่ง และเช็คสต็อก
// ═══════════════════════════════════════════════════════════════════════════

export interface SearchParams {
  query?: string;
  categorySlug?: string;
  size?: string;
  color?: string;
}

/**
 * 1. ค้นหารายการเสื้อเชิ้ตสำเร็จรูปที่เปิดขายอยู่ในระบบ
 * ปรับปรุง: คืนข้อมูลสรุปกระชับ ฉับไว ประหยัด Token และไม่หน่วงระบบ
 */
export async function searchProducts(params: SearchParams) {
  const { query, categorySlug, size: inputSize, color: inputColor } = params;

  // Map category slugs from LLM to DB slugs
  let mappedCategorySlug = categorySlug;
  if (categorySlug === "men") mappedCategorySlug = "mens-shirts";
  if (categorySlug === "women") mappedCategorySlug = "womens-shirts";
  const isGeneralCategory = ["men", "women", "mens-shirts", "womens-shirts"].includes(categorySlug || "");

  // สกัดคุณสมบัติจากคำค้นหาอัตโนมัติ
  const extracted = extractSearchAttributes(query);
  const targetColor = inputColor || extracted.color;
  const targetSize = inputSize || extracted.size;
  const targetProductCode = extracted.productCode;

  let targetGender = extracted.genderCode;
  if (mappedCategorySlug === "mens-shirts") targetGender = "4";
  if (mappedCategorySlug === "womens-shirts") targetGender = "3";

  const targetSleeve = extracted.sleeveCode;
  const targetPattern = extracted.patternCode;

  // กรองสินค้าที่ Active เท่านั้น
  const whereClause: any = {
    status: "ACTIVE",
  };

  if (mappedCategorySlug && !isGeneralCategory) {
    whereClause.category = {
      slug: mappedCategorySlug,
    };
  }

  // ตรวจจับรหัสสินค้าตัวเลขระบุตรง หรือใช้โครงสร้างรหัสสินค้า Highbury กรองในฐานข้อมูลทันที
  if (targetProductCode) {
    const rawNumber = targetProductCode.split("_")[0];
    whereClause.OR = [
      { slug: targetProductCode },
      { slug: rawNumber },
      { slug: { contains: rawNumber } },
      { name: { contains: rawNumber } },
    ];
  } else {
    // กำหนด Prefix ตามหลักที่ 1 (แขน) และหลักที่ 2 (เพศ) และหลักที่ 3 (ลาย)
    if (targetSleeve && targetGender && targetPattern) {
      whereClause.slug = { startsWith: `${targetSleeve}${targetGender}${targetPattern}` };
    } else if (targetSleeve && targetGender) {
      whereClause.slug = { startsWith: `${targetSleeve}${targetGender}` };
    } else if (targetGender) {
      whereClause.OR = [
        { slug: { startsWith: `1${targetGender}` } },
        { slug: { startsWith: `2${targetGender}` } },
        { slug: { startsWith: `3${targetGender}` } },
        { slug: { startsWith: `4${targetGender}` } },
      ];
    } else if (targetSleeve) {
      whereClause.slug = { startsWith: targetSleeve };
    } else {
      // ค้นหาเสื้อเชิ้ตเป็นหลัก ไม่ดึงเครื่องประดับ/เข็มขัด (ซึ่งรหัสขึ้นต้นด้วย 0)
      whereClause.NOT = { slug: { startsWith: "0" } };
    }

    if (extracted.cleanQuery) {
      const textFilter = [
        { name: { contains: extracted.cleanQuery } },
        { nameTh: { contains: extracted.cleanQuery } },
        { description: { contains: extracted.cleanQuery } },
        { descTh: { contains: extracted.cleanQuery } },
      ];
      if (whereClause.OR) {
        whereClause.AND = [{ OR: whereClause.OR }, { OR: textFilter }];
        delete whereClause.OR;
      } else {
        whereClause.OR = textFilter;
      }
    }
  }

  // ตัวกรอง Variant สำหรับสีหรือไซส์ (เฉพาะที่มีสต็อกพร้อมส่ง)
  if (targetSize || targetColor) {
    const variantFilter: any = {
      inventory: {
        some: { quantity: { gt: 0 } },
      },
    };
    if (targetSize) variantFilter.size = { equals: targetSize };
    if (targetColor) variantFilter.color = { contains: targetColor };

    whereClause.variants = {
      some: variantFilter,
    };
  }

  const dbProducts = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      variants: {
        where: {
          inventory: {
            some: { quantity: { gt: 0 } },
          },
        },
        select: {
          sku: true,
          size: true,
          color: true,
          price: true,
          inventory: {
            select: { quantity: true },
          },
        },
      },
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    take: 15,
  });

  let filteredProducts = dbProducts;
  const hasStructuralMatch = !!(targetSleeve || targetGender || targetPattern);

  if (hasStructuralMatch && !targetProductCode) {
    filteredProducts = dbProducts.filter((p) => {
      const slug = p.slug;
      if (!slug || slug.length < 3) return false;
      if (targetSleeve && slug[0] !== targetSleeve) return false;
      if (targetGender && slug[1] !== targetGender) return false;
      if (targetPattern && slug[2] !== targetPattern) return false;
      return true;
    });
  }

  if (filteredProducts.length === 0 && dbProducts.length > 0) {
    filteredProducts = dbProducts;
  }

  // สรุปข้อมูลส่งคืน Gemini สูงสุด 5 รายการ เพื่อความรวดเร็วและประหยัด Token สูงสุด
  return filteredProducts.slice(0, 5).map((p) => {
    const inStockVariants = p.variants
      .map((v) => ({
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: v.price,
        stock: v.inventory.reduce((sum, item) => sum + item.quantity, 0),
      }))
      .filter((v) => v.stock > 0);

    const availableColors = Array.from(new Set(inStockVariants.map((v) => v.color)));
    const availableSizes = Array.from(new Set(inStockVariants.map((v) => v.size)));
    const prices = inStockVariants.map((v) => v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : p.basePrice;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : p.basePrice;

    // รวบรวมข้อมูลสีและไซส์พร้อมส่งแบบกะทัดรัด
    const colorGroups: Record<string, { baseSku: string; sizes: string[] }> = {};
    for (const v of inStockVariants) {
      const parts = v.sku.split("_");
      const baseSku = parts.length >= 2 ? `${parts[0]}_${parts[1]}` : p.slug;
      if (!colorGroups[v.color]) {
        colorGroups[v.color] = { baseSku, sizes: [] };
      }
      if (!colorGroups[v.color].sizes.includes(v.size)) {
        colorGroups[v.color].sizes.push(v.size);
      }
    }

    const colorsSummary = Object.entries(colorGroups).map(([col, info]) => ({
      color: col,
      baseSku: info.baseSku,
      sizes: info.sizes,
    }));

    return {
      id: p.id,
      name: p.name,
      nameTh: p.nameTh,
      slug: p.slug,
      priceRange: minPrice === maxPrice ? `฿${minPrice}` : `฿${minPrice} - ฿${maxPrice}`,
      categoryName: p.category.nameTh,
      imageUrl: p.images[0]?.url || null,
      totalInStock: inStockVariants.reduce((sum, v) => sum + v.stock, 0),
      availableColors,
      availableSizes,
      colorsSummary: colorsSummary.slice(0, 8),
      matchingVariants: (targetColor || targetSize)
        ? inStockVariants.filter(
            (v) => (!targetColor || v.color.includes(targetColor)) && (!targetSize || v.size === targetSize)
          ).slice(0, 5)
        : undefined,
    };
  });
}

/**
 * 2. ดึงรายละเอียดสินค้าเดี่ยวๆ พร้อมข้อมูลสี ไซส์ และสต็อกของแต่ละ Variant
 */
export async function getProductDetails(productSlug: string) {
  let product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: {
      category: true,
      variants: {
        include: {
          inventory: {
            select: {
              quantity: true,
            },
          },
        },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  // Robust fallback: if lookup fails, try to extract numeric product ID from descriptive slug
  if (!product) {
    const codeMatch = productSlug.match(/(\d+)/);
    if (codeMatch) {
      const code = codeMatch[1];
      product = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: code },
            { slug: { contains: code } },
          ],
        },
        include: {
          category: true,
          variants: {
            include: {
              inventory: {
                select: {
                  quantity: true,
                },
              },
            },
          },
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
      });
    }
  }

  // Second fallback: try to look for the slug inside the name or partial slug
  if (!product) {
    product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: { contains: productSlug } },
          { name: { contains: productSlug } },
        ],
      },
      include: {
        category: true,
        variants: {
          include: {
            inventory: {
              select: {
                quantity: true,
              },
            },
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  }

  if (!product || product.status !== "ACTIVE") {
    return {
      success: false,
      message: "ไม่พบข้อมูลสินค้าชิ้นนี้ หรือสินค้าเลิกจำหน่ายแล้ว",
    };
  }

  const inStockVariants = product.variants.map((v) => {
    const totalStock = v.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
    return {
      sku: v.sku,
      size: v.size,
      color: v.color,
      price: v.price,
      stock: totalStock,
    };
  });

  const availableColors = Array.from(new Set(inStockVariants.filter((v) => v.stock > 0).map((v) => v.color)));
  const availableSizes = Array.from(new Set(inStockVariants.filter((v) => v.stock > 0).map((v) => v.size)));

  return {
    success: true,
    id: product.id,
    name: product.name,
    nameTh: product.nameTh,
    slug: product.slug,
    description: product.descTh || product.description,
    basePrice: product.basePrice,
    categoryName: product.category.nameTh,
    images: product.images.map((img) => img.url),
    totalInStock: inStockVariants.reduce((sum, v) => sum + v.stock, 0),
    availableColors,
    availableSizes,
    variants: inStockVariants.slice(0, 30),
  };
}

export interface AvailableOptionsParams {
  gender?: string;
  sleeve?: string;
  pattern?: string;
  size?: string;
  color?: string;
  productCode?: string;
  query?: string;
}

/**
 * 2.1 สำรวจตัวเลือกสินค้า สี และไซส์ ที่มีสต็อกพร้อมส่งจริงในระบบ (Stock > 0)
 * เหมาะสำหรับตอบคำถามแนว "เสื้อผู้ชายแขนยาวมีสีอะไรบ้าง", "ไซส์ M มีสีอะไรบ้าง", "มีสีอะไรพร้อมส่งบ้าง"
 */
export async function getAvailableOptions(params: AvailableOptionsParams) {
  const { gender, sleeve, pattern, size: inputSize, color: inputColor, productCode: inputProductCode, query } = params;

  // สกัดข้อมูลเสริมจาก query ด้วย
  const extracted = extractSearchAttributes(query);
  const targetSleeve = sleeve || extracted.sleeveCode;
  const targetGender = gender === "men" ? "4" : gender === "women" ? "3" : (gender || extracted.genderCode);
  const targetPattern = pattern === "stripe" ? "1" : pattern === "check" ? "2" : pattern === "dot" ? "3" : pattern === "plain" ? "4" : pattern === "print" ? "5" : (pattern || extracted.patternCode);
  const size = inputSize || extracted.size;
  const color = inputColor || extracted.color;
  const productCode = inputProductCode || extracted.productCode;

  // สร้าง Where clause
  const whereClause: any = {
    status: "ACTIVE",
  };

  // ตรวจจับรหัสตัวเลขสินค้า (เช่น 144813 หรือ 144813_3)
  const explicitCode = productCode?.trim();
  if (explicitCode) {
    const rawNumber = explicitCode.split("_")[0];
    whereClause.OR = [
      { slug: explicitCode },
      { slug: rawNumber },
      { slug: { contains: rawNumber } },
      { name: { contains: rawNumber } },
    ];
  } else {
    if (targetSleeve && targetGender && targetPattern) {
      whereClause.slug = { startsWith: `${targetSleeve}${targetGender}${targetPattern}` };
    } else if (targetSleeve && targetGender) {
      whereClause.slug = { startsWith: `${targetSleeve}${targetGender}` };
    } else if (targetGender) {
      whereClause.OR = [
        { slug: { startsWith: `1${targetGender}` } },
        { slug: { startsWith: `2${targetGender}` } },
        { slug: { startsWith: `3${targetGender}` } },
        { slug: { startsWith: `4${targetGender}` } },
      ];
    } else if (targetSleeve) {
      whereClause.slug = { startsWith: targetSleeve };
    } else {
      whereClause.NOT = { slug: { startsWith: "0" } };
    }
  }

  const dbProducts = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      variants: {
        where: {
          inventory: {
            some: { quantity: { gt: 0 } },
          },
          ...(size ? { size: { equals: size } } : {}),
          ...(color ? { color: { contains: color } } : {}),
        },
        include: {
          inventory: {
            select: { quantity: true },
          },
        },
      },
    },
    take: 20,
  });

  // กรองด้วยรหัสโครงสร้างถ้ามี
  let filteredProducts = dbProducts;
  const hasStructuralMatch = !!(targetSleeve || targetGender || targetPattern);
  if (hasStructuralMatch && !explicitCode) {
    filteredProducts = dbProducts.filter((p) => {
      const slug = p.slug;
      if (!slug || slug.length < 3) return false;
      if (targetSleeve && slug[0] !== targetSleeve) return false;
      if (targetGender && slug[1] !== targetGender) return false;
      if (targetPattern && slug[2] !== targetPattern) return false;
      return true;
    });
  }

  if (filteredProducts.length === 0 && dbProducts.length > 0) {
    filteredProducts = dbProducts;
  }

  // รวบรวมเฉพาะ Variant ที่มีสต็อก > 0
  const colorMapSet = new Set<string>();
  const sizeMapSet = new Set<string>();
  const colorGroups: Record<string, {
    productName: string;
    color: string;
    baseSku: string;
    prices: number[];
    availableSizes: Set<string>;
    totalStock: number;
  }> = {};

  let totalInStock = 0;

  for (const prod of filteredProducts) {
    for (const v of prod.variants) {
      const stock = v.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
      if (stock <= 0) continue;

      totalInStock += stock;
      colorMapSet.add(v.color);
      sizeMapSet.add(v.size);

      // หา baseSku เช่น 144813_3 จาก sku 144813_3_M
      const skuParts = v.sku.split("_");
      const baseSku = skuParts.length >= 2 ? `${skuParts[0]}_${skuParts[1]}` : prod.slug;
      const groupKey = `${baseSku}_${v.color}`;

      if (!colorGroups[groupKey]) {
        colorGroups[groupKey] = {
          productName: prod.nameTh || prod.name,
          color: v.color,
          baseSku,
          prices: [],
          availableSizes: new Set<string>(),
          totalStock: 0,
        };
      }

      colorGroups[groupKey].prices.push(v.price);
      colorGroups[groupKey].availableSizes.add(v.size);
      colorGroups[groupKey].totalStock += stock;
    }
  }

  const availableColors = Array.from(colorMapSet);
  const availableSizes = Array.from(sizeMapSet);

  const summary = Object.values(colorGroups).map((g) => {
    const minP = Math.min(...g.prices);
    const maxP = Math.max(...g.prices);
    return {
      productName: g.productName,
      color: g.color,
      baseSku: g.baseSku,
      priceRange: minP === maxP ? `฿${minP}` : `฿${minP} - ฿${maxP}`,
      availableSizes: Array.from(g.availableSizes),
      totalStock: g.totalStock,
    };
  });

  if (summary.length === 0) {
    return {
      success: true,
      totalInStock: 0,
      availableColors: [],
      availableSizes: [],
      summary: [],
      message: "ขณะนี้ไม่มีสินค้าพร้อมส่งในเงื่อนไขที่ระบุ กรุณาสอบถามสีหรือรุ่นอื่นเพิ่มเติมนะคะ",
    };
  }

  return {
    success: true,
    totalInStock,
    availableColors,
    availableSizes,
    summary: summary.slice(0, 8),
  };
}

export interface CheckStockParams {
  variantSku?: string;
  productCode?: string;
  color?: string;
  size?: string;
  query?: string;
}

/**
 * 3. ตรวจสอบจำนวนสต็อกคงเหลือของสินค้า
 * รองรับทั้ง:
 * - รหัส SKU เต็มตัวเป๊ะๆ เช่น 144813_2_L
 * - รหัสรุ่น / Base SKU เช่น 144813 หรือ 144813_2
 * - หรือค้นหาด้วยสีและไซส์ เช่น checkStock({ productCode: "144813", color: "ฟ้า", size: "L" })
 * คืนข้อมูลสรุปกลุ่มสีและไซส์แบบกระชับ รวดเร็ว ไม่พ่นข้อมูล 100 รายการจนระบบหน่วง
 */
export async function checkStock(input: string | CheckStockParams) {
  let sku = typeof input === "string" ? input.trim() : input.variantSku?.trim() || input.productCode?.trim();
  let color = typeof input === "object" ? input.color?.trim() : undefined;
  let size = typeof input === "object" ? input.size?.trim() : undefined;
  const rawText = typeof input === "object" ? (input.query || input.variantSku || input.productCode || "") : input;

  // สกัดข้อมูลเสริมจากข้อความ
  if (rawText) {
    const extracted = extractSearchAttributes(rawText);
    if (!sku && extracted.productCode) sku = extracted.productCode;
    if (!color && extracted.color) color = extracted.color;
    if (!size && extracted.size) size = extracted.size;
  }

  // 1. ตรวจสอบแบบค้นหา SKU ตรงตัว หรือตรงคู่ (productCode + color + size)
  if (sku) {
    const exactVariant = await prisma.productVariant.findFirst({
      where: {
        OR: [
          { sku: sku },
          ...(color && size ? [{
            sku: { startsWith: sku.split("_")[0] },
            color: { contains: color },
            size: { equals: size },
          }] : []),
        ],
      },
      include: {
        product: true,
        inventory: true,
      },
    });

    if (exactVariant) {
      const stock = exactVariant.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
      return {
        success: true,
        found: true,
        inStock: stock > 0,
        sku: exactVariant.sku,
        productName: exactVariant.product.nameTh || exactVariant.product.name,
        color: exactVariant.color,
        size: exactVariant.size,
        price: exactVariant.price,
        stock,
        message: stock > 0
          ? `สินค้า ${exactVariant.product.nameTh || exactVariant.product.name} สี${exactVariant.color} ไซส์ ${exactVariant.size} (รหัส SKU: ${exactVariant.sku}) มีพร้อมส่ง ${stock} ตัว ราคา ฿${exactVariant.price}`
          : `ขออภัยค่ะ สี${exactVariant.color} ไซส์ ${exactVariant.size} ของหมดชั่วคราว`,
      };
    }
  }

  // 2. ค้นหาแบบกลุ่มสินค้าด้วย Base SKU / Product Code / Color / Size
  const cleanCode = sku ? sku.split("_")[0] : undefined;

  const variants = await prisma.productVariant.findMany({
    where: {
      AND: [
        cleanCode ? {
          OR: [
            { sku: { startsWith: cleanCode } },
            { product: { slug: cleanCode } },
            { product: { slug: { contains: cleanCode } } },
          ],
        } : {},
        color ? { color: { contains: color } } : {},
        size ? { size: { equals: size } } : {},
      ],
    },
    include: {
      product: true,
      inventory: true,
    },
    orderBy: [
      { color: "asc" },
      { size: "asc" },
    ],
  });

  if (variants.length > 0) {
    const productName = variants[0].product.nameTh || variants[0].product.name;
    const colorGroups: Record<string, {
      color: string;
      baseSku: string;
      inStockSizes: string[];
      outOfStockSizes: string[];
      prices: number[];
      totalStock: number;
    }> = {};

    let grandTotalStock = 0;

    for (const v of variants) {
      const stock = v.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
      grandTotalStock += stock;

      const skuParts = v.sku.split("_");
      const baseSku = skuParts.length >= 2 ? `${skuParts[0]}_${skuParts[1]}` : v.product.slug;

      if (!colorGroups[v.color]) {
        colorGroups[v.color] = {
          color: v.color,
          baseSku,
          inStockSizes: [],
          outOfStockSizes: [],
          prices: [],
          totalStock: 0,
        };
      }

      colorGroups[v.color].prices.push(v.price);
      colorGroups[v.color].totalStock += stock;

      if (stock > 0) {
        if (!colorGroups[v.color].inStockSizes.includes(v.size)) {
          colorGroups[v.color].inStockSizes.push(v.size);
        }
      } else {
        if (!colorGroups[v.color].outOfStockSizes.includes(v.size)) {
          colorGroups[v.color].outOfStockSizes.push(v.size);
        }
      }
    }

    const colorsSummary = Object.values(colorGroups).map((g) => {
      const minP = Math.min(...g.prices);
      const maxP = Math.max(...g.prices);
      return {
        color: g.color,
        baseSku: g.baseSku,
        hasStock: g.totalStock > 0,
        inStockSizes: g.inStockSizes,
        priceRange: minP === maxP ? `฿${minP}` : `฿${minP} - ฿${maxP}`,
        totalStock: g.totalStock,
      };
    });

    return {
      success: true,
      found: true,
      inStock: grandTotalStock > 0,
      productName,
      code: cleanCode || (typeof input === "string" ? input : ""),
      totalStock: grandTotalStock,
      filterApplied: { color, size },
      colorsCount: colorsSummary.length,
      colors: colorsSummary.slice(0, 10),
      message: grandTotalStock > 0
        ? `พบสต็อกพร้อมส่งรวม ${grandTotalStock} ตัว`
        : `ขณะนี้สินค้าในเงื่อนไขที่ระบุหมดสต็อกชั่วคราว`,
    };
  }

  // 3. Fallback: ไม่พบสินค้า ไม่โยน exception แต่ส่ง response แนะนำลูกค้าอย่างสุภาพ
  return {
    success: false,
    found: false,
    inStock: false,
    stock: 0,
    message: `ไม่พบข้อมูลสต็อกสำหรับรหัสหรือเงื่อนไขที่ระบุ (${sku || rawText || ""})`,
    suggestion: "แนะนำให้ลูกค้าระบุรหัสสินค้า (เช่น 144813) หรือระบุประเภทที่ต้องการ เช่น เสื้อเชิ้ตผู้ชายแขนยาวผ้าพื้น เพื่อให้ค้นหาได้ตรงรุ่นนะคะ",
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ZONE 3: PROMOTIONS & PRICING SKILLS
// สกิลตรวจสอบโปรโมชั่น ตรวจสอบโค้ดส่วนลดที่ใช้งานได้
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 4. ดึงโปรโมชั่นที่กำลังเปิดใช้งานอยู่ในปัจจุบัน
 */
export async function getActivePromotions() {
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      OR: [
        { startsAt: null },
        { startsAt: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { endsAt: null },
            { endsAt: { gte: now } },
          ],
        },
      ],
    },
  });

  return promotions.map((p) => {
    let description = "";
    try {
      const rules = JSON.parse(p.rulesJson);
      if (p.type === "BUY_X_GET_Y") {
        description = `ซื้อ ${rules.buyQty || rules.buyQuantity || 3} แถม ${rules.getQty || rules.getQuantity || 1}`;
      } else if (p.type === "PERCENTAGE") {
        description = `ลดราคา ${p.discountValue}% ${rules.minOrderAmount ? `เมื่อมียอดซื้อขั้นต่ำ ฿${rules.minOrderAmount}` : ""}`;
      } else if (p.type === "FIXED_AMOUNT") {
        description = `ส่วนลดมูลค่า ฿${p.discountValue} ${rules.minOrderAmount ? `เมื่อมียอดซื้อขั้นต่ำ ฿${rules.minOrderAmount}` : ""}`;
      } else if (p.type === "FREE_SHIPPING") {
        description = `ส่งฟรี ${rules.minOrderAmount ? `เมื่อมียอดซื้อขั้นต่ำ ฿${rules.minOrderAmount}` : ""}`;
      }
    } catch (e) {
      description = p.name;
    }

    return {
      id: p.id,
      name: p.nameTh || p.name,
      code: p.code,
      type: p.type,
      discountValue: p.discountValue,
      description,
    };
  });
}

/**
 * 5. ตรวจสอบโค้ดส่วนลดว่าถูกต้องและสิทธิ์ยังไม่เต็ม
 */
export async function validatePromoCode(code: string) {
  const now = new Date();
  const cleanCode = code.trim();
  const isDefaultPromo = ["ซื้อ 3 แถม 1", "ซื้อ3แถม1", "buy3get1", "buy 3 get 1", "3get1", "3แถม1"].includes(cleanCode) || cleanCode.toLowerCase() === "promo-buy3get1";

  const promo = await prisma.promotion.findFirst({
    where: {
      isActive: true,
      OR: [
        { startsAt: null },
        { startsAt: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { endsAt: null },
            { endsAt: { gte: now } },
          ],
        },
        isDefaultPromo
          ? { id: "promo-buy3get1" }
          : {
              OR: [
                { code: cleanCode },
                { name: cleanCode },
                { nameTh: cleanCode },
                { name: cleanCode.replace(/\s+/g, "") },
                { nameTh: cleanCode.replace(/\s+/g, "") }
              ]
            }
      ],
    },
  });

  if (!promo) {
    return { isValid: false, reason: "รหัสส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว" };
  }

  if (promo.usageLimit != null && promo.usageCount >= promo.usageLimit) {
    return { isValid: false, reason: "สิทธิ์การใช้รหัสส่วนลดนี้เต็มแล้ว" };
  }

  return {
    isValid: true,
    id: promo.id,
    name: promo.nameTh || promo.name,
    code: promo.code,
    type: promo.type,
    discountValue: promo.discountValue,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ZONE 4: ORDER LIFECYCLE & POST-SALE SKILLS
// สกิลสร้างออเดอร์, ส่งสลิป, ยกเลิกออเดอร์, ตรวจสอบออเดอร์เดิม และพรีวิวคำนวณราคา
// ═══════════════════════════════════════════════════════════════════════════

export interface OrderItemInput {
  sku: string;
  quantity: number;
}

export interface VatInfoInput {
  name: string;
  taxId: string;
  address: string;
}

export interface CreateOrderParams {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity?: string;
  shippingProvince?: string;
  shippingPostcode?: string;
  items: OrderItemInput[];
  promotionCode?: string;
  isPickup?: boolean;
  vatInfo?: VatInfoInput;
  lineUserId?: string;
}

function generateOrderNumber(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `HBI${ymd}${rand}`;
}

/**
 * 6. สร้างใบสั่งซื้อรอการชำระเงิน (Pending Order) พร้อมคำนวณราคาสุทธิและส่ง Payload PromptPay QR
 */
export async function createPendingOrder(params: CreateOrderParams) {
  const {
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    shippingCity = "",
    shippingProvince = "",
    shippingPostcode = "",
    items,
    promotionCode,
    isPickup = false,
    vatInfo,
  } = params;

  // 1. ดึงข้อมูล variants และตรวจสอบสต็อกของแต่ละชิ้น
  const itemsMapped: CartItem[] = [];

  for (const item of items) {
    const variant = await prisma.productVariant.findUnique({
      where: { sku: item.sku },
      include: {
        product: true,
        inventory: true,
      },
    });

    if (!variant) {
      throw new Error(`ไม่พบสินค้า SKU: ${item.sku} ในระบบ`);
    }

    const totalStock = variant.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
    if (totalStock < item.quantity) {
      throw new Error(`สินค้า ${variant.product.nameTh} (${variant.color} ไซส์ ${variant.size}) สต็อกไม่เพียงพอ คงเหลือเพียง ${totalStock} ตัว`);
    }

    itemsMapped.push({
      variantId: variant.id,
      productId: variant.productId,
      productName: variant.product.name,
      productNameTh: variant.product.nameTh,
      slug: variant.product.slug,
      color: variant.color,
      size: variant.size,
      sku: variant.sku,
      imageUrl: "",
      unitPrice: variant.price,
      quantity: item.quantity,
      stock: totalStock,
    });
  }

  // 2. คำนวณโปรโมชั่น
  const allPromotions = await prisma.promotion.findMany({
    where: { isActive: true },
  });
  const applicablePromos = evaluatePromotions(itemsMapped, allPromotions);

  if (promotionCode) {
    const cleanCode = promotionCode.trim();
    const isDefaultPromo = ["ซื้อ 3 แถม 1", "ซื้อ3แถม1", "buy3get1", "buy 3 get 1", "3get1", "3แถม1"].includes(cleanCode) || cleanCode.toLowerCase() === "promo-buy3get1";
    const codePromo = await prisma.promotion.findFirst({
      where: isDefaultPromo
        ? { id: "promo-buy3get1", isActive: true }
        : {
            isActive: true,
            OR: [
              { code: cleanCode },
              { name: cleanCode },
              { nameTh: cleanCode },
              { name: cleanCode.replace(/\s+/g, "") },
              { nameTh: cleanCode.replace(/\s+/g, "") }
            ]
          },
    });
    if (!codePromo) {
      throw new Error("รหัสโปรโมชั่นไม่ถูกต้องหรือไม่เปิดใช้งาน");
    }
    const alreadyApplied = applicablePromos.some((p) => p.promotionId === codePromo.id);
    if (!alreadyApplied) {
      const codeResults = evaluatePromotions(itemsMapped, [codePromo]);
      applicablePromos.push(...codeResults);
    }
  }

  // 3. สรุปค่าใช้จ่าย
  const subtotal = itemsMapped.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const discountAmount = applicablePromos.reduce((s, p) => s + p.discountAmount, 0);
  const totalQty = itemsMapped.reduce((s, i) => s + i.quantity, 0);
  const hasFreeShippingPromo = applicablePromos.some((p) => p.promotionType === "FREE_SHIPPING");
  
  const shippingFee = calcShippingFee(totalQty, {
    isPickup,
    hasFreeShippingPromo,
  });

  const baseTotal = Math.max(0, subtotal - discountAmount) + shippingFee;
  const total = vatInfo ? Math.round(baseTotal * 1.07 * 100) / 100 : baseTotal;

  // 4. เตรียมข้อมูลการออกใบกำกับภาษี (หากมี) เซฟเก็บใน note
  let orderNote = "";
  if (vatInfo) {
    orderNote = `[ขอใบกำกับภาษีเต็มรูปแบบ]\nชื่อ/บริษัท: ${vatInfo.name}\nเลขประจำตัวผู้เสียภาษี: ${vatInfo.taxId}\nที่อยู่: ${vatInfo.address}`;
  }

  // 5. บันทึกใบสั่งซื้อลงฐานข้อมูล
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      guestName: customerName,
      guestEmail: customerEmail,
      guestPhone: customerPhone,
      isPickup,
      shippingName: customerName,
      shippingPhone: customerPhone,
      shippingAddress: shippingAddress,
      shippingCity: shippingCity,
      shippingProvince: shippingProvince,
      shippingPostcode: shippingPostcode,
      note: orderNote || null,
      subtotal,
      discountAmount,
      shippingFee,
      total,
      status: "PENDING",
      items: {
        create: itemsMapped.map((item) => ({
          variantId: item.variantId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
        })),
      },
    },
  });

  // 6. สร้าง Payload สำหรับ PromptPay QR
  const qrPayload = generatePromptPayPayload(total);

  // 7. แจ้งเตือนแอดมิน (Fire and forget)
  notifyAdminNewOrder({
    orderNumber: order.orderNumber,
    total,
    customerName: customerName,
  }).catch(console.error);

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    qrPayload,
    items: itemsMapped,
    customerName,
    customerPhone,
    customerAddress: `${order.shippingAddress || ""} ${order.shippingCity || ""} ${order.shippingProvince || ""} ${order.shippingPostcode || ""}`.trim(),
    createdAt: order.createdAt,
  };
}

/**
 * 7. แนบสลิปการโอนเงิน (บันทึก PaymentProof ลงใน Order)
 */
export async function submitPaymentProof(orderNumber: string, imageUrl: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!order) {
    throw new Error(`ไม่พบใบสั่งซื้อหมายเลข ${orderNumber}`);
  }

  const proof = await prisma.paymentProof.create({
    data: {
      orderId: order.id,
      imageUrl,
      status: "PENDING",
    },
  });

  // อัปเดตสถานะของออเดอร์เป็น PAYMENT_UPLOADED
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAYMENT_UPLOADED",
    },
  });

  return {
    success: true,
    proofId: proof.id,
    orderNumber: order.orderNumber,
    status: "PAYMENT_UPLOADED",
  };
}

/**
 * 8. ยกเลิกคำสั่งซื้อ (ยกเลิกได้เฉพาะสถานะ PENDING เท่านั้น)
 */
export async function cancelOrder(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!order) {
    throw new Error(`ไม่พบใบสั่งซื้อหมายเลข ${orderNumber}`);
  }

  if (order.status !== "PENDING") {
    throw new Error(`ไม่สามารถยกเลิกได้ เนื่องจากใบสั่งซื้อนี้อยู่ในสถานะ ${order.status} (ยกเลิกได้เฉพาะออเดอร์ที่ยังไม่ได้ชำระเงินเท่านั้น)`);
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "CANCELLED",
    },
  });

  return {
    success: true,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    statusEn: order.status,
    message: `ยกเลิกคำสั่งซื้อหมายเลข ${orderNumber} เรียบร้อยแล้วค่ะ`,
  };
}

/**
 * 9. ดึงรายการสั่งซื้อทั้งหมดของลูกค้าตามเบอร์โทรศัพท์
 */
export async function getCustomerOrders(customerPhone: string) {
  const orders = await prisma.order.findMany({
    where: {
      guestPhone: customerPhone,
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map((order) => ({
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      productName: item.product.nameTh || item.product.name,
      color: item.variant.color,
      size: item.variant.size,
      sku: item.variant.sku,
      quantity: item.quantity,
      price: item.unitPrice,
    })),
  }));
}

/**
 * 10. ดึงรายละเอียดออเดอร์จากหมายเลขออเดอร์
 */
export async function getOrderDetails(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) {
    return { success: false, error: `ไม่พบคำสั่งซื้อหมายเลข ${orderNumber}` };
  }

  return {
    success: true,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    shippingFee: order.shippingFee,
    total: order.total,
    shippingName: order.shippingName,
    shippingPhone: order.shippingPhone,
    shippingAddress: `${order.shippingAddress} ${order.shippingCity} ${order.shippingProvince} ${order.shippingPostcode}`,
    createdAt: order.createdAt,
    note: order.note,
    items: order.items.map((item) => ({
      productName: item.product.nameTh || item.product.name,
      color: item.variant.color,
      size: item.variant.size,
      sku: item.variant.sku,
      quantity: item.quantity,
      price: item.unitPrice,
    })),
  };
}

export interface PreviewOrderParams {
  items: { sku: string; quantity: number }[];
  promotionCode?: string;
  isPickup?: boolean;
  vatInfo?: VatInfoInput;
}

/**
 * 11. คำนวณและประเมินราคารายการสินค้าก่อนสั่งซื้อจริง
 */
export async function previewOrder(params: PreviewOrderParams) {
  const { items, promotionCode, isPickup = false, vatInfo } = params;
  const itemsMapped: CartItem[] = [];

  for (const item of items) {
    const variant = await prisma.productVariant.findUnique({
      where: { sku: item.sku },
      include: {
        product: true,
        inventory: true,
      },
    });

    if (!variant) {
      throw new Error(`ไม่พบสินค้า SKU: ${item.sku} ในระบบ`);
    }

    const totalStock = variant.inventory.reduce((sum, inv) => sum + inv.quantity, 0);

    itemsMapped.push({
      variantId: variant.id,
      productId: variant.productId,
      productName: variant.product.name,
      productNameTh: variant.product.nameTh,
      slug: variant.product.slug,
      color: variant.color,
      size: variant.size,
      sku: variant.sku,
      imageUrl: "",
      unitPrice: variant.price,
      quantity: item.quantity,
      stock: totalStock,
    });
  }

  const allPromotions = await prisma.promotion.findMany({
    where: { isActive: true },
  });
  const applicablePromos = evaluatePromotions(itemsMapped, allPromotions);

  if (promotionCode) {
    const cleanCode = promotionCode.trim();
    const isDefaultPromo = ["ซื้อ 3 แถม 1", "ซื้อ3แถม1", "buy3get1", "buy 3 get 1", "3get1", "3แถม1"].includes(cleanCode) || cleanCode.toLowerCase() === "promo-buy3get1";
    const codePromo = await prisma.promotion.findFirst({
      where: isDefaultPromo
        ? { id: "promo-buy3get1", isActive: true }
        : {
            isActive: true,
            OR: [
              { code: cleanCode },
              { name: cleanCode },
              { nameTh: cleanCode },
              { name: cleanCode.replace(/\s+/g, "") },
              { nameTh: cleanCode.replace(/\s+/g, "") }
            ]
          },
    });
    if (!codePromo) {
      throw new Error("รหัสโปรโมชั่นไม่ถูกต้องหรือไม่เปิดใช้งาน");
    }
    const alreadyApplied = applicablePromos.some((p) => p.promotionId === codePromo.id);
    if (!alreadyApplied) {
      const codeResults = evaluatePromotions(itemsMapped, [codePromo]);
      applicablePromos.push(...codeResults);
    }
  }

  const subtotal = itemsMapped.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const discountAmount = applicablePromos.reduce((s, p) => s + p.discountAmount, 0);
  const totalQty = itemsMapped.reduce((s, i) => s + i.quantity, 0);
  const hasFreeShippingPromo = applicablePromos.some((p) => p.promotionType === "FREE_SHIPPING");
  
  const shippingFee = calcShippingFee(totalQty, {
    isPickup,
    hasFreeShippingPromo,
  });

  const baseTotal = Math.max(0, subtotal - discountAmount) + shippingFee;
  const total = vatInfo ? Math.round(baseTotal * 1.07 * 100) / 100 : baseTotal;

  return {
    success: true,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedPromotions: applicablePromos.map((p) => ({
      name: p.name,
      discountAmount: p.discountAmount,
    })),
    items: itemsMapped,
  };
}
