import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

type BucketObject = {
  key: string;
  size: number;
  uploaded: string | null;
};

type BucketListResponse =
  | {
      ok: true;
      objects: BucketObject[];
      truncated: boolean;
    }
  | {
      ok: false;
      error: string;
    };

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const listResult = await env.R2.list({ limit: 5 });

    const objects = listResult.objects.map((object) => ({
      key: object.key,
      size: object.size,
      uploaded: object.uploaded ? object.uploaded.toISOString() : null,
    }));

    const payload: BucketListResponse = {
      ok: true,
      objects,
      truncated: listResult.truncated ?? false,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Failed to query R2", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    const payload: BucketListResponse = {
      ok: false,
      error: message,
    };

    return NextResponse.json(payload, { status: 500 });
  }
}
