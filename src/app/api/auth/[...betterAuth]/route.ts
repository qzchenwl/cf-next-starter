import type { NextRequest } from "next/server";

import { createAuth } from "@/lib/auth";

async function handle(request: NextRequest) {
  const auth = await createAuth(request);
  return auth.handler(request);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;
export const HEAD = handle;
