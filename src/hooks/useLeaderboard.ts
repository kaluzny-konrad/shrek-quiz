"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLeaderboard } from "@/lib/api";
import type { PlayerState } from "@/types/quiz";

const POLL_MS = 5000;

export function useLeaderboard() {
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchLeaderboard();
      setPlayers(data);
      setError(null);
    } catch {
      setError("Nie udało się odświeżyć tablicy.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (cancelled) return;
      await refresh();
    };
    void run();
    const id = setInterval(() => void refresh(), POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [refresh]);

  return { players, loading, error, refresh };
}
