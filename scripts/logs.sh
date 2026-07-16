#!/usr/bin/env bash
# Tail logs in real time.
#   ./scripts/logs.sh            → all services (follow)
#   ./scripts/logs.sh web        → one service
#   ./scripts/logs.sh nginx-file → nginx access/error files from ./logs
source "$(dirname "$0")/common.sh"

PROFILE=(); tunnel_ready && PROFILE=(--profile tunnel)

case "${1:-all}" in
  nginx-file)
    title "nginx file logs (./logs)"
    require_cmd tail
    touch logs/nginx.log logs/error.log 2>/dev/null || true
    tail -n 100 -f logs/*.log
    ;;
  all)
    title "All service logs (Ctrl-C to stop)"
    dc "${PROFILE[@]}" logs -f --tail=100
    ;;
  *)
    title "Logs · $1"
    dc "${PROFILE[@]}" logs -f --tail=200 "$1"
    ;;
esac
