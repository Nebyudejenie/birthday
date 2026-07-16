# Deployment — ebony-mylove.online

Production-grade, one-command-ish deployment of the birthday site on **Ubuntu
24.04 + Docker + Cloudflare Tunnel**. No public ports; HTTPS at Cloudflare's edge.

```
Browser ──HTTPS──▶ Cloudflare edge ──tunnel──▶ cloudflared ──HTTP──▶ nginx ──▶ web (Next.js)
```

- **web** — the Next.js standalone server (`:3000`, internal only)
- **nginx** — security headers, CSP, gzip, immutable asset caching (`:80`, internal only)
- **cloudflared** — the *only* ingress; outbound tunnel to Cloudflare

---

## TL;DR

```bash
git clone <your-repo> birthday && cd birthday
./scripts/setup.sh                 # system + Docker + dirs + .env
#   … configure the tunnel once (cloudflared/README.md) …
./scripts/deploy.sh                # build + start + health + tunnel
# → https://ebony-mylove.online
```

Test locally first, without a tunnel:

```bash
./scripts/verify.sh                # builds, checks headers, tears down
./scripts/deploy.sh --local        # or run it at http://localhost:8080
```

---

## Directory layout

```
birthday/
├── app/  components/  content/  lib/   # the Next.js application
├── public/song/                        # the soundtrack lives here (or GitHub CDN)
├── Dockerfile                          # multi-stage, standalone, non-root
├── docker-compose.yml                  # web + nginx + cloudflared (tunnel profile)
├── docker-compose.local.yml            # local override: publishes :8080
├── nginx/nginx.conf                    # headers, CSP, gzip, caching
├── cloudflared/                        # tunnel config (secrets git-ignored)
│   ├── config.example.yml  README.md
├── scripts/                            # automation (see below)
├── logs/  backup/  ssl/                # runtime artifacts (git-ignored)
├── .env.example                        # copy → .env
└── DEPLOY.md
```

---

## Scripts

| Script | Purpose |
| --- | --- |
| `setup.sh` | Verify Ubuntu, update, install Docker + tools, create dirs & `.env`, validate structure |
| `deploy.sh` | Build image, start stack, wait for health, print URLs (auto-adds tunnel; `--local` for :8080) |
| `update.sh` | `git pull`, rebuild only if changed, restart, reload nginx, prune |
| `verify.sh` | Local end-to-end smoke test: 200s, security headers, rendering |
| `healthcheck.sh` | Report every layer's health; non-zero exit if unhealthy (cron-friendly) |
| `status.sh` | Containers, health, image sizes, disk, tunnel state |
| `logs.sh` | Tail logs (`all`, a service, or `nginx-file`) |
| `restart.sh` | Restart all or one service |
| `backup.sh` | Timestamped tar.gz of config/content/media (`--no-secrets` option, retention) |
| `restore.sh` | Restore newest (or given) backup, with a safety snapshot first |
| `cleanup.sh` | Prune Docker, rotate large logs (`--deep` for a full prune) |
| `renew.sh` | Certificate status (edge certs auto-renew; checks any origin certs in `ssl/`) |

All scripts share `scripts/common.sh` (strict mode, colour output, error traps,
`.env` loading, a compose wrapper).

---

## Cloudflare

- **DNS/HTTPS:** Cloudflare. Point the **Hostinger** registrar's nameservers at the
  two Cloudflare nameservers, then add the tunnel CNAMEs (done for you by
  `cloudflared tunnel route dns`). Full walkthrough: [`cloudflared/README.md`](cloudflared/README.md).
- **Certificates:** Cloudflare edge (Universal SSL), auto-renewed. Nothing to manage at the origin.
- **WAF / security:** enable Cloudflare's Managed WAF ruleset; optionally gate the
  site with a **Zero Trust Access** policy until the birthday, then remove it.

---

## Security & performance (built in)

- Headers at nginx: **CSP**, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, **HSTS**, `server_tokens off`.
- CSP allows the app's own assets + the song streamed from `raw.githubusercontent.com`.
- gzip at origin; **Brotli** added at the Cloudflare edge.
- Hashed `/_next/static` assets served `immutable, max-age=1y`; HTML `no-cache`.
- Next.js: standalone output, code-splitting, `next/font` (self-hosted, no external
  CDN), lazy/reactive canvases, audio streamed `preload="metadata"`.

---

## Environment (`.env`)

| Var | Meaning |
| --- | --- |
| `DOMAIN` | `ebony-mylove.online` |
| `NODE_ENV` | `production` |
| `PORT` | internal app port (`3000`, never published) |
| `TZ` | server timezone |
| `IMAGE_NAME` / `TAG` | Docker image name/tag |
| `CLOUDFLARE_TUNNEL_ID` | your tunnel ID |
| `CLOUDFLARE_CREDENTIALS_PATH` | path to the tunnel credentials JSON |

Secrets (`.env`, `cloudflared/*.json`, `cloudflared/config.yml`) are git-ignored.

---

## Day-2 operations

```bash
./scripts/status.sh          # what's running
./scripts/logs.sh cloudflared
./scripts/healthcheck.sh     # add to cron: */5 * * * * .../healthcheck.sh
./scripts/backup.sh          # cron nightly
./scripts/update.sh          # ship new changes
./scripts/cleanup.sh         # reclaim space
```
