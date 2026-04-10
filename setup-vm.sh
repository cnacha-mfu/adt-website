#!/usr/bin/env bash
# =============================================================================
# ADT Website — VM Setup Script
# Tested on: Ubuntu 22.04 / 24.04 (Google Compute Engine)
#
# Usage:
#   chmod +x setup-vm.sh
#   ./setup-vm.sh
#
# What it does:
#   1. Installs Docker Engine + Docker Compose plugin
#   2. Clones the repo (or pulls latest if already cloned)
#   3. Prompts for POSTGRES_PASSWORD and writes .env
#   4. Builds images and starts containers
#   5. Prints the URL to access the site
# =============================================================================

set -euo pipefail

REPO_URL="https://github.com/cnacha-mfu/adt-website.git"
APP_DIR="/opt/adt-website"
APP_USER="$(whoami)"

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'
info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; exit 1; }

echo -e "${BOLD}"
echo "╔════════════════════════════════════════════╗"
echo "║   ADT Website — VM Setup                  ║"
echo "║   School of Applied Digital Technology    ║"
echo "║   Mae Fah Luang University                ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${RESET}"

# ── 1. Verify OS ──────────────────────────────────────────────────────────────
if ! grep -qi "ubuntu\|debian" /etc/os-release 2>/dev/null; then
  warn "This script targets Ubuntu/Debian. Proceed with caution on other distros."
fi

# ── 2. System packages ────────────────────────────────────────────────────────
info "Updating package lists..."
sudo apt-get update -qq

info "Installing prerequisites..."
sudo apt-get install -y -qq \
  ca-certificates curl gnupg git lsb-release

# ── 3. Docker Engine (skip if already installed) ──────────────────────────────
if command -v docker &>/dev/null; then
  success "Docker already installed: $(docker --version)"
else
  info "Installing Docker Engine..."

  # Add Docker's official GPG key
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg

  # Add Docker apt repository
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  sudo apt-get update -qq
  sudo apt-get install -y -qq \
    docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin

  # Start and enable Docker
  sudo systemctl enable --now docker
  success "Docker installed: $(docker --version)"
fi

# Add current user to docker group (takes effect on next login; we use sudo below)
if ! groups "$APP_USER" | grep -q docker; then
  info "Adding $APP_USER to docker group..."
  sudo usermod -aG docker "$APP_USER"
  warn "You will need to log out and back in for Docker group access without sudo."
fi

# ── 4. Clone or update repo ───────────────────────────────────────────────────
if [[ -d "$APP_DIR/.git" ]]; then
  info "Repo already exists at $APP_DIR — pulling latest..."
  sudo git -C "$APP_DIR" pull origin master
else
  info "Cloning repo to $APP_DIR..."
  sudo git clone "$REPO_URL" "$APP_DIR"
  sudo chown -R "$APP_USER":"$APP_USER" "$APP_DIR"
fi

cd "$APP_DIR"

# ── 5. Configure .env ─────────────────────────────────────────────────────────
if [[ -f .env ]]; then
  warn ".env already exists — skipping password prompt."
  warn "Edit $APP_DIR/.env manually if you need to change the password."
else
  echo ""
  echo -e "${BOLD}Database password setup${RESET}"
  echo "This password protects your PostgreSQL database."
  echo "Use a strong random password in production."
  echo ""

  while true; do
    read -rsp "  Enter POSTGRES_PASSWORD: " PG_PASS; echo
    read -rsp "  Confirm POSTGRES_PASSWORD: " PG_PASS2; echo
    [[ "$PG_PASS" == "$PG_PASS2" ]] && break
    warn "Passwords do not match. Try again."
  done

  if [[ -z "$PG_PASS" ]]; then
    warn "Empty password entered — using default 'changeme'. CHANGE THIS for production!"
    PG_PASS="changeme"
  fi

  cat > .env <<EOF
# ADT Website environment
POSTGRES_PASSWORD=${PG_PASS}
EOF
  chmod 600 .env
  success ".env written."
fi

# ── 6. Open firewall port 8080 (ufw, if active) ───────────────────────────────
if command -v ufw &>/dev/null && sudo ufw status | grep -q "Status: active"; then
  info "Opening port 8080 in ufw..."
  sudo ufw allow 8080/tcp
  success "Port 8080 open in ufw."
else
  warn "ufw not active. If using GCP firewall, make sure port 8080 is allowed."
  warn "Run: gcloud compute firewall-rules create adt-allow-8080 \\"
  warn "       --allow tcp:8080 --target-tags adt-server"
fi

# ── 7. Build & start containers ───────────────────────────────────────────────
info "Building Docker images (this takes a few minutes on first run)..."
sudo docker compose build

info "Starting containers..."
sudo docker compose up -d

# ── 8. Wait for health ────────────────────────────────────────────────────────
info "Waiting for app to be healthy..."
ATTEMPTS=0
MAX=30
until sudo docker compose ps app | grep -q "healthy\|(running)" || [[ $ATTEMPTS -ge $MAX ]]; do
  ATTEMPTS=$((ATTEMPTS + 1))
  sleep 3
done

if [[ $ATTEMPTS -ge $MAX ]]; then
  warn "App may still be starting. Check logs with: docker compose -f $APP_DIR/docker-compose.yml logs -f"
fi

# ── 9. Print summary ──────────────────────────────────────────────────────────
EXTERNAL_IP=$(curl -sf --max-time 3 "http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/externalIp" -H "Metadata-Flavor: Google" 2>/dev/null || hostname -I | awk '{print $1}')

echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  Setup complete!${RESET}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════════${RESET}"
echo ""
echo -e "  Site URL   : ${CYAN}http://${EXTERNAL_IP}:8080${RESET}"
echo -e "  Admin panel: ${CYAN}http://${EXTERNAL_IP}:8080/admin${RESET}  (password: admin123)"
echo ""
echo -e "  Useful commands:"
echo -e "    sudo docker compose --project-directory $APP_DIR logs -f         # live logs"
echo -e "    sudo docker compose --project-directory $APP_DIR ps              # container status"
echo -e "    $APP_DIR/update.sh                              # deploy new code"
echo ""
echo -e "${YELLOW}  IMPORTANT:${RESET} Change the admin password in sessionStorage after first login."
echo -e "${YELLOW}  IMPORTANT:${RESET} Ensure port 8080 is open in your cloud firewall."
echo ""
