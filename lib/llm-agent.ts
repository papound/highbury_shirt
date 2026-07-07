import { GoogleGenerativeAI, FunctionDeclaration, SchemaType, Content } from "@google/generative-ai";
import * as skills from "./agent-skills";
import colorMap from "./color-map.json";
import { prisma } from "./prisma";

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "gemini-2.5-flash": { input: 0.075 / 1_000_000, output: 0.30 / 1_000_000 },
  "gemini-2.5-pro": { input: 1.25 / 1_000_000, output: 5.00 / 1_000_000 },
  "gemini-2.0-flash": { input: 0.075 / 1_000_000, output: 0.30 / 1_000_000 },
  "gemini-1.5-flash": { input: 0.075 / 1_000_000, output: 0.30 / 1_000_000 },
  "gemini-1.5-pro": { input: 1.25 / 1_000_000, output: 5.00 / 1_000_000 },
};

// ตรวจสอบ API Key
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// คำจำกัดความของเครื่องมือ (Tool Declarations) สำหรับ Gemini
const searchProductsDeclaration: FunctionDeclaration = {
  name: "searchProducts",
  description: "ค้นหาเสื้อเชิ้ตสำเร็จรูปในฐานข้อมูลร้านค้าของแบรนด์ Highbury สามารถกรองตามคำค้นหา หมวดหมู่ ไซส์ หรือสีได้",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: { type: SchemaType.STRING, description: "คำค้นหาทั่วไป เช่น สีขาว, ลายทาง, แขนยาว, ลินิน" },
      categorySlug: { type: SchemaType.STRING, description: "สลักหมวดหมู่สินค้า เช่น men (ชาย) หรือ women (หญิง)" },
      size: { type: SchemaType.STRING, description: "ไซส์เสื้อ เช่น S, M, L, XL, XXL, 3XL" },
      color: { type: SchemaType.STRING, description: "สีเสื้อที่ลูกค้าระบุ เช่น ขาว, ฟ้า, ชมพู, กรมท่า" },
    },
  },
};

const getProductDetailsDeclaration: FunctionDeclaration = {
  name: "getProductDetails",
  description: "ดึงรายละเอียดสินค้าเดี่ยวๆ โดยใช้ Slug ของสินค้า (เช่น signature-oxford-men) เพื่อแสดงตัวเลือก สี ไซส์ ราคา และรูปภาพสินค้า",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      productSlug: { type: SchemaType.STRING, description: "สลัก (Slug) ของสินค้าตัวที่ต้องการดูข้อมูลเจาะจง" },
    },
    required: ["productSlug"],
  },
};

const checkStockDeclaration: FunctionDeclaration = {
  name: "checkStock",
  description: "ตรวจสอบสต็อกคงเหลือจริงของสินค้าตัวเลือกเฉพาะเจาะจง ผ่านรหัส SKU (เช่น HBI-OX-WHT-M)",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      variantSku: { type: SchemaType.STRING, description: "รหัส SKU ของสินค้าตัวเลือกที่ต้องการตรวจสอบสต็อก" },
    },
    required: ["variantSku"],
  },
};

const getActivePromotionsDeclaration: FunctionDeclaration = {
  name: "getActivePromotions",
  description: "ดึงรายการโปรโมชั่นและส่วนลดทั้งหมดที่กำลังเปิดใช้งานอยู่ในปัจจุบันมาเสนอให้กับลูกค้า",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {},
  },
};

const validatePromoCodeDeclaration: FunctionDeclaration = {
  name: "validatePromoCode",
  description: "ตรวจสอบโค้ดส่วนลด/คูปอง ที่ลูกค้ากรอกว่าถูกต้องและใช้ลดราคาร่วมกับสินค้าในตระกร้าได้หรือไม่",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      code: { type: SchemaType.STRING, description: "โค้ดโปรโมชั่นที่ต้องการตรวจสอบ" },
    },
    required: ["code"],
  },
};

const createPendingOrderDeclaration: FunctionDeclaration = {
  name: "createPendingOrder",
  description: "สร้างใบสั่งซื้อ (ออเดอร์) ในระบบหลังจากลูกค้ายืนยันความต้องการครบถ้วน คำนวณราคาหักโปรโมชั่น และจัดเตรียมรายละเอียดการโอนเงิน PromptPay QR",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      customerName: { type: SchemaType.STRING, description: "ชื่อและนามสกุลผู้รับสินค้า" },
      customerPhone: { type: SchemaType.STRING, description: "เบอร์โทรศัพท์ติดต่อของผู้รับสินค้า (ความยาวอย่างน้อย 9 หลัก)" },
      customerEmail: { type: SchemaType.STRING, description: "อีเมลติดต่อลูกค้าสำหรับส่งใบยืนยันสั่งซื้อ" },
      shippingAddress: { type: SchemaType.STRING, description: "ที่อยู่จัดส่งโดยละเอียด เช่น 123/45 ซอยสุขุมวิท 31 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110" },
      shippingCity: { type: SchemaType.STRING, description: "เขต/อำเภอ" },
      shippingProvince: { type: SchemaType.STRING, description: "จังหวัด" },
      shippingPostcode: { type: SchemaType.STRING, description: "รหัสไปรษณีย์" },
      items: {
        type: SchemaType.ARRAY,
        description: "รายการสินค้าที่ลูกค้าเลือกซื้อ",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            sku: { type: SchemaType.STRING, description: "รหัส SKU ของตัวสินค้าที่เลือกซื้อ เช่น HBI-OX-WHT-M" },
            quantity: { type: SchemaType.INTEGER, description: "จำนวนเสื้อเชิ้ตที่ต้องการซื้อ (มากกว่าหรือเท่ากับ 1)" },
          },
          required: ["sku", "quantity"],
        },
      },
      promotionCode: { type: SchemaType.STRING, description: "รหัสส่วนลดคูปองเพิ่มเติม (ถ้าลูกค้ามี)" },
      isPickup: { type: SchemaType.BOOLEAN, description: "เลือกรับสินค้าด้วยตัวเองที่หน้าร้านสาขาหลักหรือไม่ (เริ่มต้นเป็น false หมายถึงจัดส่งด่วน)" },
      vatInfo: {
        type: SchemaType.OBJECT,
        description: "ข้อมูลออกใบกำกับภาษีเต็มรูปแบบ (VAT) ในกรณีที่ลูกค้าประสงค์ที่จะขอรับใบกำกับภาษี",
        properties: {
          name: { type: SchemaType.STRING, description: "ชื่อบริษัท หรือชื่อบุคคลผู้เสียภาษี" },
          taxId: { type: SchemaType.STRING, description: "เลขประจำตัวผู้เสียภาษี 13 หลัก" },
          address: { type: SchemaType.STRING, description: "ที่อยู่สำหรับออกใบกำกับภาษี" },
        },
        required: ["name", "taxId", "address"],
      },
    },
    required: ["customerName", "customerPhone", "shippingAddress", "items"],
  },
};

const submitPaymentProofDeclaration: FunctionDeclaration = {
  name: "submitPaymentProof",
  description: "บันทึกข้อมูลและอัปโหลดรูปภาพสลิปหลักฐานการโอนเงิน (Payment Slip) เข้าสู่ออเดอร์ที่มีอยู่เพื่อรอแอดมินอนุมัติ",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      orderNumber: { type: SchemaType.STRING, description: "หมายเลขออเดอร์ เช่น HBI202607050012" },
      imageUrl: { type: SchemaType.STRING, description: "URL ลิงก์รูปภาพสลิปที่เก็บไว้ในระบบ" },
    },
    required: ["orderNumber", "imageUrl"],
  },
};

const requestAdminInterventionDeclaration: FunctionDeclaration = {
  name: "requestAdminIntervention",
  description: "ส่งคำขอความช่วยเหลือเพื่อแจ้งเตือนให้แอดมินตัวจริง (Human Admin) เข้ามาคุยต่อแทนบอททันที",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      reason: { type: SchemaType.STRING, description: "เหตุผลที่ต้องเรียกแอดมิน เช่น ลูกค้าคุยไม่รู้เรื่อง หรือมีคำถามเฉพาะเจาะจงที่นอกเหนือคู่มือสินค้า" },
    },
    required: ["reason"],
  },
};

const cancelOrderDeclaration: FunctionDeclaration = {
  name: "cancelOrder",
  description: "ยกเลิกคำสั่งซื้อของลูกค้า โดยสามารถยกเลิกได้เฉพาะออเดอร์ที่ยังไม่ได้ชำระเงิน (สถานะ PENDING) เท่านั้น",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      orderNumber: { type: SchemaType.STRING, description: "หมายเลขออเดอร์ เช่น HBI202607050012" },
    },
    required: ["orderNumber"],
  },
};

const getCustomerOrdersDeclaration: FunctionDeclaration = {
  name: "getCustomerOrders",
  description: "ดึงรายการคำสั่งซื้อทั้งหมดที่ลูกค้าคนนี้เคยสั่งซื้อในระบบผ่านเบอร์โทรศัพท์",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      customerPhone: { type: SchemaType.STRING, description: "เบอร์โทรศัพท์ 10 หลักของลูกค้า เช่น 0881993935" },
    },
    required: ["customerPhone"],
  },
};

const getOrderDetailsDeclaration: FunctionDeclaration = {
  name: "getOrderDetails",
  description: "ดึงรายละเอียดและสถานะปัจจุบันของคำสั่งซื้อจากฐานข้อมูลโดยระบุหมายเลขออเดอร์",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      orderNumber: { type: SchemaType.STRING, description: "หมายเลขออเดอร์ เช่น HBI202607050012" },
    },
    required: ["orderNumber"],
  },
};

const previewOrderDeclaration: FunctionDeclaration = {
  name: "previewOrder",
  description: "ประเมินและสรุปยอดรวมราคาสินค้า รวมถึงส่วนลดโปรโมชั่นของทางร้าน และค่าจัดส่ง ก่อนทำรายการจริง เพื่อแจ้งลูกค้าล่วงหน้า",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      items: {
        type: SchemaType.ARRAY,
        description: "รายการสินค้าที่ลูกค้าสนใจจะซื้อ",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            sku: { type: SchemaType.STRING, description: "รหัส SKU เช่น 144535_5_M" },
            quantity: { type: SchemaType.INTEGER, description: "จำนวนตัว" },
          },
          required: ["sku", "quantity"],
        },
      },
      promotionCode: { type: SchemaType.STRING, description: "รหัสคูปองส่วนลดเพิ่มเติม (ถ้ามี)" },
      isPickup: { type: SchemaType.BOOLEAN, description: "รับสินค้าด้วยตัวเองที่หน้าร้านหรือไม่" },
      vatInfo: {
        type: SchemaType.OBJECT,
        description: "ข้อมูลออกใบกำกับภาษีเต็มรูปแบบ (VAT) ในกรณีที่ลูกค้าประสงค์ที่จะขอรับใบกำกับภาษี",
        properties: {
          name: { type: SchemaType.STRING, description: "ชื่อบริษัท หรือชื่อบุคคลผู้เสียภาษี" },
          taxId: { type: SchemaType.STRING, description: "เลขประจำตัวผู้เสียภาษี 13 หลัก" },
          address: { type: SchemaType.STRING, description: "ที่อยู่สำหรับออกใบกำกับภาษี" },
        },
        required: ["name", "taxId", "address"],
      },
    },
    required: ["items"],
  },
};

// รวบรวมเครื่องมือทั้งหมดให้แก่บอท
const tools = [
  {
    functionDeclarations: [
      searchProductsDeclaration,
      getProductDetailsDeclaration,
      checkStockDeclaration,
      getActivePromotionsDeclaration,
      validatePromoCodeDeclaration,
      createPendingOrderDeclaration,
      submitPaymentProofDeclaration,
      requestAdminInterventionDeclaration,
      cancelOrderDeclaration,
      getCustomerOrdersDeclaration,
      getOrderDetailsDeclaration,
      previewOrderDeclaration,
    ],
  },
];

// ─────────────────────────────────────────────
// SYSTEM PROMPT & PERSONA DEFINITION
// ─────────────────────────────────────────────
const colorMapText = Object.entries(colorMap)
  .map(([code, data]) => `${code}: ${data.thai}`)
  .join(", ");

const promptpayId = process.env.PROMPTPAY_ID || "0981466416";
const promptpayName = process.env.PROMPTPAY_NAME || "นายประชา นาควังศาสตร์";

const SYSTEM_INSTRUCTION = `
คุณคือ "น้องไฮบิวรี่ (Highbury Assistant)" ผู้ช่วยขายเสื้อเชิ้ตพรีเมียมของ Highbury International บน LINE OA โต้ตอบสุภาพ เป็นมิตรเพื่อปิดการขาย
กฎเหล็กที่ต้องปฏิบัติอย่างเคร่งครัด:
1. ภาษา: คุยภาษาไทย สุภาพ มี "ครับ/ค่ะ" เสมอ เลี่ยงภาษาอังกฤษล้วน สั้นกระชับ เข้าใจง่าย ไม่เวิ่นเว้อ และใช้หน่วยลักษณนามของเสื้อว่า "ตัว" เสมอ (ห้ามใช้คำว่า "ชิ้น")
2. ข้อมูลสินค้า: ห้ามเมคราคา/ไซส์/สต็อกเองเด็ดขาด ถ้าไม่แน่ใจให้ใช้เครื่องมือค้นหาหรือแจ้งว่าหมดชั่วคราว
3. การชำระเงิน: รองรับ PromptPay QR ของร้านเท่านั้น (เบอร์: ${promptpayId} ชื่อบัญชี: ${promptpayName}) ห้ามเสนอเลขบัญชีธนาคารอื่น
4. ขั้นตอนสั่งซื้อ: สอบถามความต้องการ -> แนะนำ -> เมื่อตกลงซื้อให้ขอข้อมูลจัดส่ง (ชื่อผู้รับ, เบอร์โทรศัพท์, ที่อยู่จัดส่ง) ให้ครบถ้วนก่อน -> เมื่อได้ข้อมูลจัดส่งครบถ้วนแล้ว จึงค่อยสอบถามว่า "ต้องการรับใบกำกับภาษีเต็มรูปแบบ (VAT) หรือไม่?" (ถ้าต้องการ ให้เก็บข้อมูล ชื่อ/บริษัท, เลขประจำตัวผู้เสียภาษี 13 หลัก, ที่อยู่ สำหรับออกใบกำกับภาษี แล้วส่งเป็น vatInfo ใน createPendingOrder หรือ previewOrder) และแจ้งลูกค้าว่ายอดสั่งซื้อสำหรับออเดอร์ VAT จะคิดบวกเพิ่มภาษี +7% หลังจากยอดรวมสุทธิรวมค่าส่งแล้ว และจะต้องโอนชำระเงินเข้าบัญชีธนาคารกสิกรไทย (KBank) บจก. ธงธัญ 99 แทนพร้อมเพย์ปกติ
5. หลังสั่งซื้อสำเร็จ/ทวนยอดเดิม: สรุปยอดโอน และส่งลิงก์รูปภาพพร้อมเพย์ https://promptpay.io/${promptpayId}/\${total}.png (ให้แปลงคำว่า \${total} เป็นจำนวนเงินจริง เช่น 2500.00) เพื่อให้ลูกค้าสแกนได้สะดวก พร้อมแจ้งชื่อบัญชีและแนะนำให้อัปโหลดสลิป
6. โปรโมชั่น: ค้นหาผ่านเครื่องมือเท่านั้น ห้ามเมคโค้ดส่วนลดขึ้นมาเอง
7. เรียกแอดมิน: ใช้ requestAdminIntervention ทันทีเมื่อลูกค้าขอคุยกับมนุษย์ หรือเจอปัญหาที่ตอบไม่ได้
8. รูปแบบรหัส SKU: [รหัสสินค้า]_[รหัสสี]_[ไซส์] (เช่น 134813_4_S)
   - หลักที่ 1 (ประเภท): 1=แขนยาว, 2=แขนสั้น, 3=แขนสามส่วน, 4=โปโล, 5=แขนสองส่วน, 9=กางเกง, 0=เครื่องประดับ
   - หลักที่ 2 (เพศ): 3=หญิง, 4=ชาย
   - หลักที่ 3 (ลาย): 1=ริ้ว, 2=สก๊อต, 3=จุด, 4=ผ้าพื้น, 5=พิมพ์ลาย
   - รหัสสีตรงกลาง: ${colorMapText}
   - เสนอทางเลือก: หาก variant ที่ลูกค้าขอนั้นหมดสต็อก (stock เป็น 0) ให้เช็คและเสนอสี/ไซส์อื่นของสินค้านั้นที่มีพร้อมส่งทันทีเพื่อช่วยปิดการขาย
9. ความกระชับ (Conciseness): ตอบสั้น กระชับ ตรงประเด็น เลี่ยงประโยคเกริ่น/ลงท้ายยืดยาวเพื่อประหยัด Token และให้อ่านง่ายบนมือถือ
10. รันเครื่องมือทันที: เมื่อบอกจะเช็ค/ค้นหา/สั่งซื้อ ต้องรันเครื่องมือที่เกี่ยวข้องในเทิร์นนั้นทันที ห้ามบอกให้รอเปล่าๆ โดยไม่รันเครื่องมือ
11. การรับรูปภาพ (Multimodal): เมื่อลูกค้าส่งภาพมาให้วิเคราะห์ด้วยตา:
    - รูปสลิป: รัน submitPaymentProof ทันทีโดยค้นหาหรือถามเลขออเดอร์ และใช้ imageUrl จากแชท
    - รูปเสื้อ/แฟชั่น:
      * ทำการอ่านข้อความ ตัวเลข หรือรหัสสินค้าที่ปรากฏบนรูปภาพก่อนเป็นอันดับแรก (OCR) เพื่อตรวจสอบว่ามีรหัสสินค้าหรือสีระบุอยู่หรือไม่ (เช่น รหัสรูปแบบ 123456_7 หรือ 123456_7/สี)
      * หากพบตัวเลขรหัสสินค้า ให้ใช้รหัสที่ถอดได้นั้นค้นหารุ่นสินค้าทันทีด้วยเครื่องมือ searchProducts เพื่อแสดงข้อมูลของสินค้าตรงรุ่นที่ถูกต้อง พร้อมรายงานสต็อกและราคาที่ตรงตัวให้ลูกค้าก่อน
      * หากอ่านรหัสไม่พบ หรือค้นหารหัสตรงตัวไม่เจอในฐานข้อมูล จึงค่อยวิเคราะห์สไตล์ คอเสื้อ ความยาวแขน สี หรือลักษณะเนื้อผ้าของเสื้อจากรูปภาพ เพื่อใช้เครื่องมือ searchProducts ค้นหาสินค้าที่มีลักษณะใกล้เคียงที่สุดในระบบมานำเสนอเพิ่มเติม
    - รูปอื่นๆ: ตอบกลับสุภาพตามความเหมาะสม
12. ยกเลิกออเดอร์: ต้องสอบถามเพื่อยืนยัน (Confirm) ความต้องการยกเลิกของลูกค้าก่อนรันเครื่องมือทุกครั้ง และใช้ cancelOrder ได้เฉพาะออเดอร์สถานะ PENDING เท่านั้น หากจ่ายเงินหรือเปลี่ยนสถานะแล้วต้องแจ้งว่ายกเลิกผ่านบอทไม่ได้
13. การคำนวณและประเมินราคา (Price Calculation & Preview): เมื่อลูกค้าถามยอดรวม สรุปราคา หรือถามว่ามีส่วนลดใดๆ หรือไม่ ให้ใช้เครื่องมือ 'previewOrder' เพื่อสรุปยอดรวม ส่วนลดโปรโมชั่นของทางร้าน และค่าจัดส่งจริงให้ลูกค้าทราบเสมอ
14. การสอบถามออเดอร์เดิม (Order Inquiry): หากลูกค้าต้องการเช็คสถานะออเดอร์ หรือค้นหาออเดอร์เดิม ให้ขอเบอร์โทรศัพท์ของลูกค้าเพื่อรันเครื่องมือ 'getCustomerOrders' หรือรัน 'getOrderDetails' หากลูกค้าให้เลขใบสั่งซื้อโดยตรง เพื่อนำรายละเอียดและสถานะปัจจุบันมาแจ้งอ้างอิงให้ลูกค้าทราบ
15. การแจ้งข้อมูลสินค้าและยอดเงิน (Full SKU & Price Requirement): ทุกครั้งที่มีการเสนอทางเลือกหรือสรุปยอดรวมรายการต่างๆ ในตะกร้าหรือใบสั่งซื้อเพื่อเตรียมทำการซื้อขาย คุณต้องแสดงรายละเอียดสินค้าแต่ละรายการโดยระบุ (1) ชื่อสินค้าและตัวเลือกไซส์/สี (2) รหัส SKU เต็มรูปแบบ (เช่น 144535_5_M) (3) ราคาต่อหน่วย และ (4) ราคารวมของรายการนั้นๆ เสมอ ห้ามเขียนย่อหรือละเว้นเด็ดขาด อย่างไรก็ตาม หากเป็นกรณีที่ระบบทำการสรุปรายการสั่งซื้อจริง ทวนออเดอร์ หรือพรีวิวออเดอร์เป็นรูปบัตรสวยงาม (Flex Message) สำเร็จแล้ว (หลังรัน previewOrder, createPendingOrder หรือ getOrderDetails สำเร็จ) ให้คุณเปลี่ยนมาพิมพ์ทักทายและแจ้งลูกค้าสั้นๆ สุภาพ เพื่อให้ตรวจสอบข้อมูลบนหน้าบัตรด้านล่างได้เลย โดยห้ามพิมพ์ทวนรายละเอียดสินค้า ยอดรวม หรือที่อยู่จัดส่งซ้ำในข้อความแชทเด็ดขาด เพื่อป้องกันความซ้ำซ้อนและช่วยให้หน้าแชทสะอาดตา ทั้งนี้ หากลูกค้าต้องการทวนออเดอร์ สรุปบิล หรือถามสถานะคำสั่งซื้อที่มีอยู่แล้ว คุณต้องเรียกใช้เครื่องมือ getOrderDetails เสมอ ห้ามพิมพ์เนื้อหาสรุปรายการยอดโอนหรือรายละเอียดสินค้าแบบดิบขึ้นมาเองโดยไม่รันเครื่องมือเด็ดขาด
16. รูปแบบแสดงผลเมื่อค้นหาสินค้า:
    - แสดงชื่อหัวข้อแต่ละสีเป็นตัวหนาโดยตัดรหัสตัวเลขนำหน้าชื่อสินค้าออก แล้วต่อท้ายด้วยเว้นวรรคและรหัส [รหัสสินค้า]_[รหัสสี] ตรงๆ (ห้ามมีคำว่า "Base SKU" หรืออื่น ๆ หน้าตัวเลขรหัส) เช่น:
      * **เสื้อเชิ้ตผู้หญิงแขนยาวผ้าลายริ้ว สีดำ 131065_5**
    - ห้ามแสดงบรรทัด "SKU ตัวอย่าง" หรือข้อมูล SKU รายไซส์ในผลลัพธ์การค้นหาเด็ดขาด
    - ถ้าหากสินค้านั้นทุกไซส์ไม่มีสินค้าเลยก็ไม่ต้องแจ้งลูกค้า
    - หรือหากมีสินค้าในบางไซส์ แต่หากไซส์ใดสต็อกเป็น 0 ตัว ให้เขียนระบุว่า "(ไม่มีสินค้า)" ห้ามพิมพ์คำว่า "0 ตัว" หรือ "สต็อก 0" เด็ดขาด
`;

export interface ChatMessageParam {
  role: "user" | "model";
  content: string;
}

/**
 * ฟังก์ชันเรียกโมเดล Gemini พร้อมระบบ Retry เมื่อเกิดข้อผิดพลาดชั่วคราว (เช่น 503 Service Unavailable หรือ 429 Rate Limit)
 */
async function generateContentWithRetry(model: any, options: any, maxRetries = 3, initialDelay = 1000): Promise<any> {
  let attempt = 0;
  while (true) {
    try {
      return await model.generateContent(options);
    } catch (error: any) {
      attempt++;
      const isTransient = error.status === 503 || error.status === 429 || error.message?.includes("503") || error.message?.includes("429");
      if (isTransient && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.warn(`[Gemini API] Transient error (${error.status || error.message}). Retrying in ${delay}ms (Attempt ${attempt}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

/**
 * ดึงข้อมูลใบกำกับภาษีของลูกค้าจากโน้ตที่เก็บในฐานข้อมูล
 */
function parseVatInfoFromNote(noteText?: string | null) {
  if (!noteText || !noteText.includes("[ขอใบกำกับภาษีเต็มรูปแบบ]")) return undefined;
  const nameMatch = noteText.match(/ชื่อ\/บริษัท:\s*([^\n]+)/);
  const taxIdMatch = noteText.match(/เลขประจำตัวผู้เสียภาษี:\s*([^\n]+)/);
  const addrMatch = noteText.match(/ที่อยู่:\s*([\s\S]+)/);
  if (nameMatch && taxIdMatch && addrMatch) {
    return {
      name: nameMatch[1].trim(),
      taxId: taxIdMatch[1].trim(),
      address: addrMatch[1].trim(),
    };
  }
  return undefined;
}

/**
 * ฟังก์ชันสร้าง Flex Message สำหรับแสดงใบสรุปรายการหรือพรีวิวออเดอร์ของลูกค้า
 */
function buildOrderFlexMessage(data: {
  isPreview: boolean;
  orderNumber?: string;
  createdAt?: Date;
  items: any[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  status?: string;
  hasVat?: boolean;
  vatInfo?: {
    name: string;
    taxId: string;
    address: string;
  };
}) {
  let statusText = "รอการชำระเงิน";
  let statusColor = "#D97706";
  let statusBg = "#FEF3C7";

  if (data.isPreview) {
    statusText = "ยังไม่ได้สรุปออเดอร์";
    statusColor = "#475569";
    statusBg = "#F1F5F9";
  } else if (data.status) {
    const s = data.status;
    if (s === "PAYMENT_UPLOADED") {
      statusText = "ส่งหลักฐานแล้ว (รอตรวจสอบ)";
      statusColor = "#2563EB";
      statusBg = "#DBEAFE";
    } else if (s === "PAYMENT_VERIFIED" || s === "PROCESSING") {
      statusText = "ชำระเงินแล้ว (กำลังจัดเตรียม)";
      statusColor = "#059669";
      statusBg = "#D1FAE5";
    } else if (s === "SHIPPED") {
      statusText = "จัดส่งเรียบร้อยแล้ว";
      statusColor = "#7C3AED";
      statusBg = "#F3E8FF";
    } else if (s === "DELIVERED") {
      statusText = "ได้รับสินค้าแล้ว";
      statusColor = "#10B981";
      statusBg = "#D1FAE5";
    } else if (s === "CANCELLED" || s === "REFUNDED") {
      statusText = "ยกเลิกออเดอร์แล้ว";
      statusColor = "#EF4444";
      statusBg = "#FEE2E2";
    }
  }

  const formattedDate = data.createdAt 
    ? new Date(data.createdAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

  const itemsContents = data.items.map((item: any) => {
    const sleeveText = item.sku[0] === "1" ? "แขนยาว" : item.sku[0] === "2" ? "แขนสั้น" : "แขนสามส่วน";
    const nameStr = `${item.productNameTh || item.productName || "เสื้อเชิ้ต"} (${sleeveText}) - ${item.color} / ${item.size}`;
    const unitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price !== undefined ? item.price : 0;
    
    return {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "box",
          "layout": "vertical",
          "flex": 4,
          "contents": [
            {
              "type": "text",
              "text": nameStr,
              "size": "sm",
              "color": "#334155",
              "wrap": true
            },
            {
              "type": "text",
              "text": `SKU: ${item.sku}`,
              "size": "xs",
              "color": "#64748B",
              "margin": "xs",
              "style": "italic"
            }
          ]
        },
        {
          "type": "text",
          "text": `x ${item.quantity}`,
          "size": "sm",
          "color": "#64748B",
          "flex": 1,
          "align": "center"
        },
        {
          "type": "text",
          "text": `฿${(unitPrice * item.quantity).toLocaleString()}`,
          "size": "sm",
          "color": "#334155",
          "flex": 2,
          "align": "end",
          "weight": "bold"
        }
      ],
      "margin": "sm"
    };
  });

  const summaryContents: any[] = [
    {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "text",
          "text": "ยอดรวมสินค้า",
          "size": "sm",
          "color": "#64748B",
          "flex": 4,
          "wrap": true
        },
        {
          "type": "text",
          "text": `฿${data.subtotal.toLocaleString()}`,
          "size": "sm",
          "color": "#334155",
          "align": "end",
          "flex": 2
        }
      ]
    }
  ];

  if (data.discountAmount > 0) {
    summaryContents.push({
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "text",
          "text": "ส่วนลดโปรโมชั่น",
          "size": "sm",
          "color": "#E11D48",
          "flex": 4,
          "wrap": true
        },
        {
          "type": "text",
          "text": `-฿${data.discountAmount.toLocaleString()}`,
          "size": "sm",
          "color": "#E11D48",
          "align": "end",
          "flex": 2
        }
      ],
      "margin": "sm"
    });
  }

  summaryContents.push({
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "text",
        "text": "ค่าจัดส่ง",
        "size": "sm",
        "color": "#64748B",
        "flex": 4,
        "wrap": true
      },
      {
        "type": "text",
        "text": data.shippingFee > 0 ? `฿${data.shippingFee.toLocaleString()}` : "ฟรีค่าจัดส่ง",
        "size": "sm",
        "color": data.shippingFee > 0 ? "#334155" : "#10B981",
        "align": "end",
        "flex": 2
      }
    ],
    "margin": "sm"
  });

  if (data.hasVat) {
    const baseAmount = data.subtotal - data.discountAmount + data.shippingFee;
    const vatAmount = Math.round(baseAmount * 0.07 * 100) / 100;
    summaryContents.push({
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "text",
          "text": "ภาษีมูลค่าเพิ่ม (VAT 7%)",
          "size": "sm",
          "color": "#64748B",
          "flex": 4,
          "wrap": true
        },
        {
          "type": "text",
          "text": `฿${vatAmount.toLocaleString()}`,
          "size": "sm",
          "color": "#334155",
          "align": "end",
          "flex": 2
        }
      ],
      "margin": "sm"
    });
  }

  summaryContents.push({
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "text",
        "text": "ยอดสุทธิ",
        "size": "lg",
        "color": "#0A2B5E",
        "weight": "bold",
        "flex": 4,
        "wrap": true
      },
      {
        "type": "text",
        "text": `฿${data.total.toLocaleString()}`,
        "size": "lg",
        "color": "#0A2B5E",
        "align": "end",
        "weight": "bold",
        "flex": 2
      }
    ],
    "margin": "md"
  });

  const footerButtons: any[] = [];
  if (data.isPreview) {
    footerButtons.push({
      "type": "button",
      "action": {
        "type": "message",
        "label": "ยืนยันสั่งซื้อสินค้า",
        "text": "ยืนยันสั่งซื้อ"
      },
      "style": "primary",
      "color": "#0A2B5E"
    });
  } else {
    const isPending = !data.status || data.status === "PENDING";
    if (isPending) {
      if (data.hasVat) {
        footerButtons.push({
          "type": "button",
          "action": {
            "type": "postback",
            "label": "โอนเงินธนาคาร (กสิกรไทย)",
            "data": `action=kbank&orderNumber=${data.orderNumber || ""}&total=${data.total}`
          },
          "style": "primary",
          "color": "#0A2B5E"
        });
      } else {
        footerButtons.push({
          "type": "button",
          "action": {
            "type": "postback",
            "label": "สแกนชำระเงิน (PromptPay)",
            "data": `action=pay&orderNumber=${data.orderNumber || ""}&total=${data.total}`
          },
          "style": "primary",
          "color": "#0A2B5E"
        });
      }
    }
  }

  footerButtons.push({
    "type": "button",
    "action": {
      "type": "message",
      "label": "คุยกับเจ้าหน้าที่",
      "text": "ติดต่อแอดมิน"
    },
    "style": "secondary",
    "margin": "sm"
  });

  const bodyContents: any[] = [
    {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "text",
          "text": data.isPreview ? "สถานะการทำรายการ:" : "เลขที่ออเดอร์:",
          "size": "xs",
          "color": "#94A3B8"
        },
        {
          "type": "text",
          "text": data.isPreview ? "ร่างพรีวิว" : `#${data.orderNumber}`,
          "size": "xs",
          "color": "#475569",
          "align": "end",
          "weight": "bold"
        }
      ]
    },
    {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "text",
          "text": "วันที่สั่งซื้อ:",
          "size": "xs",
          "color": "#94A3B8"
        },
        {
          "type": "text",
          "text": formattedDate,
          "size": "xs",
          "color": "#475569",
          "align": "end"
        }
      ],
      "margin": "xs"
    }
  ];

  if (data.hasVat) {
    bodyContents.push({
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "ผู้ออกใบกำกับภาษี:",
          "size": "xs",
          "color": "#94A3B8",
          "margin": "sm"
        },
        {
          "type": "text",
          "text": "บริษัท ธงธัญ99 จำกัด (สำนักงานใหญ่)",
          "size": "xs",
          "color": "#334155",
          "weight": "bold",
          "margin": "xs"
        },
        {
          "type": "text",
          "text": "เลขประจำตัวผู้เสียภาษี: 0105558016255",
          "size": "xs",
          "color": "#334155",
          "margin": "xs"
        },
        {
          "type": "text",
          "text": "9 ซอยพระรามที่ 2 ซอย 51 แยก 3 แขวงท่าข้าม เขตบางขุนเทียน กรุงเทพฯ 10150",
          "size": "xs",
          "color": "#64748B",
          "wrap": true,
          "margin": "xs"
        }
      ],
      "margin": "md"
    });
  }

  bodyContents.push(
    {
      "type": "separator",
      "margin": "lg"
    },
    {
      "type": "text",
      "text": "รายการสินค้า",
      "weight": "bold",
      "size": "sm",
      "color": "#0A2B5E",
      "margin": "lg"
    },
    {
      "type": "box",
      "layout": "vertical",
      "contents": itemsContents
    },
    {
      "type": "separator",
      "margin": "lg"
    },
    {
      "type": "box",
      "layout": "vertical",
      "contents": summaryContents,
      "margin": "lg"
    }
  );

  const bubble: any = {
    "type": "bubble",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "HIGHBURY",
          "weight": "bold",
          "color": "#1A6CC8",
          "size": "sm"
        },
        {
          "type": "text",
          "text": data.isPreview ? "พรีวิวใบสั่งซื้อ" : "สรุปรายการสั่งซื้อ",
          "weight": "bold",
          "size": "xl",
          "color": "#0A2B5E",
          "margin": "xs"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": statusText,
              "size": "xs",
              "color": statusColor,
              "weight": "bold",
              "flex": 0
            }
          ],
          "backgroundColor": statusBg,
          "cornerRadius": "sm",
          "paddingStart": "md",
          "paddingEnd": "md",
          "paddingTop": "xs",
          "paddingBottom": "xs",
          "margin": "md",
          "alignItems": "center"
        }
      ],
      "paddingBottom": "none"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": bodyContents
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "contents": footerButtons
    }
  };

  if (data.hasVat) {
    // ข้อมูลใบกำกับภาษีของลูกค้า (Customer VAT Info) - แยกจากข้อมูลจัดส่ง
    if (data.vatInfo) {
      bubble.body.contents.push(
        {
          "type": "separator",
          "margin": "lg"
        },
        {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "ข้อมูลใบกำกับภาษีลูกค้า",
              "weight": "bold",
              "size": "sm",
              "color": "#0A2B5E"
            },
            {
              "type": "text",
              "text": `ชื่อ/บริษัท: ${data.vatInfo.name}`,
              "size": "xs",
              "color": "#334155",
              "margin": "sm"
            },
            {
              "type": "text",
              "text": `เลขผู้เสียภาษี: ${data.vatInfo.taxId}`,
              "size": "xs",
              "color": "#334155",
              "margin": "xs"
            },
            {
              "type": "text",
              "text": `ที่อยู่: ${data.vatInfo.address}`,
              "size": "xs",
              "color": "#64748B",
              "wrap": true,
              "margin": "xs"
            }
          ],
          "margin": "lg"
        }
      );
    }
  }

  if (data.customerName) {
    bubble.body.contents.push(
      {
        "type": "separator",
        "margin": "lg"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "ข้อมูลจัดส่ง",
            "weight": "bold",
            "size": "sm",
            "color": "#0A2B5E"
          },
          {
            "type": "text",
            "text": `คุณ ${data.customerName}`,
            "size": "xs",
            "color": "#334155",
            "margin": "sm"
          },
          {
            "type": "text",
            "text": `โทร: ${data.customerPhone}`,
            "size": "xs",
            "color": "#334155",
            "margin": "xs"
          },
          {
            "type": "text",
            "text": data.customerAddress || "",
            "size": "xs",
            "color": "#64748B",
            "wrap": true,
            "margin": "xs"
          }
        ],
        "margin": "lg"
      }
    );
  }

  return {
    "type": "flex",
    "altText": data.isPreview ? "พรีวิวใบสั่งซื้อเสื้อเชิ้ต Highbury" : "สรุปรายการสั่งซื้อเสื้อเชิ้ต Highbury",
    "contents": bubble
  };
}

/**
 * ฟังก์ชันประมวลผลข้อความจากผู้ใช้ผ่าน LLM (Gemini) พร้อมรับผิดชอบการรัน Function Call
 */
export async function runChatbotTurn(
  lineUserId: string,
  userMessage: string,
  chatHistory: ChatMessageParam[],
  imagePart?: { inlineData: { data: string; mimeType: string } }
): Promise<{ text: string; requiresAdmin: boolean; qrPayload?: string; flexMessage?: any; hasVat?: boolean }> {
  let requiresAdmin = false;
  let qrPayload: string | undefined = undefined;
  let flexMessage: any = undefined;
  let hasVat = false;
  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;
  let apiCallsCount = 0;

  try {
    if (!apiKey) {
      console.warn("[Gemini API] Missing GEMINI_API_KEY environment variable.");
      return {
        text: "ขออภัยครับ ระบบประมวลผลคำถามของทางร้านขัดข้องชั่วคราว กรุณารอเจ้าหน้าที่แอดมินเข้ามาดูแลคุณสักครู่ครับ",
        requiresAdmin: true,
      };
    }

    // 1. ตรวจสอบ Budget / Credit คงเหลือ (THB)
    try {
      const creditSetting = await prisma.siteSetting.findUnique({
        where: { key: "gemini_credit_balance" },
      });
      const creditBalance = parseFloat(creditSetting?.value || "500.00");

      if (creditBalance <= 0.05) {
        console.warn(`[Gemini API] Credit balance depleted (฿${creditBalance}). Falling back to admin.`);
        return {
          text: "ขออภัยด้วยครับ ทางร้านขอส่งต่อบทสนทนานี้ให้กับแอดมินดูแลโดยตรงนะครับ รอแอดมินตอบกลับสักครู่ครับ",
          requiresAdmin: true,
        };
      }
    } catch (err) {
      console.error("[Gemini credit check error]:", err);
    }

    // 2. ดึงโมเดลที่จะใช้จากฐานข้อมูล
    let modelName = "gemini-2.5-flash";
    try {
      const modelSetting = await prisma.siteSetting.findUnique({
        where: { key: "gemini_model_name" },
      });
      if (modelSetting?.value) {
        modelName = modelSetting.value;
      }
    } catch (err) {
      console.error("[Gemini model name fetch error]:", err);
    }

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: tools,
    });

    // แปลง Chat History เป็นรูปแบบของ Gemini SDK
    const contents: Content[] = chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // เพิ่มข้อความล่าสุดเข้าไปใน session
    const userParts: any[] = [{ text: userMessage }];
    if (imagePart) {
      userParts.push(imagePart);
    }

    contents.push({
      role: "user",
      parts: userParts,
    });

    // ส่งข้อความไปประมวลผล
    let response = await generateContentWithRetry(model, { contents });
    apiCallsCount++;
    if (response?.response?.usageMetadata) {
      totalPromptTokens += response.response.usageMetadata.promptTokenCount || 0;
      totalCompletionTokens += response.response.usageMetadata.candidatesTokenCount || 0;
    }
    let candidate = response.response.candidates?.[0];
    let functionCalls = candidate?.content?.parts?.filter((part: any) => part.functionCall) || [];

    // วนลูปดำเนินการตาม Function Call ที่โมเดลร้องขอ (ถ้ามี)
    while (functionCalls.length > 0) {
      const toolResults: any[] = [];

      for (const part of functionCalls) {
        const call = part.functionCall;
        if (!call) continue;

        console.log(`[Bot Action] Model requested tool: ${call.name} with args:`, call.args);

        let functionResult: any;
        try {
          // คัดแยกชื่อเครื่องมือและดำเนินการดึงข้อมูลจาก DB
          switch (call.name) {
            case "searchProducts":
              functionResult = await skills.searchProducts(call.args as any);
              break;
            case "getProductDetails":
              functionResult = await skills.getProductDetails((call.args as any).productSlug);
              break;
            case "checkStock":
              functionResult = await skills.checkStock((call.args as any).variantSku);
              break;
            case "getActivePromotions":
              functionResult = await skills.getActivePromotions();
              break;
            case "validatePromoCode":
              functionResult = await skills.validatePromoCode((call.args as any).code);
              break;
            case "createPendingOrder":
              // ผูกข้อมูล lineUserId เข้าไปเพื่อแทร็กกิ้ง
              const orderResult = await skills.createPendingOrder({
                ...(call.args as any),
                lineUserId,
              });
              functionResult = orderResult;
              qrPayload = orderResult.qrPayload;
              if (orderResult && (call.args as any).vatInfo) {
                hasVat = true;
              }

              // สร้าง Flex Message สำหรับออเดอร์ใหม่
              try {
                flexMessage = buildOrderFlexMessage({
                  isPreview: false,
                  orderNumber: orderResult.orderNumber,
                  createdAt: orderResult.createdAt,
                  items: orderResult.items,
                  subtotal: orderResult.subtotal,
                  discountAmount: orderResult.discountAmount,
                  shippingFee: orderResult.shippingFee,
                  total: orderResult.total,
                  customerName: orderResult.customerName,
                  customerPhone: orderResult.customerPhone,
                  customerAddress: orderResult.customerAddress,
                  hasVat: !!(call.args as any).vatInfo,
                  vatInfo: (call.args as any).vatInfo,
                });
              } catch (flexErr) {
                console.error("[Flex Message Error createPendingOrder]:", flexErr);
              }
              break;
            case "submitPaymentProof":
              functionResult = await skills.submitPaymentProof(
                (call.args as any).orderNumber,
                (call.args as any).imageUrl
              );
              break;
            case "cancelOrder":
              functionResult = await skills.cancelOrder(
                (call.args as any).orderNumber
              );
              break;
            case "getCustomerOrders":
              functionResult = await skills.getCustomerOrders(
                (call.args as any).customerPhone
              );
              break;
            case "getOrderDetails":
              const orderDetailsResult = await skills.getOrderDetails(
                (call.args as any).orderNumber
              );
              functionResult = orderDetailsResult;

              if (orderDetailsResult.success) {
                if ((orderDetailsResult as any).note?.includes("[ขอใบกำกับภาษีเต็มรูปแบบ]")) {
                  hasVat = true;
                }
                try {
                  flexMessage = buildOrderFlexMessage({
                    isPreview: false,
                    orderNumber: orderDetailsResult.orderNumber,
                    createdAt: orderDetailsResult.createdAt,
                    items: orderDetailsResult.items || [],
                    subtotal: (orderDetailsResult.subtotal ?? orderDetailsResult.total ?? 0) as number,
                    discountAmount: (orderDetailsResult.discountAmount ?? 0) as number,
                    shippingFee: (orderDetailsResult.shippingFee ?? 0) as number,
                    total: (orderDetailsResult.total ?? 0) as number,
                    customerName: orderDetailsResult.shippingName,
                    customerPhone: orderDetailsResult.shippingPhone,
                    customerAddress: orderDetailsResult.shippingAddress,
                    status: orderDetailsResult.status,
                    hasVat: (orderDetailsResult as any).note?.includes("[ขอใบกำกับภาษีเต็มรูปแบบ]") ?? false,
                    vatInfo: parseVatInfoFromNote((orderDetailsResult as any).note),
                  });
                } catch (flexErr) {
                  console.error("[Flex Message Error getOrderDetails]:", flexErr);
                }
              }
              break;
            case "previewOrder":
              const previewResult = await skills.previewOrder(
                call.args as any
              );
              functionResult = previewResult;
              if (previewResult.success && (call.args as any).vatInfo) {
                hasVat = true;
              }

              // สร้าง Flex Message สำหรับพรีวิว
              try {
                flexMessage = buildOrderFlexMessage({
                  isPreview: true,
                  items: previewResult.items,
                  subtotal: previewResult.subtotal,
                  discountAmount: previewResult.discountAmount,
                  shippingFee: previewResult.shippingFee,
                  total: previewResult.total,
                  hasVat: !!(call.args as any).vatInfo,
                  vatInfo: (call.args as any).vatInfo,
                });
              } catch (flexErr) {
                console.error("[Flex Message Error previewOrder]:", flexErr);
              }
              break;
            case "requestAdminIntervention":
              requiresAdmin = true;
              functionResult = { success: true, message: "แจ้งเตือนระบบให้แอดมินตัวจริงรับช่วงดูแลต่อเรียบร้อยแล้ว" };
              break;
            default:
              throw new Error(`ไม่พบความสามารถเครื่องมือชื่อ ${call.name}`);
          }
        } catch (err: any) {
          console.error(`[Bot Skill Error] ${call.name}:`, err);
          functionResult = { error: err.message || "เกิดข้อผิดพลาดในการรันคำสั่งพิเศษ" };
        }

        toolResults.push({
          functionResponse: {
            name: call.name,
            response: { result: functionResult },
          },
        });
      }

      // ส่งผลลัพธ์ของฟังก์ชันกลับไปยังโมเดลเพื่อให้สรุปหรือคุยต่อ
      contents.push(candidate!.content); // เพิ่มคำตอบก่อนหน้าที่มีการเรียกฟังก์ชัน
      contents.push({
        role: "user",
        parts: toolResults, // ส่งผลลัพธ์ของฟังก์ชันกลับไป
      });

      response = await generateContentWithRetry(model, { contents });
      apiCallsCount++;
      if (response?.response?.usageMetadata) {
        totalPromptTokens += response.response.usageMetadata.promptTokenCount || 0;
        totalCompletionTokens += response.response.usageMetadata.candidatesTokenCount || 0;
      }
      candidate = response.response.candidates?.[0];
      functionCalls = candidate?.content?.parts?.filter((part: any) => part.functionCall) || [];
    }

    let finalReplyText = response.response.text?.() || "ขออภัยด้วยครับ ผมยังไม่เข้าใจความต้องการของคุณ รบกวนแจ้งอีกครั้งได้ไหมครับ";
    
    // ลบส่วนคิดวิเคราะห์ (Thought/Thinking) ที่โมเดลอาจจะพ่นติดออกมาเป็นภาษาอังกฤษก่อนถึงข้อความภาษาไทย
    finalReplyText = finalReplyText.replace(/^thought:[\s\S]*?(?=[ก-๙])/gi, "").trim();

    // 3. บันทึกสถิติการใช้งาน
    try {
      const pricing = MODEL_PRICING[modelName] || MODEL_PRICING["gemini-2.5-flash"];
      const USD_TO_THB = 36.5;
      const turnCostUsd = (totalPromptTokens * pricing.input) + (totalCompletionTokens * pricing.output);
      const turnCost = turnCostUsd * USD_TO_THB; // THB Cost

      const keys = [
        "gemini_total_input_tokens",
        "gemini_total_output_tokens",
        "gemini_total_calls",
        "gemini_total_cost",
        "gemini_credit_balance"
      ];
      const existingSettings = await prisma.siteSetting.findMany({
        where: { key: { in: keys } }
      });
      const settingsMap = Object.fromEntries(existingSettings.map(s => [s.key, s.value]));

      const currentInput = parseInt(settingsMap["gemini_total_input_tokens"] || "0", 10);
      const currentOutput = parseInt(settingsMap["gemini_total_output_tokens"] || "0", 10);
      const currentCalls = parseInt(settingsMap["gemini_total_calls"] || "0", 10);
      const currentCost = parseFloat(settingsMap["gemini_total_cost"] || "0.0");
      const currentCredit = parseFloat(settingsMap["gemini_credit_balance"] || "500.00");

      await Promise.all([
        prisma.siteSetting.upsert({
          where: { key: "gemini_total_input_tokens" },
          update: { value: String(currentInput + totalPromptTokens) },
          create: { key: "gemini_total_input_tokens", value: String(totalPromptTokens) }
        }),
        prisma.siteSetting.upsert({
          where: { key: "gemini_total_output_tokens" },
          update: { value: String(currentOutput + totalCompletionTokens) },
          create: { key: "gemini_total_output_tokens", value: String(totalCompletionTokens) }
        }),
        prisma.siteSetting.upsert({
          where: { key: "gemini_total_calls" },
          update: { value: String(currentCalls + apiCallsCount) },
          create: { key: "gemini_total_calls", value: String(apiCallsCount) }
        }),
        prisma.siteSetting.upsert({
          where: { key: "gemini_total_cost" },
          update: { value: String((currentCost + turnCost).toFixed(6)) },
          create: { key: "gemini_total_cost", value: String(turnCost.toFixed(6)) }
        }),
        prisma.siteSetting.upsert({
          where: { key: "gemini_credit_balance" },
          update: { value: String(Math.max(0, currentCredit - turnCost).toFixed(6)) },
          create: { key: "gemini_credit_balance", value: String(Math.max(0, 500.00 - turnCost).toFixed(6)) }
        }),
      ]);
    } catch (err) {
      console.error("[Gemini stats update error]:", err);
    }

    const orderNumberMatch = finalReplyText.match(/HBI\d{12}/);
    if (orderNumberMatch && !flexMessage) {
      const orderNo = orderNumberMatch[0];
      console.log(`[runChatbotTurn] Fallback: Found order number ${orderNo} in text response but no flexMessage was generated. Fetching...`);
      try {
        const orderDetailsResult = await skills.getOrderDetails(orderNo);
        if (orderDetailsResult.success) {
          flexMessage = buildOrderFlexMessage({
            isPreview: false,
            orderNumber: orderDetailsResult.orderNumber,
            createdAt: orderDetailsResult.createdAt,
            items: orderDetailsResult.items || [],
            subtotal: (orderDetailsResult.subtotal ?? orderDetailsResult.total ?? 0) as number,
            discountAmount: (orderDetailsResult.discountAmount ?? 0) as number,
            shippingFee: (orderDetailsResult.shippingFee ?? 0) as number,
            total: (orderDetailsResult.total ?? 0) as number,
            customerName: orderDetailsResult.shippingName,
            customerPhone: orderDetailsResult.shippingPhone,
            customerAddress: orderDetailsResult.shippingAddress,
            status: orderDetailsResult.status,
            hasVat: (orderDetailsResult as any).note?.includes("[ขอใบกำกับภาษีเต็มรูปแบบ]") ?? false,
            vatInfo: parseVatInfoFromNote((orderDetailsResult as any).note),
          });
          if ((orderDetailsResult as any).note?.includes("[ขอใบกำกับภาษีเต็มรูปแบบ]")) {
            hasVat = true;
          }
        }
      } catch (err) {
        console.error("[runChatbotTurn fallback order details fetch error]:", err);
      }
    }

    return {
      text: finalReplyText,
      requiresAdmin,
      qrPayload,
      flexMessage,
      hasVat,
    };
  } catch (error) {
    console.error("[Gemini RunChatbotTurn Error]:", error);
    return {
      text: "ขออภัยครับ น้องไฮบิวรี่ขอเวลาประมวลผลข้อมูลสักครู่ หรือต้องการสอบถามอะไรด่วนแชทไว้ได้เลย เดี๋ยวจะมีพี่แอดมินเข้ามาบริการเพิ่มนะครับ",
      requiresAdmin: false,
    };
  }
}
