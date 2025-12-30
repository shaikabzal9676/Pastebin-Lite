import { getDb } from "@/lib/mongo";
import { getNowMs } from "@/lib/time";
import { notFound } from "next/navigation";
import type { Paste } from "@/lib/types";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ UNWRAP params
  const { id } = await params;

  const db = await getDb();
  const collection = db.collection<Paste>("pastes");

  const paste = await collection.findOne({ _id: id });

  if (!paste) notFound();

  const now = new Date();

  if (paste.expiresAt && now >= paste.expiresAt) notFound();
  if (paste.maxViews !== null && paste.views >= paste.maxViews) notFound();

  return (
    <main className="p-6">
      <pre className="whitespace-pre-wrap">{paste.content}</pre>
    </main>
  );
}
