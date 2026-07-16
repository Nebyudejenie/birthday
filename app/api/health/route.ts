import { NextResponse } from "next/server";

/**
 * Liveness / readiness endpoint.
 *   GET /api/health  → 200 { status: "ok", ... }
 * Used by the container HEALTHCHECK, nginx upstream checks and healthcheck.sh.
 * Dynamic + no-store so it always reflects the live process, never a cache.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const startedAt = Date.now();

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "ebony-birthday",
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      time: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
