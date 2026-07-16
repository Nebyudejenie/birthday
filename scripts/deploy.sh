#!/usr/bin/env bash
# Build the image, start the stack, wait for health, print URLs.
# Adds the Cloudflare tunnel automatically when it is configured.
# Flags:  --local  (publish nginx on :8080 instead of using the tunnel)
source "$(dirname "$0")/common.sh"

require_cmd docker
docker compose version >/dev/null 2>&1 || die "Docker Compose v2 required."

LOCAL=0
[[ "${1:-}" == "--local" ]] && { LOCAL=1; export EBONY_LOCAL=1; }

title "Ebony Birthday · Deploy"

# ── Build ──
log "Building web image (${IMAGE_NAME}:${TAG})…"
dc build web
ok "Image built"

# ── Decide on the tunnel ──
PROFILE=()
if [[ $LOCAL -eq 1 ]]; then
  warn "Local mode: publishing nginx on http://localhost:8080 (no tunnel)."
elif tunnel_ready; then
  PROFILE=(--profile tunnel)
  ok "Cloudflare tunnel configured — it will be started."
else
  warn "Cloudflare tunnel not configured yet (see cloudflared/README.md)."
  warn "Starting web + nginx only; the site won't be public until the tunnel is up."
fi

# ── Start ──
log "Starting containers…"
dc "${PROFILE[@]}" up -d --remove-orphans
ok "Containers started"

# ── Wait for the web container to become healthy ──
log "Waiting for web health…"
for i in $(seq 1 30); do
  status="$(docker inspect --format '{{.State.Health.Status}}' ebony-web 2>/dev/null || echo starting)"
  case "$status" in
    healthy) ok "web is healthy"; break ;;
    unhealthy) dc logs --tail=40 web; die "web became unhealthy" ;;
    *) printf '%s' "."; sleep 2 ;;
  esac
  [[ $i -eq 30 ]] && { echo; dc logs --tail=40 web; die "web did not become healthy in time"; }
done
echo

# ── Summary ──
hr
dc "${PROFILE[@]}" ps
hr
if [[ $LOCAL -eq 1 ]]; then
  ok "Local preview:  ${C_BLD}http://localhost:8080${C_RST}"
elif tunnel_ready; then
  ok "Live at:        ${C_BLD}https://${DOMAIN}${C_RST}"
  log "Tunnel logs:    docker compose --profile tunnel logs -f cloudflared"
else
  ok "Internal only (no public ingress). Configure the tunnel, then re-run deploy."
fi
ok "Deploy complete."
