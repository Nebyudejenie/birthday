/**
 * next.config uses `output: "standalone"`, which produces a self-contained
 * server at .next/standalone/server.js but does NOT copy the static assets
 * or /public next to it — and `next start` refuses to serve a standalone
 * build. This script stages those assets so `npm start` (and any bare
 * `node .next/standalone/server.js`) serves a fully-styled page, exactly
 * like the Docker image does.
 */
import { cp, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.error("✗ .next/standalone not found — run `next build` first.");
  process.exit(1);
}

async function stage(from, to) {
  if (!existsSync(from)) return;
  await rm(to, { recursive: true, force: true });
  await cp(from, to, { recursive: true });
}

await mkdir(join(standalone, ".next"), { recursive: true });
await stage(join(root, "public"), join(standalone, "public"));
await stage(join(root, ".next", "static"), join(standalone, ".next", "static"));

console.log("✓ Staged public/ and .next/static into .next/standalone");
