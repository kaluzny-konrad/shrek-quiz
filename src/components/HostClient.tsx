"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QUESTIONS_BY_ID } from "@/data/questions";
import { hostSessionAction } from "@/lib/api";
import { isQuizFinished } from "@/lib/quiz";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { usePartySession } from "@/hooks/usePartySession";

const HOST_KEY_STORAGE = "party-quiz-host-key";

export function HostClient() {
  const { session, totalQuestions, refresh } = usePartySession();
  const { players, refresh: refreshBoard } = useLeaderboard();
  const [hostKey, setHostKey] = useState("");
  const [savedKey, setSavedKey] = useState(
    () => localStorage.getItem(HOST_KEY_STORAGE) ?? "",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentId = session?.currentQuestionId ?? 1;
  const question = QUESTIONS_BY_ID.get(currentId);
  const finished = session ? isQuizFinished(session) : false;

  const answeredNow = useMemo(() => {
    if (!session || finished) return [];
    return players.filter((p) => p.answers[currentId]);
  }, [players, currentId, session, finished]);

  const runHost = async (action: "next" | "reset" | "resetAll") => {
    setError(null);
    setBusy(true);
    try {
      const key = savedKey || hostKey;
      await hostSessionAction(key, action);
      await refresh();
      await refreshBoard();
      if (!savedKey && hostKey) {
        localStorage.setItem(HOST_KEY_STORAGE, hostKey);
        setSavedKey(hostKey);
      }
    } catch {
      setError("Zły klucz prowadzącego lub błąd serwera.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-black text-emerald-950">Panel prowadzącego</h1>
      <p className="mt-2 text-sm text-stone-600">
        Przechodź pytania, gdy wszyscy odpowiedzą. Domyślny klucz (env):{" "}
        <code className="rounded bg-stone-100 px-1">impreza</code>
      </p>

      {!savedKey && (
        <label className="mt-4 block text-sm">
          Klucz prowadzącego (HOST_SECRET)
          <input
            value={hostKey}
            onChange={(e) => setHostKey(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="impreza"
          />
        </label>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      {session && (
        <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Aktualnie na ekranach graczy
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-950">
            {finished
              ? "Koniec quizu"
              : `Pytanie ${currentId} / ${totalQuestions}`}
          </p>
          {question && !finished && (
            <p className="mt-3 text-stone-800">{question.prompt}</p>
          )}
          {!finished && (
            <p className="mt-4 text-sm text-emerald-800">
              Odpowiedziało: {answeredNow.length} / {players.length}{" "}
              {answeredNow.length > 0 && (
                <span className="text-stone-600">
                  ({answeredNow.map((p) => p.nickname).join(", ")})
                </span>
              )}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || finished}
              onClick={() => void runHost("next")}
              className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
            >
              Następne pytanie →
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void runHost("reset")}
              className="rounded-xl border px-4 py-3 text-sm"
            >
              Reset sesji (pytanie 1)
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (
                  !confirm(
                    "Wyczyścić WSZYSTKICH graczy z bazy i zacząć od pytania 1?",
                  )
                ) {
                  return;
                }
                void runHost("resetAll");
              }}
              className="rounded-xl border border-red-300 px-4 py-3 text-sm text-red-800"
            >
              Wyczyść bazę przed imprezą
            </button>
          </div>
        </div>
      )}

      <Link href="/quiz" className="mt-6 inline-block text-emerald-800 underline">
        Podgląd jak gracz
      </Link>
    </div>
  );
}
