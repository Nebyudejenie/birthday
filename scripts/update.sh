#!/usr/bin/env bash
# Pull latest code (if a git repo), rebuild only if something changed,
# restart affected containers, and prune old images. Assets/config preserved.
source "$(dirname "$0")/common.sh"

title "Ebony Birthday · Update"

CHANGED=1
if [[ -d .git ]] && command -v git >/dev/null 2>&1; then
  before="$(git rev-parse HEAD 2>/dev/null || echo none)"
  log "Pulling latest changes…"
  git pull --ff-only || warn "git pull failed (continuing with local state)"
  after="$(git rev-parse HEAD 2>/dev/null || echo none)"
  if [[ "$before" == "$after" ]]; then
    CHANGED=0
    ok "Already up to date ($after)"
  else
    ok "Updated: $before → $after"
  fi
else
  warn "Not a git repo — rebuilding from local files."
fi

PROFILE=(); tunnel_ready && PROFILE=(--profile tunnel)

if [[ $CHANGED -eq 1 ]]; then
  log "Rebuilding web image…"
  dc build web
  log "Restarting web…"
  dc "${PROFILE[@]}" up -d web
else
  log "No code changes — recreating containers only if config changed…"
  dc "${PROFILE[@]}" up -d --remove-orphans
fi

# reload nginx config without downtime
if docker ps --format '{{.Names}}' | grep -q '^ebony-nginx$'; then
  docker exec ebony-nginx nginx -t >/dev/null 2>&1 && docker exec ebony-nginx nginx -s reload \
    && ok "nginx config reloaded" || warn "nginx reload skipped"
fi

log "Pruning dangling images…"
docker image prune -f >/dev/null || true
ok "Update complete."
