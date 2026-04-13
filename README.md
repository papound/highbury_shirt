# Highbury International — E-Commerce Website

เว็บไซต์ขายเสื้อเชิ้ตชาย/หญิงสำเร็จรูป สำหรับแบรนด์ **Highbury International**

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** + **Tailwind CSS v4**
- **Prisma 7** + SQLite (libsql adapter)
- **NextAuth v5** (JWT)
- **shadcn/ui** (base-nova style)
- **UploadThing** — อัปโหลดรูปสินค้าและสลิปโอนเงิน
- **Recharts**, **Tiptap**, **ExcelJS**, **PromptPay QR**

## เริ่มต้นใช้งาน

### ข้อกำหนด

- Node.js **v22** (ใช้ nvm)

### ติดตั้งและรันโปรเจค

```bash
# ใช้ Node.js v22
source ~/.nvm/nvm.sh && nvm use 22

# ติดตั้ง dependencies
npm install

# สร้างและ seed ฐานข้อมูล
npx prisma migrate dev
npx prisma db seed

# รัน development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

### Build สำหรับ Production

```bash
source ~/.nvm/nvm.sh && nvm use 22
npm run build
npm start
```

## หน้าต่างๆ

### ร้านค้า (Storefront)

| URL | คำอธิบาย |
|-----|----------|
| `/` | หน้าแรก (สินค้าแนะนำ, หมวดหมู่, ติดต่อ) |
| `/products` | รายการสินค้าทั้งหมด |
| `/products/[slug]` | รายละเอียดสินค้า |
| `/cart` | ตะกร้าสินค้า |
| `/checkout` | ชำระเงิน (PromptPay QR + อัปโหลดสลิป) |
| `/auth/login` | เข้าสู่ระบบลูกค้า |
| `/auth/register` | สมัครสมาชิก |
| `/account/orders` | ประวัติคำสั่งซื้อ |
| `/account/profile` | แก้ไขข้อมูลส่วนตัว |

### แอดมิน (Office)

| URL | คำอธิบาย |
|-----|----------|
| `/admin/login` | เข้าสู่ระบบเจ้าหน้าที่ (แยกจากลูกค้า) |
| `/admin/dashboard` | ภาพรวมยอดขาย, คำสั่งซื้อ, สินค้า |
| `/admin/products` | จัดการสินค้า (เพิ่ม/แก้ไข/ลบ) |
| `/admin/inventory` | จัดการสต็อกคลังสินค้า |
| `/admin/orders` | จัดการคำสั่งซื้อและสลิป |
| `/admin/customers` | รายชื่อและข้อมูลลูกค้า |
| `/admin/promotions` | จัดการโปรโมชั่น/คูปอง |
| `/admin/reports` | รายงานยอดขาย (SUPERADMIN, ADMIN, ACCOUNTANT) |
| `/admin/blog` | จัดการบทความ |
| `/admin/settings` | ตั้งค่า (PromptPay, คลัง, ผู้ใช้) — SUPERADMIN, ADMIN |

> **หมายเหตุ:** หน้า `/admin/login` จะปฏิเสธบัญชีที่มี role `CUSTOMER` และหน้า `/auth/login` จะ redirect admin ไปยัง `/admin/dashboard` โดยอัตโนมัติ

## บัญชีผู้ใช้ (สำหรับ Dev)

### แอดมิน / เจ้าหน้าที่ → เข้าที่ `/admin/login`

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@highburyinternational.com` | `admin123456` |
| Staff | `staff@highburyinternational.com` | `staff123456` |
| Accountant | `accountant@highburyinternational.com` | `staff123456` |

### ลูกค้า → เข้าที่ `/auth/login`

| Role | Email | Password |
|------|-------|----------|
| Customer (test) | `test@customer.com` | `test1234` |

## Environment Variables

สร้างไฟล์ `.env.local` และกำหนดค่าดังนี้:

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# UploadThing (รูปสินค้า + สลิปโอนเงิน)
UPLOADTHING_TOKEN="your-uploadthing-token"

# LINE Notify (optional)
LINE_NOTIFY_TOKEN_ADMIN="your-line-token"

# Email (Resend, optional)
RESEND_API_KEY="your-resend-key"
FROM_EMAIL="noreply@highburyinternational.com"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## UploadThing Routes

| Route | ใช้โดย | คำอธิบาย |
|-------|--------|----------|
| `productImage` | Admin | อัปโหลดรูปสินค้า (max 4MB, สูงสุด 10 รูป) — ต้อง login เป็น admin |
| `paymentSlip` | ลูกค้า | อัปโหลดสลิปโอนเงิน (max 5MB) — guest checkout ก็ใช้ได้ |

## โครงสร้างโปรเจค

```
app/
├── (storefront)/       # หน้าร้านค้า
│   ├── auth/           # login/register ลูกค้า
│   ├── account/        # หน้าบัญชีลูกค้า (ต้อง login)
│   └── checkout/       # กระบวนการสั่งซื้อ
├── admin/
│   ├── login/          # login เฉพาะเจ้าหน้าที่
│   └── (protected)/    # ทุกหน้า admin (ต้อง login + role ถูกต้อง)
└── api/                # API Routes

components/
├── admin/              # Sidebar, forms, charts สำหรับ admin
├── storefront/         # Header, Footer, Cart สำหรับร้านค้า
└── ui/                 # shadcn/ui base components

lib/                    # utilities (prisma, auth, email, uploadthing, etc.)
prisma/
├── schema.prisma       # Database schema
└── seed.ts             # ข้อมูลตัวอย่าง (admin users, สินค้า, คลังสินค้า)
```
