import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

type TimestampRow = {
  currentTimestamp: string;
};

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const row = await env.D1.prepare(
      "SELECT datetime('now') as currentTimestamp",
    ).first<TimestampRow>();

    return NextResponse.json({
      ok: true,
      currentTimestamp: row?.currentTimestamp ?? null,
    });
  } catch (error) {
    console.error("Failed to query D1", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
