import { prisma } from "@/lib/prisma";
import { evaluatePromotions } from "@/lib/promotions";
import { calcShippingFee } from "@/lib/shipping";
import { generatePromptPayPayload } from "@/lib/promptpay";
import { notifyAdminNewOrder } from "@/lib/line-notify";
import type { CartItem } from "@/types";

export interface SearchParams {
  query?: string;
  categorySlug?: string;
  size?: string;
  color?: string;
}

/**
 * 1. ค้นหารายการเสื้อเชิ้ตสำเร็จรูปที่เปิดขายอยู่ในระบบ
 */
export async function searchProducts(params: SearchParams) {
  const { query, categorySlug, size, color } = params;

  // Map category slugs from LLM to DB slugs
  let mappedCategorySlug = categorySlug;
  if (categorySlug === "men") mappedCategorySlug = "mens-shirts";
  if (categorySlug === "women") mappedCategorySlug = "womens-shirts";

  const isGeneralCategory = ["men", "women", "mens-shirts", "womens-shirts"].includes(categorySlug || "");

  // กรองสินค้าที่ Active เท่านั้น
  const whereClause: any = {
    status: "ACTIVE",
  };

  // Only apply category filter to DB if it's a specific subcategory (not a general parent category)
  if (mappedCategorySlug && !isGeneralCategory) {
    whereClause.category = {
      slug: mappedCategorySlug,
    };
  }

  // Parse characteristics from query for SKU digit matching
  let targetSleeve: string | null = null;
  if (query && (query.includes("แขนยาว") || query.includes("ยาว"))) {
    targetSleeve = "1";
  } else if (query && (query.includes("แขนสั้น") || query.includes("สั้น"))) {
    targetSleeve = "2";
  } else if (query && query.includes("สามส่วน")) {
    targetSleeve = "3";
  } else if (query && (query.includes("โปโล") || query.includes("polo"))) {
    targetSleeve = "4";
  }

  let targetGender: string | null = null;
  if (mappedCategorySlug === "mens-shirts" || (query && (query.includes("ผู้ชาย") || query.includes("ชาย")))) {
    targetGender = "4";
  } else if (mappedCategorySlug === "womens-shirts" || (query && (query.includes("ผู้หญิง") || query.includes("หญิง")))) {
    targetGender = "3";
  }

  let targetPattern: string | null = null;
  if (query && (query.includes("ลายริ้ว") || query.includes("ริ้ว"))) {
    targetPattern = "1";
  } else if (query && (query.includes("ลายสก๊อต") || query.includes("ลายสก็อต") || query.includes("สก๊อต") || query.includes("สก็อต"))) {
    targetPattern = "2";
  } else if (query && (query.includes("ลายจุด") || query.includes("จุด"))) {
    targetPattern = "3";
  } else if (query && (query.includes("ผ้าพื้น") || query.includes("สีพื้น") || query.includes("พื้น") || query.includes("เรียบ"))) {
    targetPattern = "4";
  } else if (query && (query.includes("ลายพิมพ์") || query.includes("พิมพ์") || query.includes("ดอก"))) {
    targetPattern = "5";
  }

  // Only apply text query search to DB if we couldn't resolve any structural digits
  const hasStructuralMatch = !!(targetSleeve || targetGender || targetPattern);
  if (query && !hasStructuralMatch) {
    whereClause.OR = [
      { name: { contains: query } },
      { nameTh: { contains: query } },
      { description: { contains: query } },
      { descTh: { contains: query } },
    ];
  }

  // ตัวกรองสำหรับไซส์หรือสี ค้นหาผ่านความสัมพันธ์ของ Variant
  if (size || color) {
    const variantFilter: any = {};
    if (size) variantFilter.size = { equals: size };
    if (color) variantFilter.color = { equals: color };

    whereClause.variants = {
      some: variantFilter,
    };
  }

  const dbProducts = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      variants: {
        select: {
          sku: true,
          size: true,
          color: true,
          price: true,
          inventory: {
            select: {
              quantity: true,
            },
          },
        },
      },
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });

  let filteredProducts = dbProducts;

  if (hasStructuralMatch) {
    filteredProducts = dbProducts.filter((p) => {
      const slug = p.slug;
      if (!slug || slug.length < 3) return false;

      // 1. ตรวจสอบประเภทแขนเสื้อ (หลักแรก)
      if (targetSleeve && slug[0] !== targetSleeve) return false;

      // 2. ตรวจสอบเพศ (หลักที่สอง)
      if (targetGender && slug[1] !== targetGender) return false;

      // 3. ตรวจสอบลวดลายเนื้อผ้า (หลักที่สาม)
      if (targetPattern && slug[2] !== targetPattern) return false;

      return true;
    });
  }

  // Fallback to all products if structural match yielded nothing but text search might have hits
  if (filteredProducts.length === 0 && dbProducts.length > 0 && targetPattern) {
    filteredProducts = dbProducts;
  }

  return filteredProducts.slice(0, 10).map((p) => ({
    id: p.id,
    name: p.name,
    nameTh: p.nameTh,
    slug: p.slug,
    description: p.descTh || p.description,
    basePrice: p.basePrice,
    categoryName: p.category.nameTh,
    imageUrl: p.images[0]?.url || null,
    variants: p.variants.map((v) => ({
      sku: v.sku,
      size: v.size,
      color: v.color,
      price: v.price,
      stock: v.inventory.reduce((sum, item) => sum + item.quantity, 0),
    })),
  }));
}

/**
 * 2. ดึงรายละเอียดสินค้าเดี่ยวๆ พร้อมข้อมูลสี ไไซส์ และสต็อกของแต่ละ Variant
 */
export async function getProductDetails(productSlug: string) {
  const product = await prisma.product.findUnique({
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

  if (!product || product.status !== "ACTIVE") {
    throw new Error("ไม่พบข้อมูลสินค้าชิ้นนี้ หรือสินค้าเลิกจำหน่ายแล้ว");
  }

  return {
    id: product.id,
    name: product.name,
    nameTh: product.nameTh,
    slug: product.slug,
    description: product.descTh || product.description,
    basePrice: product.basePrice,
    categoryName: product.category.nameTh,
    images: product.images.map((img) => img.url),
    variants: product.variants.map((v) => {
      // รวมจำนวนสต็อกจากทุกคลังสินค้า
      const totalStock = v.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
      return {
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: v.price,
        stock: totalStock,
      };
    }),
  };
}

/**
 * 3. ตรวจสอบจำนวนสต็อกคงเหลือของ Variant ผ่าน SKU
 */
export async function checkStock(variantSku: string) {
  const variant = await prisma.productVariant.findUnique({
    where: { sku: variantSku },
    include: {
      product: true,
      inventory: true,
    },
  });

  if (!variant) {
    throw new Error(`ไม่พบสินค้า SKU: ${variantSku}`);
  }

  const totalStock = variant.inventory.reduce((sum, inv) => sum + inv.quantity, 0);

  return {
    sku: variant.sku,
    productName: variant.product.nameTh,
    color: variant.color,
    size: variant.size,
    price: variant.price,
    stock: totalStock,
  };
}

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
  const promo = await prisma.promotion.findFirst({
    where: {
      code,
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
    const codePromo = await prisma.promotion.findFirst({
      where: { code: promotionCode, isActive: true },
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

  const total = Math.max(0, subtotal - discountAmount) + shippingFee;

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
    total: order.total,
    shippingName: order.shippingName,
    shippingPhone: order.shippingPhone,
    shippingAddress: `${order.shippingAddress} ${order.shippingCity} ${order.shippingProvince} ${order.shippingPostcode}`,
    createdAt: order.createdAt,
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

/**
 * 11. คำนวณและประเมินราคารายการสินค้าก่อนสั่งซื้อจริง
 */
export async function previewOrder(params: {
  items: { sku: string; quantity: number }[];
  promotionCode?: string;
  isPickup?: boolean;
}) {
  const { items, promotionCode, isPickup = false } = params;
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
    const codePromo = await prisma.promotion.findFirst({
      where: { code: promotionCode, isActive: true },
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

  const total = Math.max(0, subtotal - discountAmount) + shippingFee;

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
  };
}
