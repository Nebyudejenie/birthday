#!/usr/bin/env bash
# Certificate status. With Cloudflare Tunnel there is nothing to renew at the
# origin — HTTPS uses Cloudflare's auto-renewing edge certificate. This script
# confirms that and, if you optionally placed a Cloudflare Origin CA cert in
# ssl/, reports its expiry.
source "$(dirname "$0")/common.sh"

title "Ebony Birthday · Certificate Status"

ok "Public HTTPS is served by Cloudflare's edge certificate (auto-renewed)."
log "The origin is reached only through the tunnel, so no origin cert is required."

shopt -s nullglob
certs=(ssl/*.pem ssl/*.crt)
if [[ ${#certs[@]} -eq 0 ]]; then
  log "No origin certificates found in ssl/ — nothing to check."
  exit 0
fi

require_cmd openssl
for c in "${certs[@]}"; do
  if end="$(openssl x509 -enddate -noout -in "$c" 2>/dev/null | cut -d= -f2)"; then
    end_epoch="$(date -d "$end" +%s 2>/dev/null || echo 0)"
    now="$(date +%s)"
    days=$(( (end_epoch - now) / 86400 ))
    if [[ $days -lt 15 ]]; then
      warn "$c expires in ${days}d ($end) — renew soon."
    else
      ok "$c valid for ${days} more days ($end)"
    fi
  fi
done
