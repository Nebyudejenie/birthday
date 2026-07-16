#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  Shared helpers for every script: strict mode, colours, logging,
#  environment loading and a docker-compose wrapper.
#  Source this at the top of each script:  source "$(dirname "$0")/common.sh"
# ─────────────────────────────────────────────────────────────
set -Eeuo pipefail

# Colours (only when writing to a terminal)
if [[ -t 1 ]]; then
  C_RED=$'\033[31m'; C_GRN=$'\033[32m'; C_YLW=$'\033[33m'
  C_BLU=$'\033[34m'; C_DIM=$'\033[2m'; C_BLD=$'\033[1m'; C_RST=$'\033[0m'
else
  C_RED=; C_GRN=; C_YLW=; C_BLU=; C_DIM=; C_BLD=; C_RST=
fi

log()  { printf '%s %s\n'  "${C_BLU}▸${C_RST}"  "$*"; }
ok()   { printf '%s %s\n'  "${C_GRN}✔${C_RST}"  "$*"; }
warn() { printf '%s %s\n'  "${C_YLW}!${C_RST}"  "$*" >&2; }
err()  { printf '%s %s\n'  "${C_RED}✗${C_RST}"  "$*" >&2; }
die()  { err "$*"; exit 1; }
hr()   { printf '%s\n' "${C_DIM}────────────────────────────────────────────────────────${C_RST}"; }
title(){ hr; printf '%s\n' "${C_BLD}$*${C_RST}"; hr; }

require_cmd() { command -v "$1" >/dev/null 2>&1 || die "Required command not found: ${C_BLD}$1${C_RST}"; }

# Fail loudly with the offending line number
trap 'err "Failed (exit $?) at ${BASH_SOURCE[0]}:${LINENO}"' ERR

# Resolve project root (parent of scripts/) and work from there
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Load .env if present (simple KEY=value file)
if [[ -f "$ROOT/.env" ]]; then
  set -a; # shellcheck disable=SC1091
  source "$ROOT/.env"; set +a
fi

# Defaults (overridable via .env)
: "${DOMAIN:=ebony-mylove.online}"
: "${IMAGE_NAME:=ebony-birthday}"
: "${TAG:=latest}"

# docker compose wrapper (v2 plugin). Adds the local override when EBONY_LOCAL=1.
dc() {
  local files=(-f docker-compose.yml)
  [[ "${EBONY_LOCAL:-0}" == "1" && -f docker-compose.local.yml ]] && files+=(-f docker-compose.local.yml)
  docker compose "${files[@]}" "$@"
}

# Is the Cloudflare tunnel fully configured (real config + credentials)?
tunnel_ready() {
  [[ -f cloudflared/config.yml ]] || return 1
  grep -q '<TUNNEL_ID>' cloudflared/config.yml && return 1
  ls cloudflared/*.json >/dev/null 2>&1 || return 1
  return 0
}
