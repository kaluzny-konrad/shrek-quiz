"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchPartySession } from "@/lib/api";
import type { PartySession } from "@/lib/party-session";

const POLL_MS = 2000;

export function usePartySession() {
  const [session, setSession] = useState<PartySession | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(18);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchPartySession();
      setSession(data.session);
      setTotalQuestions(data.totalQuestions);
      setError(null);
    } catch {
      setError("Brak połączenia z sesją quizu.");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { session, totalQuestions, error, refresh };
}
