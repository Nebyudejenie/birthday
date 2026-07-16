#!/usr/bin/env bash
# Back up configuration, content and media into backup/ (timestamped tar.gz).
# Keeps the last N archives.  --no-secrets omits .env and tunnel credentials.
source "$(dirname "$0")/common.sh"

KEEP="${BACKUP_KEEP:-10}"
INCLUDE_SECRETS=1
[[ "${1:-}" == "--no-secrets" ]] && INCLUDE_SECRETS=0

title "Ebony Birthday · Backup"
mkdir -p backup
stamp="$(date +%Y%m%d-%H%M%S)"
archive="backup/ebony-${stamp}.tar.gz"

# What we back up (skip build output, node_modules, other backups)
paths=(
  content
  public/photos
  public/song
  nginx
  cloudflared/config.yml
  cloudflared/config.example.yml
  docker-compose.yml
  docker-compose.local.yml
  .env.example
)
[[ $INCLUDE_SECRETS -eq 1 ]] && { [[ -f .env ]] && paths+=(.env); for j in cloudflared/*.json; do [[ -e "$j" ]] && paths+=("$j"); done; }

# Filter to existing paths only
existing=(); for p in "${paths[@]}"; do [[ -e "$p" ]] && existing+=("$p"); done
[[ ${#existing[@]} -gt 0 ]] || die "Nothing to back up."

log "Archiving ${#existing[@]} paths…"
tar -czf "$archive" "${existing[@]}"
ok "Created $archive ($(du -h "$archive" | cut -f1))"
[[ $INCLUDE_SECRETS -eq 0 ]] && warn "Secrets excluded (.env, tunnel credentials)."

# Retention
mapfile -t old < <(ls -1t backup/ebony-*.tar.gz 2>/dev/null | tail -n +$((KEEP + 1)))
if [[ ${#old[@]} -gt 0 ]]; then
  log "Pruning $((${#old[@]})) old backup(s) (keeping $KEEP)…"
  rm -f "${old[@]}"
fi
ok "Backup complete."
