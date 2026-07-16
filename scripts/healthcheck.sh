#!/usr/bin/env bash
# Report health of every layer. Exits non-zero if anything is unhealthy —
# suitable for cron / uptime monitors.
source "$(dirname "$0")/common.sh"

title "Ebony Birthday · Health Check"
fail=0

# ── Container states ──
for c in ebony-web ebony-nginx; do
  if ! docker ps --format '{{.Names}}' | grep -q "^${c}$"; then
    err "$c is not running"; fail=1; continue
  fi
  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}running{{end}}' "$c")"
  if [[ "$health" == "healthy" || "$health" == "running" ]]; then
    ok "$c: $health"
  else
    err "$c: $health"; fail=1
  fi
done

# tunnel is optional
if docker ps --format '{{.Names}}' | grep -q '^ebony-tunnel$'; then
  ok "ebony-tunnel: running"
fi

# ── App readiness through nginx (via a throwaway request from the web container net) ──
if docker ps --format '{{.Names}}' | grep -q '^ebony-nginx$'; then
  if docker exec ebony-nginx wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1; then
    ok "nginx /healthz: 200"
  else
    err "nginx /healthz: unreachable"; fail=1
  fi
  if docker exec ebony-nginx wget -qO- http://ebony_web:3000/api/health >/dev/null 2>&1 \
     || docker exec ebony-web node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    ok "app /api/health: 200"
  else
    err "app /api/health: unreachable"; fail=1
  fi
fi

# ── Public endpoint (best-effort) ──
if tunnel_ready && command -v curl >/dev/null 2>&1; then
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "https://${DOMAIN}" || echo 000)"
  [[ "$code" == "200" ]] && ok "https://${DOMAIN}: $code" || warn "https://${DOMAIN}: $code"
fi

hr
if [[ $fail -eq 0 ]]; then ok "All systems healthy."; else die "One or more checks failed."; fi
