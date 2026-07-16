# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────
# 1. Dependencies
# ─────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
# libc compat helps some native deps; non-fatal since this app is pure-JS and
# it keeps the build resilient to transient Alpine mirror hiccups.
RUN apk add --no-cache libc6-compat || true
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# ─────────────────────────────────────────────
# 2. Build (produces .next/standalone)
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─────────────────────────────────────────────
# 3. Runtime — tiny, non-root
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone server + static assets + public files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Container-native healthcheck hitting the app's readiness endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
