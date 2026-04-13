# Highbury International — E-Commerce Website

เว็บไซต์ขายเสื้อเชิ้ตชาย/หญิงสำเร็จรูป สำหรับแบรนด์ **Highbury International**

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** + **Tailwind CSS v4**
- **Prisma 7** + SQLite (libsql adapter)
- **NextAuth v5** (JWT)
- **shadcn/ui** (base-nova style)
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

| URL | คำอธิบาย |
|-----|----------|
| `/` | หน้าแรก (สินค้าแนะนำ, โปรโมชั่น) |
| `/products` | รายการสินค้าทั้งหมด |
| `/products/[slug]` | รายละเอียดสินค้า |
| `/cart` | ตะกร้าสินค้า |
| `/checkout` | ชำระเงิน (PromptPay QR) |
| `/auth/login` | เข้าสู่ระบบลูกค้า |
| `/auth/register` | สมัครสมาชิก |
| `/account/orders` | ประวัติคำสั่งซื้อ |
| `/admin/login` | เข้าสู่ระบบแอดมิน |
| `/admin/dashboard` | Dashboard แอดมิน |
| `/admin/products` | จัดการสินค้า |
| `/admin/inventory` | จัดการสต็อก |
| `/admin/orders` | จัดการออเดอร์ |
| `/admin/promotions` | จัดการโปรโมชั่น |
| `/admin/reports` | รายงานยอดขาย |
| `/admin/blog` | จัดการบทความ |
| `/admin/settings` | ตั้งค่าระบบ (PromptPay, คลังสินค้า, ผู้ใช้) |

## บัญชีแอดมิน (สำหรับ Dev)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@highburyinternational.com` | `admin123456` |
| Staff | `staff@highburyinternational.com` | `staff123456` |
| Accountant | `accountant@highburyinternational.com` | `staff123456` |

## Environment Variables

สร้างไฟล์ `.env.local` และกำหนดค่าดังนี้:

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# LINE Notify (optional)
LINE_NOTIFY_TOKEN_ADMIN="your-line-token"

# Email (Resend, optional)
RESEND_API_KEY="your-resend-key"
FROM_EMAIL="noreply@highburyinternational.com"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## โครงสร้างโปรเจค

```
app/
├── (storefront)/       # หน้าร้านค้า
├── admin/              # หน้าแอดมิน (/admin/...)
│   ├── login/
│   └── (protected)/    # ต้อง login ก่อน
└── api/                # API Routes

components/
├── admin/              # components สำหรับแอดมิน
├── storefront/         # components สำหรับร้านค้า
└── ui/                 # shadcn/ui components

lib/                    # utilities (prisma, auth, email, etc.)
prisma/
├── schema.prisma       # Database schema
└── seed.ts             # ข้อมูลตัวอย่าง
```
