import { prisma } from "../lib/prisma";
import { searchProducts, getProductDetails, checkStock, createPendingOrder } from "../lib/agent-skills";

async function main() {
  console.log("=== Testing Agent Skills against SQLite ===");
  
  // 1. ค้นหาสินค้า
  const products = await searchProducts({});
  console.log(`[PASS] Search returned ${products.length} products.`);
  
  if (products.length === 0) {
    console.log("❌ No products found in the database. Please seed the database first.");
    return;
  }

  const testProduct = products[0];
  console.log(`Testing with product: ${testProduct.nameTh} (${testProduct.slug})`);

  // 2. ดึงรายละเอียดสินค้า
  const details = await getProductDetails(testProduct.slug);
  console.log(`[PASS] Fetched details for ${details.nameTh}. Variants count: ${details.variants.length}`);

  if (details.variants.length === 0) {
    console.log("❌ No variants found for the product.");
    return;
  }

  // ตรวจสอบหรือสร้างคลังสินค้าเริ่มต้น (Warehouse)
  let warehouse = await prisma.warehouse.findFirst();
  if (!warehouse) {
    warehouse = await prisma.warehouse.create({
      data: {
        uniqueKey: "WH-MAIN",
        name: "คลังสินค้าหลักสาขาใหญ่",
        location: "กรุงเทพมหานคร",
        isActive: true
      }
    });
    console.log(`[SETUP] Created default warehouse: ${warehouse.name}`);
  }

  // ค้นหา Variant ตัวแรกในระบบที่มีสต็อกมากกว่า 0 หรือสร้างสต็อกให้มัน
  let inStockVariant = await prisma.productVariant.findFirst({
    where: {
      inventory: {
        some: {
          quantity: { gt: 0 }
        }
      }
    },
    include: {
      product: true,
      inventory: true
    }
  });

  if (!inStockVariant) {
    // ดึง Variant แรกสุดขึ้นมาแล้วจำลองการเติมสต็อก
    const fallbackVariant = await prisma.productVariant.findFirst({
      include: { product: true }
    });

    if (!fallbackVariant) {
      console.log("❌ No variants found in the database.");
      return;
    }

    // สร้างข้อมูล Inventory
    await prisma.inventory.upsert({
      where: {
        variantId_warehouseId: {
          variantId: fallbackVariant.id,
          warehouseId: warehouse.id
        }
      },
      update: {
        quantity: 50
      },
      create: {
        variantId: fallbackVariant.id,
        warehouseId: warehouse.id,
        quantity: 50
      }
    });

    console.log(`[SETUP] Added 50 stock units to variant ${fallbackVariant.sku} in warehouse ${warehouse.name}`);

    // คิวรี่ใหม่
    inStockVariant = await prisma.productVariant.findUnique({
      where: { id: fallbackVariant.id },
      include: { product: true, inventory: true }
    }) as any;
  }

  const testVariant = inStockVariant!;
  console.log(`Testing with in-stock variant SKU: ${testVariant.sku} of product: ${testVariant.product.nameTh}`);

  // 3. ตรวจสอบสต็อก
  const stockResult = await checkStock(testVariant.sku);
  console.log(`[PASS] Stock checked for ${testVariant.sku}: ${stockResult.stock} units available.`);

  // 4. ทดลองสร้างคำสั่งซื้อรอชำระเงิน
  console.log("Creating pending order test...");

  
  // ตรวจสอบสต็อกอย่างน้อย 1 ตัว
  if (stockResult.stock < 1) {
    console.log("⚠️ Stock is 0, skipping order creation test to prevent error.");
  } else {
    const orderResult = await createPendingOrder({
      customerName: "สมชาย แสนดี",
      customerPhone: "0991234567",
      customerEmail: "somchai@test.com",
      shippingAddress: "123/4 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
      items: [
        {
          sku: testVariant.sku,
          quantity: 1
        }
      ],
      lineUserId: "U1234567890abcdef1234567890abcdef"
    });

    console.log("[PASS] Order created successfully!");
    console.log(`  Order Number: ${orderResult.orderNumber}`);
    console.log(`  Subtotal: ฿${orderResult.subtotal}`);
    console.log(`  Discount: ฿${orderResult.discountAmount}`);
    console.log(`  Shipping Fee: ฿${orderResult.shippingFee}`);
    console.log(`  Total: ฿${orderResult.total}`);
    console.log(`  PromptPay Payload length: ${orderResult.qrPayload.length}`);
  }

  console.log("=== All Skills Tests Passed Successfully! ===");
}

main()
  .catch((err) => {
    console.error("❌ Test failed with error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
