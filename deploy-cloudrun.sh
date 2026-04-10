#!/usr/bin/env bash
# =============================================================================
# ADT Website — Cloud Run Deploy Script
# Project  : webdev2025-1
# Region   : asia-southeast1
# Registry : asia-southeast1-docker.pkg.dev/webdev2025-1/adt-website/app
#
# Requires:
#   - gcloud CLI authenticated (gcloud auth login)
#   - Docker running
#   - DATABASE_URL set (use Neon free tier: https://neon.tech)
#   - RESEND_API_KEY set
# =============================================================================

set -euo pipefail

PROJECT="webdev2025-1"
REGION="asia-southeast1"
SERVICE="adt-website"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT}/${SERVICE}/app"

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'
YELLOW='\033[1;33m'; BOLD='\033[1m'; RESET='\033[0m'
info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; exit 1; }

echo -e "${BOLD}"
echo "╔══════════════════════════════════════════╗"
echo "║   ADT Website — Cloud Run Deploy        ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${RESET}"

# ── Load .env if present ──────────────────────────────────────────────────────
if [[ -f .env ]]; then
  set -o allexport
  source .env
  set +o allexport
fi

# ── Require DATABASE_URL ──────────────────────────────────────────────────────
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo ""
  warn "DATABASE_URL is not set."
  echo ""
  echo "  For a free PostgreSQL database, create one at https://neon.tech"
  echo "  Then paste the connection string (starts with postgresql://) below."
  echo ""
  read -rp "  DATABASE_URL: " DATABASE_URL
  [[ -z "$DATABASE_URL" ]] && error "DATABASE_URL is required."
fi

# ── Require RESEND_API_KEY ────────────────────────────────────────────────────
RESEND_API_KEY="${RESEND_API_KEY:-}"
RESEND_FROM="${RESEND_FROM:-ADT Hotline <onboarding@resend.dev>}"
RESEND_TO="${RESEND_TO:-adt-school@mfu.ac.th}"

# ── Image tag = git SHA ───────────────────────────────────────────────────────
SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
IMAGE="${REGISTRY}:${SHA}"
info "Image: $IMAGE"

# ── Authenticate Docker with Artifact Registry ────────────────────────────────
info "Configuring Docker auth for Artifact Registry..."
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

# ── Build ─────────────────────────────────────────────────────────────────────
info "Building Docker image..."
docker build --platform linux/amd64 -t "$IMAGE" .
success "Build complete."

# ── Push ──────────────────────────────────────────────────────────────────────
info "Pushing image to Artifact Registry..."
docker push "$IMAGE"
success "Push complete."

# ── Deploy to Cloud Run ───────────────────────────────────────────────────────
info "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --concurrency 80 \
  --timeout 300 \
  --port 8080 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "DATABASE_URL=${DATABASE_URL}" \
  --set-env-vars "RESEND_API_KEY=${RESEND_API_KEY}" \
  --set-env-vars "RESEND_FROM=${RESEND_FROM}" \
  --set-env-vars "RESEND_TO=${RESEND_TO}" \
  --project "$PROJECT" \
  --quiet

# ── Get URL ───────────────────────────────────────────────────────────────────
URL=$(gcloud run services describe "$SERVICE" \
  --region "$REGION" \
  --project "$PROJECT" \
  --format="value(status.url)")

echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  Deployed!${RESET}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════════${RESET}"
echo ""
echo -e "  URL        : ${CYAN}${URL}${RESET}"
echo -e "  Admin      : ${CYAN}${URL}/admin${RESET}  (password: admin123)"
echo -e "  Hotline    : ${CYAN}${URL}/dean-hotline${RESET}"
echo ""
echo -e "${YELLOW}  NOTE:${RESET} Uploaded images are not persisted on Cloud Run."
echo -e "        Use the VM deployment for persistent uploads."
echo ""
