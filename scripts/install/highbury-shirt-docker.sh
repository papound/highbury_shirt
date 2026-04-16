#!/usr/bin/env bash
# =============================================================================
# Highbury Shirt — Docker Stack Installer (Standalone LXC)
# =============================================================================
# Copyright (c) 2021-2026 tteck | Author: papound | License: MIT
# Source: https://github.com/papound/highbury_shirt
#
# วิธีใช้งาน (รันบน LXC Ubuntu 22.04 ด้วย root):
#   bash <(curl -fsSL https://raw.githubusercontent.com/papound/highbury_shirt/main/scripts/install/highbury-shirt-docker.sh)
# =============================================================================

set -euo pipefail

APP="Highbury-Shirt"
APP_DIR="/opt/highbury-shirt"
REPO_URL="https://github.com/papound/highbury_shirt"
DB_USER="highbury"
DB_NAME="highbury_db"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

msg_info()  { echo -e "  ${CYAN}[..] $1${RESET}"; }
msg_ok()    { echo -e "  ${GREEN}[OK] $1${RESET}"; }
msg_error() { echo -e "  ${RED}[ERR] $1${RESET}" >&2; exit 1; }
msg_warn()  { echo -e "  ${YELLOW}[!!] $1${RESET}"; }

if [[ $EUID -ne 0 ]]; then
  msg_error "Script นี้ต้องรันด้วย root"
fi

# --------------------------------------------------------------------------- #
# update mode: pull code แล้ว rebuild image
# --------------------------------------------------------------------------- #
if [[ "${1:-}" == "update" ]]; then
  if [[ ! -d "$APP_DIR" ]]; then
    msg_error "ไม่พบ ${APP} installation ที่ ${APP_DIR}"
  fi

  msg_info "Pulling latest code"
  cd "$APP_DIR"
  git pull
  msg_ok "Pulled latest code"

  msg_info "Rebuilding and restarting Docker stack"
  docker compose up -d --build
  msg_ok "Stack updated"

  msg_ok "${APP} updated successfully!"
  exit 0
fi

# =========================================================================== #
# INSTALL
# =========================================================================== #

echo -e "\n${GREEN}========================================${RESET}"
echo -e "${GREEN}  Installing ${APP} (Docker Stack)${RESET}"
echo -e "${GREEN}========================================${RESET}\n"

# --------------------------------------------------------------------------- #
# 1. อัปเดต OS
# --------------------------------------------------------------------------- #
msg_info "Updating OS package lists"
apt-get update -y >/dev/null
msg_ok "Package lists updated"

msg_info "Installing prerequisites"
apt-get install -y curl git ca-certificates gnupg >/dev/null
msg_ok "Prerequisites installed"

# --------------------------------------------------------------------------- #
# 2. ติดตั้ง Docker Engine
# --------------------------------------------------------------------------- #
msg_info "Installing Docker Engine"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg >/dev/null
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y >/dev/null
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin >/dev/null
systemctl enable --now docker
msg_ok "Docker $(docker --version | awk '{print $3}' | tr -d ',') installed"

# --------------------------------------------------------------------------- #
# 3. Clone repository
# --------------------------------------------------------------------------- #
msg_info "Cloning ${APP} from ${REPO_URL}"
mkdir -p "$APP_DIR"
git clone "$REPO_URL" "$APP_DIR"
msg_ok "Repository cloned to ${APP_DIR}"

# --------------------------------------------------------------------------- #
# 4. สร้างไฟล์ .env
# --------------------------------------------------------------------------- #
SERVER_IP=$(hostname -I | awk '{print $1}')
DB_PASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)
AUTH_SECRET=$(openssl rand -base64 32)

msg_info "Creating .env"
cat > "${APP_DIR}/.env" <<EOF
DB_USER=${DB_USER}
DB_NAME=${DB_NAME}
DB_PASS=${DB_PASS}
AUTH_SECRET=${AUTH_SECRET}
NEXTAUTH_URL=http://${SERVER_IP}
NEXT_PUBLIC_APP_URL=http://${SERVER_IP}
UPLOADTHING_TOKEN=CHANGE_ME
LINE_NOTIFY_TOKEN=CHANGE_ME
EOF
chmod 600 "${APP_DIR}/.env"
msg_ok ".env created"

# --------------------------------------------------------------------------- #
# 5. Build และ Start Docker stack
#    — ครั้งแรกจะใช้เวลานาน (build Next.js image)
# --------------------------------------------------------------------------- #
msg_info "Building Docker images and starting stack (อาจใช้เวลา 5-10 นาที)"
cd "$APP_DIR"
docker compose up -d --build
msg_ok "Docker stack started"

# --------------------------------------------------------------------------- #
# 6. รัน Prisma db push และ seed หลัง db พร้อม
# --------------------------------------------------------------------------- #
msg_info "Waiting for database to be ready"
sleep 5

msg_info "Running Prisma db push"
docker compose exec -T app sh -c "cd /app && npx prisma db push" >/dev/null
msg_ok "Schema pushed"

msg_info "Seeding database"
docker compose exec -T app sh -c "cd /app && npx tsx prisma/seed.ts" >/dev/null
msg_ok "Database seeded"

# --------------------------------------------------------------------------- #
# 7. ตั้งค่า Nginx reverse proxy
# --------------------------------------------------------------------------- #
msg_info "Installing and configuring Nginx"
apt-get install -y nginx >/dev/null

cat > /etc/nginx/sites-available/highbury-shirt <<'NGXEOF'
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
ln -sf /etc/nginx/sites-available/highbury-shirt /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
msg_ok "Nginx configured"

# --------------------------------------------------------------------------- #
# 8. Cleanup
# --------------------------------------------------------------------------- #
msg_info "Cleaning up"
apt-get autoremove -y >/dev/null
apt-get autoclean >/dev/null
msg_ok "Cleaned up"

# --------------------------------------------------------------------------- #
echo -e "\n${GREEN}========================================${RESET}"
echo -e "${GREEN}  ${APP} (Docker) installed successfully!${RESET}"
echo -e "${GREEN}========================================${RESET}"
echo -e "  URL:            ${CYAN}http://${SERVER_IP}${RESET}"
echo -e "  App dir:        ${APP_DIR}"
echo -e "  Env config:     ${APP_DIR}/.env"
echo -e "  DB user:        ${DB_USER}"
echo -e "  DB name:        ${DB_NAME}"
echo -e "${YELLOW}  DB password:    ${DB_PASS}  ← บันทึกไว้ด้วย!${RESET}"
echo -e ""
echo -e "  ${YELLOW}อย่าลืมแก้ไขค่าเหล่านี้ใน .env:${RESET}"
echo -e "    UPLOADTHING_TOKEN=..."
echo -e "    LINE_NOTIFY_TOKEN=..."
echo -e ""
echo -e "  Docker commands:"
echo -e "    ${CYAN}cd ${APP_DIR} && docker compose logs -f app${RESET}  ← ดู logs"
echo -e "    ${CYAN}cd ${APP_DIR} && docker compose ps${RESET}           ← ดู status"
echo -e "  To update: ${CYAN}bash $0 update${RESET}"
echo -e ""
