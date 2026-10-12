import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { MAX_SCORE, TOTAL_QUESTIONS } from "@/types/quiz";

type Props = {
  nickname: string;
  score: number;
  answeredCount: number;
};

export function StickyScoreBar({ nickname, score, answeredCount }: Props) {
  const done = answeredCount >= TOTAL_QUESTIONS;
  return (
    <div className="sticky top-0 z-20 border-b border-emerald-900/30 bg-emerald-950/95 text-emerald-50 shadow-lg backdrop-blur-md">
      <div className="mx-auto max-w-3xl space-y-2 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base">
          <div className="font-semibold">
            <span className="text-emerald-300">{nickname}</span>
            <span className="mx-2 text-emerald-700">·</span>
            <span>
              {score} / {MAX_SCORE} pkt
            </span>
            <span className="mx-2 text-emerald-700">·</span>
            <span>
              {answeredCount} / {TOTAL_QUESTIONS}
            </span>
            {done && (
              <span className="ml-2 rounded-full bg-[var(--swamp-gold)] px-2 py-0.5 text-xs font-bold text-emerald-950">
                Koniec!
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-lg border border-emerald-700 px-2.5 py-1.5 text-sm text-emerald-100 hover:bg-emerald-900"
            >
              Start
            </Link>
            <Link
              href="/tablica"
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Tablica
            </Link>
          </div>
        </div>
        <ProgressBar
          value={answeredCount}
          max={TOTAL_QUESTIONS}
          label="Postęp quizu"
        />
      </div>
    </div>
  );
}
