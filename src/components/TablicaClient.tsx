"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { loadProgress, subscribeProgress } from "@/lib/progress";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export function TablicaClient() {
  const { players, loading, error, refresh } = useLeaderboard();
  const playerId = useSyncExternalStore(
    subscribeProgress,
    () => loadProgress()?.playerId,
    () => undefined,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-emerald-950">Tablica wyników</h1>
        <p className="mt-2 text-stone-600">
          Kto dominuje na bagnie? Odświeżanie co 5 sekund — rozwiń gracza, żeby
          zobaczyć mapę odpowiedzi.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2 sm:justify-start">
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-full border border-emerald-800/20 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-emerald-50"
        >
          Odśwież teraz
        </button>
        <Link
          href="/quiz"
          className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Wróć do quizu
        </Link>
      </div>

      {loading && players.length === 0 && (
        <p className="text-center text-stone-500">Ładowanie tablicy…</p>
      )}
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <LeaderboardTable players={players} currentPlayerId={playerId} />
    </div>
  );
}
