"use client";

import { useMemo } from "react";
import { OptionButton } from "@/components/OptionButton";
import { getDisplayOptions } from "@/lib/quiz";
import type { OptionId, QuestionAnswerRecord, QuizQuestion } from "@/types/quiz";

type Props = {
  question: QuizQuestion;
  answer?: QuestionAnswerRecord;
  onAnswer: (
    questionId: number,
    optionId: OptionId,
    order: OptionId[],
  ) => void;
};

export function QuestionCard({ question, answer, onAnswer }: Props) {
  const { order, optionsById } = useMemo(
    () => getDisplayOptions(question, answer?.optionOrder),
    [question, answer?.optionOrder],
  );

  const locked = Boolean(answer);

  return (
    <article
      id={`q-${question.id}`}
      className={`animate-pop-in rounded-2xl border p-4 shadow-sm transition-shadow sm:p-5 ${
        answer
          ? answer.correct
            ? "border-emerald-400 bg-white ring-2 ring-emerald-200/80"
            : "border-red-300 bg-white ring-2 ring-red-100"
          : "border-stone-200/80 bg-white/95 hover:shadow-md"
      }`}
    >
      <header className="mb-3 flex flex-wrap items-baseline gap-2">
        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-900">
          #{question.id}
        </span>
        <span className="text-xs font-medium text-stone-500">
          {question.points} pkt
        </span>
        {answer && (
          <span
            className={`ml-auto text-sm font-bold ${
              answer.correct ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {answer.correct ? `+${answer.pointsEarned} ✓` : "0 pkt ✗"}
          </span>
        )}
      </header>
      <p className="mb-4 text-base font-medium leading-relaxed text-stone-900">
        {question.prompt}
      </p>
      <div className="flex flex-col gap-2">
        {order.map((optionId) => {
          let variant: "default" | "correct" | "wrong" | "muted" = "default";
          if (answer) {
            if (optionId === question.correctOptionId) variant = "correct";
            else if (optionId === answer.selectedOptionId) variant = "wrong";
            else variant = "muted";
          }
          return (
            <OptionButton
              key={optionId}
              letter={optionId}
              label={optionsById.get(optionId) ?? ""}
              disabled={locked}
              variant={variant}
              onClick={() => onAnswer(question.id, optionId, order)}
            />
          );
        })}
      </div>
      {answer && (
        <p className="mt-4 rounded-lg bg-stone-50 px-3 py-2 text-sm leading-relaxed text-stone-700">
          <span className="font-semibold text-stone-900">Wyjaśnienie: </span>
          {question.explanation}
        </p>
      )}
    </article>
  );
}
