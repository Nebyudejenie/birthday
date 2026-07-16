#!/usr/bin/env bash
# Restore from a backup archive.
#   ./scripts/restore.sh                    → restore the newest backup
#   ./scripts/restore.sh backup/ebony-….tar.gz
source "$(dirname "$0")/common.sh"

title "Ebony Birthday · Restore"

archive="${1:-}"
if [[ -z "$archive" ]]; then
  archive="$(ls -1t backup/ebony-*.tar.gz 2>/dev/null | head -1 || true)"
  [[ -n "$archive" ]] || die "No backups found in backup/."
  log "Using newest backup: $archive"
fi
[[ -f "$archive" ]] || die "Backup not found: $archive"

log "Contents:"
tar -tzf "$archive" | sed 's/^/  /'
hr
read -r -p "$(printf '%s' "${C_YLW}Restore these over the current files? [y/N] ${C_RST}")" ans
[[ "$ans" =~ ^[Yy]$ ]] || { warn "Aborted."; exit 0; }

# Safety snapshot first
log "Snapshotting current state before restore…"
"$ROOT/scripts/backup.sh" >/dev/null 2>&1 || warn "pre-restore snapshot failed (continuing)"

log "Extracting…"
tar -xzf "$archive" -C "$ROOT"
ok "Files restored."
warn "Run ./scripts/deploy.sh to rebuild/restart with the restored configuration."
