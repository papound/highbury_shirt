# =============================================================================
# Highbury Shirt — Multi-stage Dockerfile
# =============================================================================
# Stage 1: deps   — ติดตั้ง dependencies
# Stage 2: builder — patch schema, build Next.js
# Stage 3: runner  — runtime image เบาๆ
# =============================================================================

# ---- Stage 1: deps ----
FROM node:20-alpine AS deps
WORKDIR /app

# ติดตั้ง openssl สำหรับ Prisma
RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json* ./
RUN npm install


# ---- Stage 2: builder ----
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Patch Prisma schema: sqlite → postgresql และลบ url line (Prisma 7)
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma && \
    sed -i '/^\s*url\s*=\s*env(/d' prisma/schema.prisma

# Build args สำหรับ prisma generate ที่ต้องการ DATABASE_URL
# ค่าจริงจะถูกส่งผ่าน env ตอน runtime, ตรงนี้ใช้ placeholder สำหรับ generate เท่านั้น
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build


# ---- Stage 3: runner ----
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# copy ไฟล์ที่จำเป็นสำหรับ runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["npm", "start"]
