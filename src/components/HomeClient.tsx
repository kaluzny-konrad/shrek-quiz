"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { getProgressTotals } from "@/lib/progress";
import { MAX_SCORE, TOTAL_QUESTIONS } from "@/types/quiz";
import { useQuizProgress } from "@/hooks/useQuizProgress";

export function HomeClient() {
  const router = useRouter();
  const {
    progress,
    hydrated,
    ensurePlayer,
    resetAll,
    startFreshIdentity,
  } = useQuizProgress();
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = getProgressTotals(progress);
  const nicknameValue =
    nickname || (hydrated ? progress?.nickname ?? "" : "");

  const goQuiz = async () => {
    setError(null);
    setBusy(true);
    const result = await ensurePlayer(nicknameValue);
    setBusy(false);
    if (!result) {
      setError("Nick musi mieć 2–24 znaki.");
      return;
    }
    router.push("/quiz");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void goQuiz();
  };

  const onReset = async () => {
    if (
      !confirm(
        "Wyczyścić wszystkie odpowiedzi? Nick zostanie, postęp zniknie lokalnie i na serwerze.",
      )
    ) {
      return;
    }
    setBusy(true);
    await resetAll();
    setBusy(false);
  };

  const onFreshStart = async () => {
    if (
      !confirm(
        "Nowa sesja z nowym ID gracza? Stary postęp na tablicy zostanie.",
      )
    ) {
      return;
    }
    setBusy(true);
    await startFreshIdentity(nicknameValue);
    setBusy(false);
    router.push("/quiz");
  };

  if (!hydrated) {
    return <p className="text-center text-stone-600">Ładowanie bagna…</p>;
  }

  return (
    <div className="space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-5xl sm:text-6xl" aria-hidden>🧅</p>
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 sm:text-5xl">
          Shrek Pub Quiz
        </h1>
        <p className="mx-auto max-w-lg text-lg text-stone-700">
          {TOTAL_QUESTIONS} pytań, {MAX_SCORE} punktów do zdobycia. Odpowiadaj w
          dowolnym tempie — postęp zapisuje się u Ciebie i leci na tablicę.
        </p>
        <p className="text-sm font-medium text-emerald-800">
          „Ogry są jak cebula… a Ty jesteś gotów na warstwy wiedzy?”
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-md space-y-4 rounded-2xl border border-emerald-900/10 bg-white/90 p-6 shadow-lg shadow-emerald-900/5 backdrop-blur"
      >
        <label className="block text-sm font-medium text-stone-800">
          Nick drużyny / gracza
          <input
            value={nicknameValue}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={24}
            autoComplete="nickname"
            placeholder="np. Team Onion"
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        <p className="text-xs text-stone-500">
          Nick jest publiczny na tablicy wyników (bez logowania).
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}

        {totals.answeredCount > 0 && (
          <div className="space-y-2 rounded-xl bg-emerald-50 px-3 py-3">
            <p className="text-sm font-medium text-emerald-950">
              Twój postęp: {totals.score}/{MAX_SCORE} pkt
            </p>
            <ProgressBar
              value={totals.answeredCount}
              max={TOTAL_QUESTIONS}
              label={`${totals.answeredCount} / ${TOTAL_QUESTIONS} pytań`}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-emerald-700 py-3.5 text-lg font-bold text-white shadow-md transition hover:bg-emerald-600 hover:shadow-lg disabled:opacity-60"
        >
          {totals.answeredCount > 0 ? "Kontynuuj quiz →" : "Zacznij quiz →"}
        </button>

        {totals.answeredCount > 0 && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void onReset()}
            className="w-full rounded-xl border border-stone-300 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            Wyczyść odpowiedzi (ten sam nick)
          </button>
        )}
      </form>

      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <Link
          href="/tablica"
          className="rounded-full bg-white px-4 py-2 font-medium text-emerald-800 shadow-sm ring-1 ring-emerald-900/10 hover:bg-emerald-50"
        >
          👀 Tablica na żywo
        </Link>
        {progress && (
          <button
            type="button"
            className="text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
            onClick={() => void onFreshStart()}
          >
            Nowa tożsamość gracza
          </button>
        )}
      </div>
    </div>
  );
}
