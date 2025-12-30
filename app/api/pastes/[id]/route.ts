import { getDb } from "@/lib/mongo";
import { getNowMs } from "@/lib/time";
import type { Paste } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ UNWRAP params
  const { id } = await params;
  const Id = id.trim();

  const db = await getDb();
  const collection = db.collection<Paste>("pastes");
  
  const paste = await collection.findOne({_id:id.trimEnd() });
  
  console.log("the paste is", paste);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = new Date(getNowMs(request.headers));
  console.log("the now is",now);

  if (paste.expiresAt && now >= paste.expiresAt) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await collection.updateOne(
    { _id: paste._id },
    { $inc: { views: 1 } }
  );

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null
        ? null
        : Math.max(0, paste.maxViews - paste.views - 1),
    expires_at: paste.expiresAt ? paste.expiresAt.toISOString() : null,
  });
}
