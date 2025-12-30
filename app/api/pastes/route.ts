// app/api/pastes/route.ts
import { NextRequest } from "next/server";
import { getDb } from "@/lib/mongo";
import { nanoid } from "nanoid";
import { Paste } from "@/lib/types";

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.content !== "string" || !body.content.trim()) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { content, ttl_seconds, max_views } = body;

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const id = nanoid(10);
  const now = new Date();

  const expiresAt =
    ttl_seconds !== undefined
      ? new Date(now.getTime() + ttl_seconds * 1000)
      : null;

  const paste: Paste = {
    _id: id,
    content,
    createdAt: now,
    expiresAt,
    maxViews: max_views ?? null,
    views: 0,
  };

  const db = await getDb();
  await db.collection<Paste>("pastes").insertOne(paste);

  const url = `${new URL(request.url).origin}/p/${id}`;

  return Response.json({ id, url });
}
