"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export type AdminPostRow = {
  id: string;
  content: string | null;
  caption: string | null;
  imageUrl: string | null;
  type: string;
  hidden: boolean;
  pinned: boolean;
  createdAt: string;
  user: { fullName: string; email: string };
  club: { name: string; slug: string };
  _count: { comments: number; postLikes: number };
};

export function AdminPostsClient({ posts: initial }: { posts: AdminPostRow[] }) {
  const [posts, setPosts] = useState(initial);

  const patch = async (id: string, body: { hidden?: boolean; pinned?: boolean }) => {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...body } : p)));
    toast.success("Updated");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-[#C9A96E]">Moderation</p>
        <h1 className="font-serif text-3xl italic text-[#F5F1EB] md:text-4xl">All posts</h1>
      </div>
      <div className="grid gap-4">
        {posts.map((p) => (
          <div
            key={p.id}
            className={`overflow-hidden rounded-2xl border bg-[rgba(255,248,235,0.04)] ${
              p.hidden ? "border-[#FF4D4D]/30" : "border-[#C9A96E]/20"
            }`}
          >
            <div className="flex flex-col gap-3 p-4 md:flex-row">
              {(p.imageUrl || p.caption) && (
                <div className="aspect-square w-full max-w-[140px] shrink-0 overflow-hidden rounded-xl bg-black/40">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-2 text-center text-xs text-white/50">
                      {p.caption}
                    </div>
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#C9A96E]/15 px-2 py-0.5 text-xs font-medium text-[#C9A96E]">
                    {p.club.name}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">{p.type}</span>
                  {p.pinned ? (
                    <span className="text-xs text-[#00E87A]">Pinned</span>
                  ) : null}
                  {p.hidden ? <span className="text-xs text-[#FF4D4D]">Hidden</span> : null}
                </div>
                <p className="mt-2 text-sm text-white/85">{p.content || p.caption || "—"}</p>
                <p className="mt-2 font-mono text-[10px] text-white/45">
                  {p.user.fullName} · {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })} ·{" "}
                  {p._count.postLikes} likes · {p._count.comments} comments
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 md:flex-col">
                <button
                  type="button"
                  onClick={() => patch(p.id, { hidden: !p.hidden })}
                  className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/85"
                >
                  {p.hidden ? "Show" : "Hide"}
                </button>
                <button
                  type="button"
                  onClick={() => patch(p.id, { pinned: !p.pinned })}
                  className="rounded-full border border-[#C9A96E]/40 px-3 py-1.5 text-xs text-[#C9A96E]"
                >
                  {p.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="rounded-full border border-[#FF4D4D]/50 px-3 py-1.5 text-xs text-[#FF4D4D]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {posts.length === 0 ? <p className="text-center text-white/50">No posts yet.</p> : null}
    </div>
  );
}
