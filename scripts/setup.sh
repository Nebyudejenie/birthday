#!/usr/bin/env bash
# Prepare a fresh Ubuntu 24.04 server: system deps, Docker, dirs, .env.
# Idempotent — safe to run more than once.
source "$(dirname "$0")/common.sh"

title "Ebony Birthday · Server Setup"

SUDO=""; [[ $EUID -ne 0 ]] && SUDO="sudo"

# ── 1. OS check ──
if [[ -r /etc/os-release ]]; then
  . /etc/os-release
  log "Detected: ${PRETTY_NAME:-unknown}"
  [[ "${VERSION_ID:-}" == "24.04" ]] || warn "Expected Ubuntu 24.04; found ${VERSION_ID:-?}. Continuing anyway."
else
  warn "Cannot read /etc/os-release — skipping OS check."
fi

# ── 2. System update ──
if command -v apt-get >/dev/null 2>&1; then
  log "Updating system packages…"
  $SUDO apt-get update -y -qq
  $SUDO DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq
  ok "System updated"

  # ── 3. Base tooling ──
  log "Installing curl, git, unzip, jq, ca-certificates…"
  $SUDO apt-get install -y -qq curl git unzip jq ca-certificates
  ok "Base tools installed"
else
  warn "apt-get not found — install curl git unzip jq manually."
fi

# ── 4. Docker ──
if ! command -v docker >/dev/null 2>&1; then
  log "Installing Docker Engine (get.docker.com)…"
  curl -fsSL https://get.docker.com | $SUDO sh
  $SUDO systemctl enable --now docker || true
  if [[ $EUID -ne 0 ]]; then
    $SUDO usermod -aG docker "$USER" || true
    warn "Added $USER to the 'docker' group — log out/in (or run 'newgrp docker') for it to take effect."
  fi
  ok "Docker installed"
else
  ok "Docker already present: $(docker --version)"
fi

# ── 5. Compose plugin ──
if docker compose version >/dev/null 2>&1; then
  ok "Docker Compose present: $(docker compose version | head -1)"
else
  warn "Docker Compose v2 plugin missing. Installing…"
  $SUDO apt-get install -y -qq docker-compose-plugin || die "Could not install docker-compose-plugin"
  ok "Docker Compose installed"
fi

# ── 6. Directories ──
log "Ensuring project directories…"
mkdir -p logs backup ssl cloudflared public/song public/photos
touch logs/.gitkeep backup/.gitkeep ssl/.gitkeep
ok "Directories ready"

# ── 7. Environment file ──
if [[ ! -f .env ]]; then
  cp .env.example .env
  ok "Created .env from .env.example — edit it and fill in your Tunnel ID"
else
  ok ".env already exists (left untouched)"
fi

# ── 8. Script permissions ──
chmod +x scripts/*.sh
ok "Scripts made executable"

# ── 9. Port check (informational; the tunnel means we don't need public ports) ──
if command -v ss >/dev/null 2>&1; then
  for p in 80 443; do
    if ss -ltn "( sport = :$p )" 2>/dev/null | grep -q LISTEN; then
      warn "Port $p is already in use (fine — this stack does not need it publicly)."
    fi
  done
fi

# ── 10. Structure validation ──
missing=0
for f in Dockerfile docker-compose.yml nginx/nginx.conf content/site.ts; do
  [[ -e "$f" ]] || { err "Missing expected file: $f"; missing=1; }
done
[[ $missing -eq 0 ]] && ok "Project structure looks good"

# ── Next steps ──
hr
printf '%s\n' "${C_BLD}Next steps:${C_RST}"
cat <<EOF
  1. Edit ${C_BLD}.env${C_RST}                       (set TZ / Tunnel ID)
  2. Configure the tunnel        → ${C_BLD}cloudflared/README.md${C_RST}
  3. Deploy                      → ${C_BLD}./scripts/deploy.sh${C_RST}
  4. Visit                       → ${C_BLD}https://${DOMAIN}${C_RST}
EOF
hr
ok "Setup complete."
