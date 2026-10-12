"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "@/components/QuestionCard";
import { QuizCompleteBanner } from "@/components/QuizCompleteBanner";
import { StickyScoreBar } from "@/components/StickyScoreBar";
import { ROUNDS } from "@/data/rounds";
import { QUESTIONS_BY_ID } from "@/data/questions";
import { getProgressTotals } from "@/lib/progress";
import { TOTAL_QUESTIONS } from "@/types/quiz";
import { useQuizProgress } from "@/hooks/useQuizProgress";

export function QuizPage() {
  const router = useRouter();
  const { progress, hydrated, syncError, submitAnswer } = useQuizProgress();

  const totals = useMemo(() => getProgressTotals(progress), [progress]);

  useEffect(() => {
    if (!hydrated) return;
    if (!progress?.nickname) {
      router.replace("/");
    }
  }, [hydrated, progress?.nickname, router]);

  if (!hydrated || !progress?.nickname) {
    return (
      <p className="p-8 text-center text-stone-600">Ładowanie quizu…</p>
    );
  }

  const scrollToFirstOpen = () => {
    for (let id = 1; id <= totals.totalQuestions; id++) {
      if (!progress.answers[id]) {
        document.getElementById(`q-${id}`)?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  const allDone = totals.answeredCount >= TOTAL_QUESTIONS;

  return (
    <>
      <StickyScoreBar
        nickname={progress.nickname}
        score={totals.score}
        answeredCount={totals.answeredCount}
      />
      <div className="mx-auto max-w-3xl px-4 py-6">
        {syncError && (
          <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {syncError}
          </p>
        )}

        {allDone && (
          <QuizCompleteBanner score={totals.score} nickname={progress.nickname} />
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={scrollToFirstOpen}
            className="rounded-full border border-emerald-800/25 bg-white px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm hover:bg-emerald-50"
          >
            ⏬ Następne bez odpowiedzi
          </button>
        </div>

        {ROUNDS.map((round) => {
          const roundAnswered = round.questionIds.filter(
            (id) => progress.answers[id],
          ).length;
          const roundTotal = round.questionIds.length;
          return (
            <section key={round.id} className="mb-12">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-emerald-900/15 pb-2">
                <h2 className="text-lg font-bold text-emerald-950 sm:text-xl">
                  Runda {round.id} — {round.title}
                </h2>
                <span className="text-sm text-stone-600">
                  {roundAnswered}/{roundTotal} · do {round.pointsPerQuestion} pkt
                </span>
              </div>
              <div className="flex flex-col gap-5">
                {round.questionIds.map((qid) => {
                  const question = QUESTIONS_BY_ID.get(qid);
                  if (!question) return null;
                  return (
                    <QuestionCard
                      key={qid}
                      question={question}
                      answer={progress.answers[qid]}
                      onAnswer={submitAnswer}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
