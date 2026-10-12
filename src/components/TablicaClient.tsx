"use client";

import Link from "next/link";
import { LiveLeaderboard } from "@/components/LiveLeaderboard";

export function TablicaClient() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600">
          Pełny widok tablicy — podczas gry tablica jest też obok pytań na
          dużym ekranie.
        </p>
        <Link
          href="/quiz"
          className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Wróć do quizu
        </Link>
      </div>
      <LiveLeaderboard />
    </div>
  );
}
