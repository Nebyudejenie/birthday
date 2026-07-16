#!/usr/bin/env bash
# Show container status, health, image sizes, disk and tunnel state.
source "$(dirname "$0")/common.sh"

title "Ebony Birthday · Status"

log "Containers:"
dc ps 2>/dev/null || warn "compose not running"
echo

log "Health:"
for c in ebony-web ebony-nginx ebony-tunnel; do
  if docker ps -a --format '{{.Names}}' | grep -q "^${c}$"; then
    state="$(docker inspect --format '{{.State.Status}}' "$c" 2>/dev/null)"
    health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}n/a{{end}}' "$c" 2>/dev/null)"
    printf '  %-14s %s (health: %s)\n' "$c" "$state" "$health"
  else
    printf '  %-14s %s\n' "$c" "not created"
  fi
done
echo

log "Images:"
docker images "${IMAGE_NAME}" --format '  {{.Repository}}:{{.Tag}}  {{.Size}}' 2>/dev/null || true
echo

log "Disk (Docker):"
docker system df 2>/dev/null | sed 's/^/  /' || true
echo

if tunnel_ready; then
  log "Tunnel: configured ✔  (domain: ${DOMAIN})"
else
  warn "Tunnel: not configured (see cloudflared/README.md)"
fi
