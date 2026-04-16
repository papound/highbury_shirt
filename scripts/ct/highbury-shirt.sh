#!/usr/bin/env bash
source <(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/misc/build.func)
# Copyright (c) 2021-2026 tteck
# Author: papound
# License: MIT | https://github.com/community-scripts/ProxmoxVE/raw/main/LICENSE
# Source: https://github.com/papound/highbury_shirt

APP="Highbury-Shirt"
var_tags="${var_tags:-nextjs;ecommerce}"
var_cpu="${var_cpu:-2}"
var_ram="${var_ram:-2048}"  # 2GB: เพียงพอสำหรับ seed + npm build
var_disk="${var_disk:-8}"
var_os="${var_os:-ubuntu}"
var_version="${var_version:-22.04}"
var_unprivileged="${var_unprivileged:-1}"
var_dns="${var_dns:-8.8.8.8}"             # กำหนด DNS ตายตัว ไม่ต้องรอ inject

STANDALONE_INSTALL_URL="https://raw.githubusercontent.com/papound/highbury_shirt/main/scripts/install/highbury-shirt-standalone.sh"

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

  msg_info "Stopping ${APP} Service"
  systemctl stop highbury-shirt
  msg_ok "Stopped ${APP} Service"

  msg_info "Updating ${APP}"
  cd /opt/highbury-shirt
  $STD git pull
  msg_ok "Pulled Latest Code"

  msg_info "Installing Dependencies"
  $STD npm ci
  msg_ok "Installed Dependencies"

  msg_info "Patching schema for PostgreSQL"
  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
  msg_ok "Patched schema"

  msg_info "Syncing Database Schema"
  $STD npx prisma db push
  msg_ok "Database Schema Synced"

  msg_info "Building ${APP}"
  $STD npm run build
  msg_ok "Built ${APP}"

  msg_info "Starting ${APP} Service"
  systemctl start highbury-shirt
  msg_ok "Started ${APP} Service"

  msg_ok "Updated ${APP} successfully!"
  exit
}

start
build_container
description

# ดาวน์โหลด installer ลง Proxmox host ก่อน แล้ว push เข้า LXC
msg_info "Downloading ${APP} standalone installer"
INSTALL_TMP=$(mktemp /tmp/highbury-shirt-XXXXXX.sh)
curl -fsSL "${STANDALONE_INSTALL_URL}" -o "${INSTALL_TMP}"
msg_ok "Downloaded installer"

msg_info "Pushing installer into LXC ${CTID}"
pct push "$CTID" "${INSTALL_TMP}" /root/install.sh
pct exec "$CTID" -- chmod +x /root/install.sh
rm -f "${INSTALL_TMP}"
msg_ok "Installer ready"

msg_info "Running ${APP} standalone installer inside LXC ${CTID}"
pct exec "$CTID" -- bash /root/install.sh
msg_ok "Installer completed"

msg_ok "Completed successfully!\n"
echo -e "${CREATING}${GN}${APP} setup has been successfully initialized!${CL}"
echo -e "${INFO}${YW} Access it using the following URL:${CL}"
echo -e "${TAB}${GATEWAY}${BGN}http://${IP}${CL}"
echo -e "${INFO}${YW} App files located at:${CL}"
echo -e "${TAB}${BGN}/opt/highbury-shirt${CL}"
echo -e "${INFO}${YW} Edit env config at:${CL}"
echo -e "${TAB}${BGN}/opt/highbury-shirt/.env.local${CL}"
