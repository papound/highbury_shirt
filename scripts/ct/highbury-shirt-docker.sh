#!/usr/bin/env bash
source <(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/misc/build.func)
# Copyright (c) 2021-2026 tteck
# Author: papound
# License: MIT | https://github.com/community-scripts/ProxmoxVE/raw/main/LICENSE
# Source: https://github.com/papound/highbury_shirt
#
# Approach: Docker Stack (Next.js + PostgreSQL ใน containers)
# ใช้ script นี้แทน highbury-shirt.sh ถ้าต้องการ Docker approach

APP="Highbury-Shirt"
var_tags="${var_tags:-nextjs;ecommerce;docker}"
var_cpu="${var_cpu:-2}"
var_ram="${var_ram:-2048}"  # Docker ต้องการ RAM มากกว่า bare-metal เล็กน้อย
var_disk="${var_disk:-12}"   # เผื่อ Docker images (~4-5 GB)
var_os="${var_os:-debian}"
var_version="${var_version:-12}"
var_unprivileged="${var_unprivileged:-0}"  # Docker ต้องการ privileged
var_features="${var_features:-nesting=1}"  # เปิด nesting ก่อน build เพื่อให้ Docker ใช้ได้ทันที
var_dns="${var_dns:-8.8.8.8}"             # กำหนด DNS ตายตัว ไม่ต้องรอ inject

DOCKER_INSTALL_URL="https://raw.githubusercontent.com/papound/highbury_shirt/main/scripts/install/highbury-shirt-docker.sh"

header_info "$APP"
color
variables
base_settings
catch_errors

function update_script() {
  header_info
  check_container_storage
  check_container_resources

  if [[ ! -d /opt/highbury-shirt ]]; then
    msg_error "No ${APP} Installation Found!"
    exit
  fi

  msg_info "Updating ${APP} Docker Stack"
  cd /opt/highbury-shirt
  git pull
  docker compose build --progress=plain
  docker compose up -d
  msg_ok "Updated ${APP} successfully!"
  exit
}

start
build_container
description

# ดาวน์โหลด installer ลง Proxmox host ก่อน แล้ว push เข้า LXC
# (วิธีนี้ reliable กว่า curl|pct exec bash -s สำหรับ long-running script)
msg_info "Downloading ${APP} Docker installer"
INSTALL_TMP=$(mktemp /tmp/highbury-shirt-docker-XXXXXX.sh)
curl -fsSL "${DOCKER_INSTALL_URL}" -o "${INSTALL_TMP}"
msg_ok "Downloaded installer"

msg_info "Pushing installer into LXC ${CTID}"
pct push "$CTID" "${INSTALL_TMP}" /root/install.sh
pct exec "$CTID" -- chmod +x /root/install.sh
rm -f "${INSTALL_TMP}"
msg_ok "Installer ready"

msg_info "Running ${APP} Docker installer inside LXC ${CTID}"
pct exec "$CTID" -- bash /root/install.sh
msg_ok "Installer completed"

msg_ok "Completed successfully!\n"
echo -e "${CREATING}${GN}${APP} (Docker) setup has been successfully initialized!${CL}"
echo -e "${INFO}${YW} Access it using the following URL:${CL}"
echo -e "${TAB}${GATEWAY}${BGN}http://${IP}${CL}"
echo -e "${INFO}${YW} App files located at:${CL}"
echo -e "${TAB}${BGN}/opt/highbury-shirt${CL}"
echo -e "${INFO}${YW} Edit env config at:${CL}"
echo -e "${TAB}${BGN}/opt/highbury-shirt/.env${CL}"
echo -e "${INFO}${YW} Docker commands (inside LXC):${CL}"
echo -e "${TAB}${BGN}cd /opt/highbury-shirt && docker compose logs -f app${CL}"
