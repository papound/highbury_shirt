#!/usr/bin/env bash
# =============================================================================
# Highbury Shirt — Standalone LXC Installer
# =============================================================================
# Copyright (c) 2021-2026 tteck | Author: papound | License: MIT
# Source: https://github.com/papound/highbury_shirt
#
# วิธีใช้งาน (รันบน LXC Debian 12 ด้วย root):
#   bash <(curl -fsSL https://raw.githubusercontent.com/papound/highbury_shirt/main/scripts/install/highbury-shirt-standalone.sh)
#
# หรือ copy ไฟล์นี้ขึ้น LXC แล้วรัน:
#   chmod +x highbury-shirt-standalone.sh && ./highbury-shirt-standalone.sh
# =============================================================================

set -euo pipefail

APP="Highbury-Shirt"
APP_DIR="/opt/highbury-shirt"
REPO_URL="https://github.com/papound/highbury_shirt"
SERVICE_NAME="highbury-shirt"
DB_USER="highbury"
DB_NAME="highbury_db"

# --------------------------------------------------------------------------- #
# สีสำหรับ output (ใช้แทน msg_info / msg_ok / msg_error ของ ProxmoxVE)
# --------------------------------------------------------------------------- #
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

msg_info()  { echo -e "  ${CYAN}[..] $1${RESET}"; }
msg_ok()    { echo -e "  ${GREEN}[OK] $1${RESET}"; }
msg_error() { echo -e "  ${RED}[ERR] $1${RESET}" >&2; exit 1; }
msg_warn()  { echo -e "  ${YELLOW}[!!] $1${RESET}"; }

# --------------------------------------------------------------------------- #
# ตรวจสอบว่ารันด้วย root
# --------------------------------------------------------------------------- #
if [[ $EUID -ne 0 ]]; then
  msg_error "Script นี้ต้องรันด้วย root (sudo su - หรือ sudo bash ...)"
fi

# --------------------------------------------------------------------------- #
# ฟังก์ชัน: update (รัน script อีกครั้งเมื่อต้องการ update)
# --------------------------------------------------------------------------- #
if [[ "${1:-}" == "update" ]]; then
  if [[ ! -d "$APP_DIR" ]]; then
    msg_error "ไม่พบ ${APP} installation ที่ ${APP_DIR}"
  fi

  msg_info "Stopping ${APP} service"
  systemctl stop "$SERVICE_NAME"
  msg_ok "Stopped"

  msg_info "Pulling latest code"
  cd "$APP_DIR"
  git pull
  msg_ok "Pulled latest code"

  msg_info "Installing dependencies"
  npm install
  msg_ok "Dependencies installed"

  msg_info "Patching Prisma schema for PostgreSQL"
  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
  sed -i '/^\s*url\s*=\s*env(/d' prisma/schema.prisma
  msg_ok "Schema patched"

  msg_info "Syncing database schema"
  npx prisma db push
  msg_ok "Schema synced"

  msg_info "Building application"
  npm run build
  msg_ok "Build complete"

  msg_info "Starting ${APP} service"
  systemctl start "$SERVICE_NAME"
  msg_ok "Started"

  msg_ok "${APP} updated successfully!"
  exit 0
fi

# =========================================================================== #
# INSTALL
# =========================================================================== #

echo -e "\n${GREEN}========================================${RESET}"
echo -e "${GREEN}  Installing ${APP}${RESET}"
echo -e "${GREEN}========================================${RESET}\n"

# --------------------------------------------------------------------------- #
# 1. อัปเดต OS และติดตั้ง dependencies พื้นฐาน
# --------------------------------------------------------------------------- #
msg_info "Updating OS package lists"
apt-get update -y >/dev/null
msg_ok "Package lists updated"

msg_info "Installing base dependencies (curl, git, nginx)"
apt-get install -y curl git nginx >/dev/null
msg_ok "Base dependencies installed"

# --------------------------------------------------------------------------- #
# 2. ติดตั้ง Node.js 20
# --------------------------------------------------------------------------- #
msg_info "Installing Node.js 20"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null
apt-get install -y nodejs >/dev/null
msg_ok "Node.js $(node -v) installed"

# --------------------------------------------------------------------------- #
# 3. ติดตั้ง PostgreSQL
# --------------------------------------------------------------------------- #
msg_info "Installing PostgreSQL"
apt-get install -y postgresql postgresql-contrib >/dev/null
systemctl enable --now postgresql
msg_ok "PostgreSQL installed and running"

# --------------------------------------------------------------------------- #
# 4. สร้าง database user และ database
# --------------------------------------------------------------------------- #
msg_info "Creating PostgreSQL user and database"
DB_PASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" 2>/dev/null || \
  msg_warn "User '${DB_USER}' อาจมีอยู่แล้ว"
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" 2>/dev/null || \
  msg_warn "Database '${DB_NAME}' อาจมีอยู่แล้ว"
msg_ok "Database '${DB_NAME}' ready (user: ${DB_USER})"

# --------------------------------------------------------------------------- #
# 5. Clone repository
# --------------------------------------------------------------------------- #
msg_info "Cloning ${APP} from ${REPO_URL}"
mkdir -p "$APP_DIR"
git clone "$REPO_URL" "$APP_DIR"
msg_ok "Repository cloned to ${APP_DIR}"

# --------------------------------------------------------------------------- #
# 6. สร้างไฟล์ .env.local
#    — รับ IP จาก hostname -I (เอา field แรก)
# --------------------------------------------------------------------------- #
SERVER_IP=$(hostname -I | awk '{print $1}')

msg_info "Creating .env.local"
cat > "${APP_DIR}/.env.local" <<EOF
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://${SERVER_IP}"
NEXT_PUBLIC_APP_URL="http://${SERVER_IP}"
UPLOADTHING_TOKEN="CHANGE_ME"
LINE_NOTIFY_TOKEN="CHANGE_ME"
EOF
chmod 600 "${APP_DIR}/.env.local"
msg_ok ".env.local created"

# --------------------------------------------------------------------------- #
# 7. ติดตั้ง Node.js dependencies
# --------------------------------------------------------------------------- #
msg_info "Installing Node.js dependencies (npm install)"
cd "$APP_DIR"
npm install
msg_ok "Node dependencies installed"

# --------------------------------------------------------------------------- #
# 8. Patch Prisma schema จาก sqlite → postgresql
#    (repo เก็บ schema เป็น sqlite สำหรับ local dev)
# --------------------------------------------------------------------------- #
msg_info "Patching Prisma schema for PostgreSQL"
# เปลี่ยน provider sqlite → postgresql
sed -i 's/provider = "sqlite"/provider = "postgresql"/' "${APP_DIR}/prisma/schema.prisma"
# Prisma 7: ลบ url = env(...) ออกจาก datasource block (ย้ายไปอยู่ใน prisma.config.ts แล้ว)
sed -i '/^\s*url\s*=\s*env(/d' "${APP_DIR}/prisma/schema.prisma"
msg_ok "Schema patched"

# --------------------------------------------------------------------------- #
# 9. Generate Prisma client และ push schema
# --------------------------------------------------------------------------- #
msg_info "Generating Prisma client"
set -a; source "${APP_DIR}/.env.local"; set +a
npx prisma generate
msg_ok "Prisma client generated"

msg_info "Pushing schema to database"
npx prisma db push
msg_ok "Schema pushed"

# --------------------------------------------------------------------------- #
# 10. Seed database (โหลดข้อมูลเริ่มต้น)
# --------------------------------------------------------------------------- #
msg_info "Seeding database (seed-data.json ~3MB, อาจใช้เวลา 2-5 นาที)"
set -a; source "${APP_DIR}/.env.local"; set +a
# เพิ่ม --max-old-space-size=512 เพื่อป้องกัน OOM บน RAM 1GB
# ไม่ suppress output เพื่อให้เห็น error ถ้าค้าง
NODE_OPTIONS="--max-old-space-size=512" npx tsx prisma/seed.ts
msg_ok "Database seeded"

# --------------------------------------------------------------------------- #
# 11. Build Next.js application
# --------------------------------------------------------------------------- #
msg_info "Building Next.js application (อาจใช้เวลา 2-5 นาที)"
NODE_OPTIONS="--max-old-space-size=1536" npm run build
msg_ok "Build complete"

# --------------------------------------------------------------------------- #
# 12. สร้าง systemd service
# --------------------------------------------------------------------------- #
msg_info "Creating systemd service"
cat > /etc/systemd/system/${SERVICE_NAME}.service <<SVCEOF
[Unit]
Description=Highbury Shirt Next.js Application
Documentation=${REPO_URL}
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=${APP_DIR}
EnvironmentFile=${APP_DIR}/.env.local
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${SERVICE_NAME}

[Install]
WantedBy=multi-user.target
SVCEOF
systemctl daemon-reload
systemctl enable --now "$SERVICE_NAME"
msg_ok "Service '${SERVICE_NAME}' created and running"

# --------------------------------------------------------------------------- #
# 13. ตั้งค่า Nginx เป็น reverse proxy
# --------------------------------------------------------------------------- #
msg_info "Configuring Nginx reverse proxy"
cat > /etc/nginx/sites-available/${SERVICE_NAME} <<'NGXEOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
NGXEOF
ln -sf /etc/nginx/sites-available/${SERVICE_NAME} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
msg_ok "Nginx configured"

# --------------------------------------------------------------------------- #
# 14. Cleanup
# --------------------------------------------------------------------------- #
msg_info "Cleaning up"
apt-get autoremove -y >/dev/null
apt-get autoclean >/dev/null
msg_ok "Cleaned up"

# --------------------------------------------------------------------------- #
# สรุปผลการติดตั้ง
# --------------------------------------------------------------------------- #
echo -e "\n${GREEN}========================================${RESET}"
echo -e "${GREEN}  ${APP} installed successfully!${RESET}"
echo -e "${GREEN}========================================${RESET}"
echo -e "  URL:         ${CYAN}http://${SERVER_IP}${RESET}"
echo -e "  App dir:     ${APP_DIR}"
echo -e "  Env config:  ${APP_DIR}/.env.local"
echo -e "  DB user:     ${DB_USER}"
echo -e "  DB name:     ${DB_NAME}"
echo -e "${YELLOW}  DB password: ${DB_PASS}  ← บันทึกไว้ด้วย!${RESET}"
echo -e ""
echo -e "  ${YELLOW}อย่าลืมแก้ไขค่าเหล่านี้ใน .env.local:${RESET}"
echo -e "    UPLOADTHING_TOKEN=..."
echo -e "    LINE_NOTIFY_TOKEN=..."
echo -e ""
echo -e "  To update in future: ${CYAN}bash $0 update${RESET}"
echo -e ""
