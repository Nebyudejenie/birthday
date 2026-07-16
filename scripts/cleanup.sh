#!/usr/bin/env bash
# Reclaim space: prune dangling Docker data, rotate big log files.
# --deep also removes ALL unused images (not just dangling). Asks first.
source "$(dirname "$0")/common.sh"

title "Ebony Birthday · Cleanup"

DEEP=0; [[ "${1:-}" == "--deep" ]] && DEEP=1

log "Pruning stopped containers & dangling images…"
docker container prune -f >/dev/null || true
docker image prune -f >/dev/null || true
docker builder prune -f >/dev/null 2>&1 || true
ok "Docker pruned"

if [[ $DEEP -eq 1 ]]; then
  read -r -p "$(printf '%s' "${C_YLW}Remove ALL unused images/volumes/networks? [y/N] ${C_RST}")" ans
  if [[ "$ans" =~ ^[Yy]$ ]]; then
    docker system prune -af >/dev/null || true
    ok "Deep prune done"
  fi
fi

# Rotate nginx log files larger than 20MB
for f in logs/*.log; do
  [[ -e "$f" ]] || continue
  size=$(stat -c%s "$f" 2>/dev/null || echo 0)
  if [[ "$size" -gt $((20 * 1024 * 1024)) ]]; then
    mv "$f" "${f}.$(date +%Y%m%d-%H%M%S)"
    : > "$f"
    log "Rotated $f"
  fi
done

# Prune rotated logs older than 14 days
find logs -name '*.log.*' -mtime +14 -delete 2>/dev/null || true
ok "Cleanup complete."
