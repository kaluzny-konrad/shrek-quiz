"use client";

import { useEffect } from "react";
import { LiveLeaderboard } from "@/components/LiveLeaderboard";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LeaderboardModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"
        aria-label="Zamknij tablicę"
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 flex max-h-[min(92vh,720px)] flex-col rounded-t-2xl bg-stone-50 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leaderboard-modal-title"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <h2 id="leaderboard-modal-title" className="font-bold text-emerald-950">
            Tablica wyników
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-200"
          >
            Zamknij
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4">
          <LiveLeaderboard showHeader={false} />
        </div>
      </div>
    </div>
  );
}
