#!/usr/bin/env bash

# Copyright (c) 2021-2026 tteck
# Author: papound
# License: MIT | https://github.com/community-scripts/ProxmoxVE/raw/main/LICENSE
# Source: https://github.com/papound/highbury_shirt

source /dev/stdin <<< "$FUNCTIONS_FILE_PATH"
color
verb_ip6
catch_errors
setting_up_container
network_check
update_os

msg_info "Installing Dependencies"
$STD apt-get install -y \
  curl \
  git \
  nginx
msg_ok "Installed Dependencies"

msg_info "Installing Node.js 20"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &>/dev/null
$STD apt-get install -y nodejs
msg_ok "Installed Node.js $(node -v)"

msg_info "Cloning Highbury Shirt"
mkdir -p /opt/highbury-shirt
cd /opt/highbury-shirt
$STD git clone https://github.com/papound/highbury_shirt .
msg_ok "Cloned Repository"

msg_info "Installing Node Dependencies"
$STD npm ci
msg_ok "Installed Node Dependencies"

msg_info "Building Application"
$STD npm run build
msg_ok "Built Application"

msg_info "Creating .env.local"
if [[ -f /opt/highbury-shirt/.env.example ]]; then
  cp /opt/highbury-shirt/.env.example /opt/highbury-shirt/.env.local
fi
# Ensure .env.local exists even if no example
touch /opt/highbury-shirt/.env.local
msg_ok "Created .env.local"

msg_info "Creating Service"
cat <<EOF >/etc/systemd/system/highbury-shirt.service
[Unit]
Description=Highbury Shirt Next.js Application
Documentation=https://github.com/papound/highbury_shirt
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/highbury-shirt
EnvironmentFile=-/opt/highbury-shirt/.env.local
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=highbury-shirt

[Install]
WantedBy=multi-user.target
EOF
systemctl enable -q --now highbury-shirt
msg_ok "Created Service"

msg_info "Configuring Nginx"
cat <<EOF >/etc/nginx/sites-available/highbury-shirt
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }
}
EOF
ln -sf /etc/nginx/sites-available/highbury-shirt /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
$STD nginx -t
systemctl reload nginx
msg_ok "Configured Nginx"

motd_ssh
customize
cleanup_lxc
