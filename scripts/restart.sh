#!/usr/bin/env bash
# Restart the stack (optionally a single service: ./scripts/restart.sh nginx)
source "$(dirname "$0")/common.sh"

title "Ebony Birthday · Restart"
PROFILE=(); tunnel_ready && PROFILE=(--profile tunnel)

if [[ -n "${1:-}" ]]; then
  log "Restarting service: $1"
  dc "${PROFILE[@]}" restart "$1"
else
  log "Restarting all services…"
  dc "${PROFILE[@]}" restart
fi
ok "Restarted."
dc "${PROFILE[@]}" ps
