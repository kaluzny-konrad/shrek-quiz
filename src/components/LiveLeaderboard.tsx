"use client";

import { useSyncExternalStore } from "react";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { loadProgress, subscribeProgress } from "@/lib/progress";
import { useLeaderboard } from "@/hooks/useLeaderboard";

type Props = {
  compact?: boolean;
  showHeader?: boolean;
};

export function LiveLeaderboard({ compact = false, showHeader = true }: Props) {
  const { players, loading, error, refresh } = useLeaderboard();
  const playerId = useSyncExternalStore(
    subscribeProgress,
    () => loadProgress()?.playerId,
    () => undefined,
  );

  return (
    <div className={compact ? "text-sm" : ""}>
      {showHeader && (
        <div className={compact ? "mb-3" : "mb-6"}>
          <h2
            className={`font-bold text-emerald-950 ${compact ? "text-base" : "text-2xl"}`}
          >
            Tablica na żywo
          </h2>
          {!compact && (
            <p className="mt-1 text-stone-600">
              Odświeżanie co 5 s — rozwiń gracza po mapę odpowiedzi.
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => void refresh()}
        className={`mb-3 rounded-full border border-emerald-800/20 bg-white font-medium shadow-sm hover:bg-emerald-50 ${
          compact ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"
        }`}
      >
        Odśwież
      </button>
      {loading && players.length === 0 && (
        <p className="text-stone-500">Ładowanie…</p>
      )}
      {error && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {error}
        </p>
      )}
      <LeaderboardTable
        players={players}
        currentPlayerId={playerId}
        compact={compact}
      />
    </div>
  );
}
