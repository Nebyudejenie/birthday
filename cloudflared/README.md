# Cloudflare Tunnel — setup

The site is served through a **Cloudflare Tunnel**: no public ports are opened on
the server, and HTTPS is terminated at Cloudflare's edge. `cloudflared` (a
container in `docker-compose.yml`, `--profile tunnel`) makes an outbound
connection to Cloudflare and forwards traffic to the internal `nginx` service.

```
Browser ──HTTPS──▶ Cloudflare edge ──tunnel──▶ cloudflared ──HTTP──▶ nginx ──▶ web (Next.js)
```

## One-time setup

Do this once on the server (or anywhere with the domain in your Cloudflare account).

```bash
# 1. Install cloudflared (Ubuntu)
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cf.deb
sudo dpkg -i /tmp/cf.deb

# 2. Authenticate (opens a browser link; pick the ebony-mylove.online zone)
cloudflared tunnel login

# 3. Create the tunnel — note the Tunnel ID it prints
cloudflared tunnel create ebony

# 4. Move the generated credentials into this folder
mv ~/.cloudflared/<TUNNEL_ID>.json  ./cloudflared/<TUNNEL_ID>.json

# 5. Create the config from the example and drop in the ID
cp cloudflared/config.example.yml cloudflared/config.yml
#   → replace both <TUNNEL_ID> occurrences in cloudflared/config.yml

# 6. Point DNS at the tunnel (creates the proxied CNAME records in Cloudflare)
cloudflared tunnel route dns ebony ebony-mylove.online
cloudflared tunnel route dns ebony www.ebony-mylove.online

# 7. Also record the Tunnel ID in the project .env
#   CLOUDFLARE_TUNNEL_ID=<TUNNEL_ID>
```

## Run it

```bash
docker compose --profile tunnel up -d      # or: ./scripts/deploy.sh
```

## DNS records (managed by Cloudflare)

`cloudflared tunnel route dns` creates these automatically — verify in the
Cloudflare dashboard that they exist and are **Proxied (orange cloud)**:

| Type  | Name                | Content                         | Proxy |
| ----- | ------------------- | ------------------------------- | ----- |
| CNAME | ebony-mylove.online | `<TUNNEL_ID>.cfargotunnel.com`  | ✅    |
| CNAME | www                 | `<TUNNEL_ID>.cfargotunnel.com`  | ✅    |

At the **registrar (Hostinger)**, set the domain's nameservers to the two
Cloudflare nameservers shown when you added the site to Cloudflare.

## Verify

```bash
docker compose --profile tunnel logs -f cloudflared   # look for "Registered tunnel connection"
cloudflared tunnel info ebony                          # shows active connections
curl -I https://ebony-mylove.online                    # expect 200 + security headers
```

## Optional — Zero Trust access lock

To password/identity-gate the site before the birthday, add an **Access
application** in Cloudflare Zero Trust for `ebony-mylove.online` with an
email/OTP policy. No app changes needed; remove the policy on July 21 to open it.

## Files

- `config.example.yml` — template ingress config (committed)
- `config.yml` — your real config (git-ignored)
- `<TUNNEL_ID>.json` — tunnel credentials (git-ignored, **secret**)
