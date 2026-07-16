#!/usr/bin/env bash
# End-to-end smoke test of the containerised stack, locally.
# Builds, starts web+nginx with a published port, checks status codes,
# security headers and the health endpoint, then tears everything down.
source "$(dirname "$0")/common.sh"

require_cmd docker
require_cmd curl
export EBONY_LOCAL=1

BASE="http://localhost:8080"
title "Ebony Birthday · Verify (local containers)"

cleanup() { log "Tearing down…"; dc down >/dev/null 2>&1 || true; }
trap cleanup EXIT

log "Building & starting web + nginx…"
dc up -d --build web nginx

log "Waiting for web health…"
for i in $(seq 1 40); do
  s="$(docker inspect --format '{{.State.Health.Status}}' ebony-web 2>/dev/null || echo starting)"
  [[ "$s" == "healthy" ]] && break
  [[ "$s" == "unhealthy" ]] && { dc logs --tail=40 web; die "web unhealthy"; }
  sleep 2
  [[ $i -eq 40 ]] && { dc logs --tail=40 web; die "web never became healthy"; }
done
ok "web healthy"

pass=0; fail=0
check() { # desc, actual, expected-substring
  if grep -qi "$3" <<<"$2"; then ok "$1"; ((pass++)); else err "$1 (got: ${2:0:60})"; ((fail++)); fi
}

log "Checking endpoints & headers…"
home_code="$(curl -s -o /dev/null -w '%{http_code}' "$BASE")"
check "GET /            → 200"            "$home_code" "200"

health_code="$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/health")"
check "GET /api/health  → 200"            "$health_code" "200"

nginx_health="$(curl -s "$BASE/healthz")"
check "GET /healthz     → ok"             "$nginx_health" "ok"

hdrs="$(curl -s -D - -o /dev/null "$BASE")"
check "CSP header"                        "$hdrs" "content-security-policy"
check "X-Frame-Options"                   "$hdrs" "x-frame-options"
check "X-Content-Type-Options"            "$hdrs" "x-content-type-options"
check "Referrer-Policy"                   "$hdrs" "referrer-policy"
check "Permissions-Policy"                "$hdrs" "permissions-policy"
check "HSTS"                              "$hdrs" "strict-transport-security"
check "server version hidden"            "$(grep -i '^server:' <<<"$hdrs")" "nginx"

# static asset immutable caching
asset="$(curl -s "$BASE" | grep -oE '/_next/static/[^"]+\.(js|css)' | head -1 || true)"
if [[ -n "$asset" ]]; then
  ah="$(curl -s -D - -o /dev/null "$BASE$asset")"
  check "static asset immutable cache"    "$ah" "immutable"
fi

# key content present (proves the app actually renders through nginx)
html="$(curl -s "$BASE")"
check "renders 'Begin Experience'"        "$html" "Begin Experience"

hr
if [[ $fail -eq 0 ]]; then
  ok "All $pass checks passed."
else
  die "$fail check(s) failed, $pass passed."
fi
