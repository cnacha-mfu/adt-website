FROM node:20-slim AS base

# ── Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build Next.js (standalone output)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Stage 3: Lean production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# uploads dir — on first run Docker will seed the named volume with the
# contents of this directory (default staff/program/highlight images).
# Subsequent runs use the persisted volume.
RUN chown -R nextjs:nodejs /app/public/uploads 2>/dev/null || true

USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
