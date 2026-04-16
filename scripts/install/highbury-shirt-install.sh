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

msg_info "Installing PostgreSQL"
$STD apt-get install -y postgresql postgresql-contrib
systemctl enable --now postgresql
msg_ok "Installed PostgreSQL"

msg_info "Creating Database and User"
DB_PASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)
sudo -u postgres psql -c "CREATE USER highbury WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -c "CREATE DATABASE highbury_db OWNER highbury;"
msg_ok "Created Database 'highbury_db' with user 'highbury'"

msg_info "Cloning Highbury Shirt"
mkdir -p /opt/highbury-shirt
cd /opt/highbury-shirt
$STD git clone https://github.com/papound/highbury_shirt .
msg_ok "Cloned Repository"

msg_info "Creating .env.local"
cat > /opt/highbury-shirt/.env.local <<EOF
DATABASE_URL="postgresql://highbury:${DB_PASS}@localhost:5432/highbury_db"
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://$(hostname -I | awk '{print $1}')"
NEXT_PUBLIC_APP_URL="http://$(hostname -I | awk '{print $1}')"
UPLOADTHING_TOKEN="CHANGE_ME"
LINE_NOTIFY_TOKEN="CHANGE_ME"
EOF
chmod 600 /opt/highbury-shirt/.env.local
msg_ok "Created .env.local"

msg_info "Installing Node Dependencies"
$STD npm ci
msg_ok "Installed Node Dependencies"

msg_info "Running Prisma Migrations"
$STD npx prisma migrate deploy
msg_ok "Database Migrated"

msg_info "Seeding Database"
$STD npx prisma db seed
msg_ok "Database Seeded"

msg_info "Building Application"
$STD npm run build
msg_ok "Built Application"

msg_info "Creating Service"
cat > /etc/systemd/system/highbury-shirt.service <<'SVCEOF'
[Unit]
Description=Highbury Shirt Next.js Application
Documentation=https://github.com/papound/highbury_shirt
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/highbury-shirt
EnvironmentFile=/opt/highbury-shirt/.env.local
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=highbury-shirt

[Install]
WantedBy=multi-user.target
SVCEOF
systemctl enable -q --now highbury-shirt
msg_ok "Created Service"

msg_info "Configuring Nginx"
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
$STD nginx -t && systemctl reload nginx
msg_ok "Configured Nginx"

motd_ssh
customize

msg_info "Cleaning up"
$STD apt-get autoremove -y
$STD apt-get autoclean
msg_ok "Cleaned"

msg_ok "\n${APP} is ready!"
echo -e "  DB User:     highbury"
echo -e "  DB Name:     highbury_db"
echo -e "  DB Password: ${DB_PASS}  ← save this!"
echo -e "  Edit env:    /opt/highbury-shirt/.env.local"
