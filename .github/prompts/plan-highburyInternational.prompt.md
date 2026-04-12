# Plan: Highbury International E-commerce Website

เว็บไซต์อีคอมเมิร์ซ full-stack สำหรับขายเสื้อเชิ้ตสำเร็จรูป พร้อมระบบ admin แยกชัดเจน, inventory management แบบ variant (สี/ไซส์), PromptPay QR payment, โปรโมชั่น (ซื้อ 3 แถม 1), multi-language (TH/EN), Line Notify, และ Excel import/export สำหรับบริหารจัดการสินค้า 100-500 รายการ รองรับ 50-200 order/วัน

**Tech Stack:**
- **Next.js 15** (App Router) + TypeScript - full-stack framework
- **Prisma** + SQLite (dev) → Neon/Supabase PostgreSQL (production)  
- **NextAuth.js v5** - authentication (customer + admin RBAC)
- **Tailwind CSS + shadcn/ui** - modern UI ตามโทนสีแบรนด์
- **Uploadthing** - product image uploads
- **ExcelJS** - import/export สินค้า
- **Resend** - email notifications
- **Line Notify API** - แจ้งเตือน Line
- **i18next** - multi-language TH/EN
- **Vercel** - deployment

---

## Steps

### Phase 1: Project Setup & Foundation

1. **Initialize Next.js 15 project** with TypeScript, Tailwind, ESLint
   - สร้าง folder structure: `app/(storefront)`, `app/(admin)`, `lib/`, `components/`
   - ติดตั้ง shadcn/ui components
   - Setup Prisma with SQLite

2. **Design system setup** based on Highbury branding
   - Extract color palette จากรูปที่แนบ (น้ำเงิน #1E40AF, ดำ, ขาว)
   - กำหนด Tailwind theme config
   - สร้าง reusable components: `Button`, `Card`, `Badge`, `Table`, `Modal`

3. **Database schema design** (`schema.prisma`)
   - `User` (customer + admin, role-based)
   - `Product` (name, description, basePrice, category, status)
   - `ProductVariant` (productId, color, size, sku, price, stockQuantity)
   - `ProductImage` (productId, url, order)
   - `Category`
   - `Order` (orderNumber, userId, status, total, payment status)
   - `OrderItem` (orderId, variantId, quantity, price, appliedPromotion)
   - `Promotion` (type: BUY_X_GET_Y, PERCENTAGE, code, rules as JSON)
   - `PaymentProof` (orderId, imageUrl, status, verifiedBy)
   - `Warehouse` (name, location)
   - `Inventory` (variantId, warehouseId, quantity)
   - `BlogPost` (title_th, title_en, content_th, content_en, slug)

4. **Seed initial data**
   - Admin user accounts
   - Sample categories (เสื้อเชิ้ตผู้ชาย, เสื้อเชิ้ตผู้หญิง)
   - Test products with variants

### Phase 2: Customer-Facing Storefront

5. **Homepage** (`app/(storefront)/page.tsx`)
   - Hero section พร้อม Highbury logo, tagline ทันสมัยมีชีวิตชีวา
   - Featured products carousel
   - Category navigation
   - Promotion banners
   - i18n language switcher (TH/EN)

6. **Product catalog** (`app/(storefront)/products/page.tsx`)
   - Grid layout พร้อม filters (category, color, size, price range)
   - Search functionality
   - Pagination/infinite scroll
   - Product card แสดง variant options

7. **Product detail page** (`app/(storefront)/products/[slug]/page.tsx`)
   - Image gallery (zoom, thumbnails)
   - Variant selector (color/size dropdown → stock display, price update)
   - Add to cart with quantity
   - Related products

8. **Shopping cart system**
   - Cart state management (Zustand or React Context)
   - Cart page (`app/(storefront)/cart/page.tsx`)
   - Calculate promotions (ซื้อ 3 แถม 1 auto-apply)
   - Promotion code input field

9. **Checkout flow**
   - Customer info form (Guest checkout or login required)
   - Shipping address
   - PromptPay QR generation (`lib/promptpay.ts`)
     - ใช้ `promptpay-qr` library
     - Generate QR พร้อม order reference number, amount
   - Upload payment slip (`app/(storefront)/checkout/payment/page.tsx`)
     - Uploadthing integration
   - Order confirmation page

10. **Customer account pages**
    - Registration/Login (`app/(storefront)/auth/*/page.tsx`)
    - Order history (`app/(storefront)/account/orders/page.tsx`)
    - Profile management

11. **Blog section** (`app/(storefront)/blog/page.tsx`)
    - Blog listing with i18n
    - Individual blog post pages (`app/(storefront)/blog/[slug]/page.tsx`)
    - Dynamic content based on locale

### Phase 3: Admin Dashboard

12. **Admin authentication & RBAC**
    - Login page (`app/(admin)/login/page.tsx`)
    - NextAuth.js config with role check
    - Permission middleware (Admin, Staff, Accountant roles)

13. **Admin dashboard** (`app/(admin)/dashboard/page.tsx`)
    - Real-time stats: ยอดขายวันนี้, pending orders, low stock alerts
    - Charts: ยอดขาย 7 วัน, สินค้าขายดี (Recharts or Tremor)
    - Recent orders table

14. **Product management** (`app/(admin)/products/page.tsx`)
    - CRUD products
    - Variant management UI (add/edit colors, sizes, prices, SKU)
    - Bulk actions (activate/deactivate)
    - Excel import (`app/api/admin/products/import/route.ts`)
      - Upload Excel → ExcelJS parse → validate → insert DB
      - Template download endpoint

15. **Inventory management** (`app/(admin)/inventory/page.tsx`)
    - Multi-warehouse view
    - Stock levels by variant/warehouse
    - Stock adjustment (add/reduce with notes)
    - Low stock alerts
    - Excel export current inventory

16. **Order management** (`app/(admin)/orders/page.tsx`)
    - Order listing (filter: status, date range, payment status)
    - Order detail modal
    - Payment proof verification (`app/(admin)/orders/[id]/verify-payment/page.tsx`)
      - View uploaded slip
      - Approve/Reject buttons → update order status
    - Order status update (processing → shipped → delivered)
    - Print invoice/packing slip

17. **Promotion management** (`app/(admin)/promotions/page.tsx`)
    - Create promotions: ซื้อ 3 แถม 1, ลด %, รหัสคูปอง
    - Set rules (minimum purchase, specific products/categories)
    - Active/schedule promotions

18. **Reports** (`app/(admin)/reports/page.tsx`)
    - Sales report (date range, filter by product/category)
    - Excel export ยอดขาย/รายได้ (ExcelJS)
    - Low performing products
    - Warehouse activity logs (visible to accountant role)

19. **Blog/Content management** (`app/(admin)/blog/page.tsx`)
    - Create/edit blog posts (TH/EN content fields)
    - Rich text editor (Tiptap or similar)
    - Image upload for blog

20. **Settings** (`app/(admin)/settings/page.tsx`)
    - User management (add staff, assign roles)
    - PromptPay settings (account number)
    - Warehouse management
    - Line Notify token config

### Phase 4: Integrations & Notifications

21. **Email notifications** (`lib/email.ts`)
    - Resend API integration
    - Templates: order confirmation, payment verified, shipping notification
    - i18n email content

22. **Line Notify integration** (`lib/line-notify.ts`)
    - Send to admin when new order created
    - Send to customer when order status changes (optional)
    - Payment verified notification

23. **i18n implementation**
    - i18next setup (`i18n/config.ts`)
    - Translation files: `th.json`, `en.json`
    - Server-side + client-side translations
    - Language detection from URL (`/th/products`, `/en/products`)

### Phase 5: Production Preparation

24. **Database migration to production**
    - Setup Neon or Supabase PostgreSQL
    - Prisma migrate deploy
    - Data migration scripts (if needed)

25. **Environment configs**
    - `.env.local` (dev) vs `.env.production`
    - PromptPay account, Uploadthing keys, Resend API, Line token

26. **Performance optimization**
    - Image optimization (Next.js Image, Uploadthing CDN)
    - Server component optimization
    - DB query optimization (Prisma includes/selects)
    - Caching strategies (React cache, unstable_cache)

27. **SEO optimization**
    - Metadata generation for product pages
    - Sitemap generation (`app/sitemap.ts`)
    - robots.txt
    - Open Graph images

28. **Testing**
    - E2E tests (Playwright) สำหรับ checkout flow
    - Admin payment verification flow
    - Promotion calculation logic
    - Excel import validation

29. **Deployment**
    - Vercel deployment with PostgreSQL connection
    - Environment variables setup
    - Domain setup
    - SSL/HTTPS

---

## Verification

**Development Testing:**
1. สร้าง product พร้อม variants (3 สี, 4 ไซส์) → verify ราคา/stock แต่ละ variant
2. Import products ผ่าน Excel → ตรวจสอบข้อมูลใน DB
3. Add to cart → apply promotion "ซื้อ 3 แถม 1" → verify ราคาถูกต้อง
4. Checkout → generate PromptPay QR → upload slip → admin verify → order status update
5. Export ยอดขาย Excel → verify data correctness
6. Test multi-warehouse inventory (ย้ายสต๊อคระหว่างสาขา)
7. Switch language TH/EN → verify translations
8. Test Line Notify, Email notifications

**Production Checklist:**
- [ ] SQLite → PostgreSQL migration successful
- [ ] All environment variables configured
- [ ] PromptPay QR generates correctly with production account
- [ ] Email sending works (Resend production API)
- [ ] Image uploads to production storage
- [ ] Admin roles/permissions working
- [ ] Performance: Lighthouse score > 90
- [ ] Mobile responsive all pages
- [ ] Load test: simulate 50 concurrent users

---

## Decisions

**Payment:** Manual verification (ลูกค้าอัพโหลดสลิป → admin ยืนยัน) instead of automated payment gateway - ประหยัดค่าธรรมเนียม, ยืดหยุ่นกว่า

**Database:** Neon PostgreSQL for production - serverless, auto-scaling, เหมาะกับ Vercel, มี free tier ที่ใช้ได้จริง

**Admin UI:** Custom build with shadcn/ui แทน React Admin - ควบคุม UX ได้เต็มที่, match brand identity, lightweight กว่า

**Image hosting:** Uploadthing - เชื่อมต่อ Next.js ง่าย, transformation built-in, cost-effective สำหรับ scale นี้

**Multi-language:** i18next - industry standard, support Server Components, flexible

**Promotion engine:** Custom logic แทน third-party - ยืดหยุ่นสำหรับ rules แบบ "ซื้อ 3 แถม 1", ไม่มีค่าใช้จ่าย

**Warehouse management:** Built-in แทน external WMS - scale ของธุรกิจยังไม่ซับซ้อนมาก, สามารถควบคุมได้ทั้งหมด
