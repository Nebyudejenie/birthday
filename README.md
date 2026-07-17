# To My Beautiful Queen — A Journey Across the Miles 💛

A luxury, cinematic, single-page birthday experience built for **Ebony** — a long-distance
love story told in gold and rose, from **Addis Ababa 🇪🇹** to **Cleveland, Ohio 🇺🇸**.

> *"Because love isn't measured in miles, but in moments."*

Built with **Next.js 14 · TypeScript · Tailwind · Framer Motion · Lenis · canvas-confetti**,
fully Dockerized for one-command deployment.

---

## ✨ The experience

A guided, scrolling story with always-on ambient layers (twinkling starfield, drifting rose
petals, Blue Morpho & Glasswing butterflies, aurora, a glowing moon, cursor light) and one
~35-minute soundtrack that starts on **“Begin Experience ❤️”**, fades in, remembers its
position, and subtly drives the glow of the stars and petals:

1. **Begin Experience** — black screen → golden particles → a growing heart → music fades in
2. **Hero** — staged reveal of *Happy Birthday · Ebony · My Beautiful Queen*
3. **Her Entrance** — her portrait in a gold gallery frame with a rose-gold bloom
4. **Chapter I — Open My Heart** — a wax-sealed envelope that opens into a handwritten letter
5. **Chapter II — Across the Miles** — a golden beam connects your two cities, with live clocks
6. **Chapter III — Our Story** — an animated memory timeline
7. **Chapter IV — Why You're Amazing** — a sky of clickable "reason" stars + a compliment generator
8. **Chapter V — A Prayer For You** — candles, a prayer, and rotating scripture
9. **Chapter VI — Your Birthday Cake** — light the candles, make a wish, blow → confetti
10. **Chapter VII — The Surprise Room** — gift boxes that unwrap little messages
11. **Finale** — live countdown, final letter, and a fireworks sky

A floating glass **music dock** shows the current cinematic chapter, time, seek bar and volume.

Accessible (respects `prefers-reduced-motion`), mobile-first, and kept out of search engines
(it's private).

---

## 💝 Make it yours — edit ONE file

Everything personal lives in **[`content/site.ts`](content/site.ts)**. Look for the `// ✏️`
markers and replace the sample text with **your own real words** — the letter, the memories,
the reasons, the prayer, the gift messages.

| Want to… | Do this in `content/site.ts` |
| --- | --- |
| Change the letter | edit `loveLetter` |
| Change the memories | edit `timeline` |
| Add reasons / compliments | add to `reasons` / `compliments` |
| Add photos | drop images in `public/photos/` and list them in `photos` |
| Lock it with a passcode | set `passcode` (e.g. `"ebony"`) — shows a gentle gate |

### 🎵 The soundtrack (one song, ~35 min)

Drop the birthday song at exactly:

```
public/song/Happy_Birthday_My_Love_song.mp3
```

That's the only music the site uses (path/volume/fade live in `content/site.ts → soundtrack`).
It never autoplays — it starts after the visitor clicks **“Begin Experience ❤️”**, fades in
0 → 35 % over 5 seconds, streams (`preload="metadata"`), and **remembers its position** across
reloads. The floating glass **music dock** shows play/pause, volume, mute, a seek bar, the live
time, and the current cinematic **chapter** (the song time maps to Opening → Celebration →
Our Story → Love Letter → Faith → Birthday → Final). The stars, petals and a soft golden bloom
**breathe subtly with the music** via a Web-Audio analyser.

> No audio is bundled — add a file you have the right to use.

---

## 🧑‍💻 Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

---

## 🐳 Deploy with Docker (one command)

```bash
docker compose up -d --build
```

The site is now live on **http://localhost:3000** (or your server's IP).

### Behind Nginx + HTTPS (production)

```bash
docker compose --profile proxy up -d --build
```

This adds a hardened Nginx reverse proxy on ports **80/443**.

1. Point your purchased domain's DNS to the server.
2. Put your TLS certs in `./nginx/certs/` as `fullchain.pem` + `privkey.pem`
   (e.g. from Let's Encrypt / Certbot).
3. Uncomment the `https` server block + the HTTP→HTTPS redirect in
   [`nginx/nginx.conf`](nginx/nginx.conf).
4. In `docker-compose.yml`, remove the `web` service's `ports:` mapping so it's only
   reachable through the proxy.
5. `docker compose --profile proxy up -d`

Health checks, restart policies, gzip, immutable asset caching and a non-root runtime
image are all configured.

---

## 🏗️ Architecture

```
app/                 Next.js App Router (layout, page, manifest, icon)
content/site.ts      ← the ONE file you personalize
components/
  ambient/           starfield, petals, aurora, cursor glow, smooth scroll
  experience/        loader, gate, music, progress, orchestrator, hero
  chapters/          letter, globe, timeline, reasons, prayer, cake, gifts, finale
  ui/                Reveal, SectionTitle, GoldButton
lib/                 hooks, smooth-scroll helper, confetti/fireworks
nginx/               reverse-proxy config (+ certs mount)
Dockerfile           multi-stage, standalone output, non-root
docker-compose.yml   one-command deploy (+ optional proxy profile)
```

Made with love by **Nebyu**. Happy Birthday, Ebony. ❤️
