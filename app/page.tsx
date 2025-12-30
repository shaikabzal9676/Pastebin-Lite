"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function create() {
    setError("");
    setUrl("");

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    const payload: any = { content };
    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create paste");
      return;
    }

    setUrl(data.url);
    setContent("");
    setTtl("");
    setMaxViews("");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Pastebin Lite
          </h1>
          <p className="text-slate-500">
            Share text securely with expiry and view limits
          </p>
        </header>

        {/* Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Paste content
          </label>
          <textarea
            className="w-full min-h-[180px] rounded-xl border border-slate-300 bg-slate-50 p-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            placeholder="Paste your text here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              TTL (seconds)
            </label>
            <input
              type="number"
              min={1}
              placeholder="e.g. 60"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Max views
            </label>
            <input
              type="number"
              min={1}
              placeholder="e.g. 5"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
            />
          </div>
        </div>

        {/* Action */}
        <button
          onClick={create}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-3 transition shadow-md"
        >
          Create Paste
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {url && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-2">
            <p className="text-sm text-emerald-700 font-medium">
              Paste created successfully
            </p>
            <a
              href={url}
              className="block break-all text-indigo-600 hover:underline font-medium"
            >
              {url}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
