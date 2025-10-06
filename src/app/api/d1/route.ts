import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

type TimestampRow = {
  currentTimestamp: string;
};

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.D1);
    const row = await db.get<TimestampRow>(
      sql`SELECT datetime('now') as currentTimestamp`,
    );

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
