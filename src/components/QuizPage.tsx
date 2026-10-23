"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { LiveLeaderboard } from "@/components/LiveLeaderboard";
import { QuestionCard } from "@/components/QuestionCard";
import { QuizCompleteBanner } from "@/components/QuizCompleteBanner";
import { StickyScoreBar } from "@/components/StickyScoreBar";
import { QUESTIONS_BY_ID } from "@/data/questions";
import { getProgressTotals } from "@/lib/progress";
import { isQuizFinished } from "@/lib/quiz";
import { usePartySession } from "@/hooks/usePartySession";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { useState } from "react";

export function QuizPage() {
  const router = useRouter();
  const { progress, hydrated, syncError, submitAnswer } = useQuizProgress();
  const { session, totalQuestions, error: sessionError } = usePartySession();
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const totals = useMemo(() => getProgressTotals(progress), [progress]);

  useEffect(() => {
    if (!hydrated) return;
    if (!progress?.nickname) {
      router.replace("/");
    }
  }, [hydrated, progress?.nickname, router]);

  if (!hydrated || !progress?.nickname || !session) {
    return (
      <p className="p-8 text-center text-stone-600">Łączenie z quizem…</p>
    );
  }

  const finished = isQuizFinished(session);
  const currentId = session.currentQuestionId;
  const question = QUESTIONS_BY_ID.get(currentId);
  const currentAnswer = progress.answers[currentId];
  const allDone = totals.answeredCount >= totalQuestions;

  return (
    <>
      <StickyScoreBar
        nickname={progress.nickname}
        score={totals.score}
        answeredCount={totals.answeredCount}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        currentQuestion={finished ? totalQuestions : currentId}
        totalQuestions={totalQuestions}
      />
      <LeaderboardModal
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] lg:items-start lg:gap-8">
        <div className="min-w-0">
          {(syncError || sessionError) && (
            <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {syncError ?? sessionError}
            </p>
          )}

          <p className="mb-4 text-center text-sm font-medium text-emerald-900 lg:text-left">
            {finished
              ? "Quiz zakończony — wyniki na tablicy."
              : `Wszyscy widzą to samo pytanie ${currentId} / ${totalQuestions}. Czekaj na prowadzącego po odpowiedzi.`}
          </p>

          {allDone && (
            <QuizCompleteBanner
              score={totals.score}
              nickname={progress.nickname}
            />
          )}

          {!finished && question && !currentAnswer && (
            <QuestionCard
              question={question}
              answer={undefined}
              onAnswer={submitAnswer}
            />
          )}

          {!finished && question && currentAnswer && (
            <div className="space-y-4">
              <QuestionCard
                question={question}
                answer={currentAnswer}
                onAnswer={submitAnswer}
              />
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-900">
                Odpowiedź wysłana — czekaj, aż prowadzący przejdzie do następnego
                pytania.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setLeaderboardOpen(true)}
            className="mt-4 w-full rounded-full bg-emerald-800 px-4 py-2 text-sm font-medium text-white lg:hidden"
          >
            📊 Tablica
          </button>
        </div>

        <aside
          className="hidden lg:block lg:sticky lg:top-[7.5rem] lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-emerald-900/10 lg:bg-white/90 lg:p-4 lg:shadow-md"
          aria-label="Tablica wyników"
        >
          <LiveLeaderboard compact showHeader />
        </aside>
      </div>
    </>
  );
}
