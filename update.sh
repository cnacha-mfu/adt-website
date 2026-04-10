#!/usr/bin/env bash
# =============================================================================
# ADT Website — Update / Redeploy Script
#
# Run this on the VM whenever you push new code:
#   ./update.sh
#
# What it does:
#   1. Pulls latest code from git
#   2. Rebuilds the app image (PostgreSQL image untouched)
#   3. Replaces the running app container (zero-downtime for DB)
#   4. Reports status
# =============================================================================

set -euo pipefail

APP_DIR="/opt/adt-website"

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'
BOLD='\033[1m'; RESET='\033[0m'
info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; exit 1; }

echo -e "${BOLD}ADT Website — Deploying update...${RESET}"
echo ""

[[ -d "$APP_DIR/.git" ]] || error "$APP_DIR is not a git repo. Run setup-vm.sh first."

cd "$APP_DIR"

# ── 1. Pull latest code ───────────────────────────────────────────────────────
info "Pulling latest code from origin/master..."
sudo git pull origin master

# ── 2. Rebuild only the app image ─────────────────────────────────────────────
info "Rebuilding app image..."
sudo docker compose build app

# ── 3. Restart app container (DB keeps running) ───────────────────────────────
info "Restarting app container..."
sudo docker compose up -d --no-deps app

# ── 4. Wait for app to come up ────────────────────────────────────────────────
info "Waiting for app to start..."
sleep 5
ATTEMPTS=0
until sudo docker compose ps app | grep -q "running\|healthy" || [[ $ATTEMPTS -ge 20 ]]; do
  ATTEMPTS=$((ATTEMPTS + 1))
  sleep 3
done

# ── 5. Status ─────────────────────────────────────────────────────────────────
echo ""
sudo docker compose ps
echo ""
success "Deployment complete."
echo ""
echo -e "  Tail logs: ${CYAN}sudo docker compose --project-directory $APP_DIR logs -f app${RESET}"
echo ""
