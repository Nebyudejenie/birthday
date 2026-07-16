#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  One-command bootstrap for Ebony's Birthday.
#  Runs setup (Docker + deps) then deploys the containerised stack.
#  You never need Node or npm on the host — everything builds in Docker.
#
#  Usage:
#    ./install.sh            # setup + deploy (uses the tunnel if configured)
#    ./install.sh --local    # setup + deploy on http://<server>:8080 (no tunnel)
# ─────────────────────────────────────────────────────────────
set -Eeuo pipefail
cd "$(dirname "$0")"

BOLD=$'\033[1m'; GRN=$'\033[32m'; YLW=$'\033[33m'; RST=$'\033[0m'
say() { printf '%s\n' "${BOLD}$*${RST}"; }

MODE="${1:-}"

say "╭──────────────────────────────────────────────╮"
say "│   Ebony's Birthday · one-command install     │"
say "╰──────────────────────────────────────────────╯"

# 1) System + Docker + dirs + .env
say "▸ Step 1/2 — setup"
bash scripts/setup.sh

# 2) If Docker was just installed, the group membership isn't active in THIS
#    shell yet. Detect that and re-exec the deploy under the docker group.
if ! docker info >/dev/null 2>&1; then
  printf '%s\n' "${YLW}Docker needs a fresh group session. Re-running deploy via 'sg docker'…${RST}"
  exec sg docker -c "bash scripts/deploy.sh ${MODE}"
fi

say "▸ Step 2/2 — deploy"
bash scripts/deploy.sh ${MODE:+"$MODE"}

printf '%s\n' "${GRN}✔ Done.${RST}"
