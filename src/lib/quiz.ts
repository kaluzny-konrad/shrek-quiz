import type { OptionId, QuizQuestion } from "@/types/quiz";
import { TOTAL_QUESTIONS } from "@/types/quiz";

export type PartySessionView = {
  currentQuestionId: number;
};

export function isQuizFinished(session: PartySessionView): boolean {
  return session.currentQuestionId > TOTAL_QUESTIONS;
}

export function seededShuffleOrder(questionId: number): OptionId[] {
  const order: OptionId[] = ["a", "b", "c", "d"];
  let seed = questionId * 2654435761;
  for (let i = order.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function getDisplayOptions(
  question: QuizQuestion,
  storedOrder?: OptionId[],
): { order: OptionId[]; optionsById: Map<OptionId, string> } {
  const order = storedOrder ?? seededShuffleOrder(question.id);
  const optionsById = new Map<OptionId, string>();
  for (const option of question.options) {
    optionsById.set(option.id, option.label);
  }
  return { order, optionsById };
}

export function gradeAnswer(
  question: QuizQuestion,
  selectedOptionId: OptionId,
): { correct: boolean; pointsEarned: number } {
  const correct = selectedOptionId === question.correctOptionId;
  return {
    correct,
    pointsEarned: correct ? question.points : 0,
  };
}

export function computeTotals(
  answers: Record<number, { pointsEarned: number }>,
): { score: number; answeredCount: number } {
  let score = 0;
  let answeredCount = 0;
  for (const record of Object.values(answers)) {
    score += record.pointsEarned;
    answeredCount += 1;
  }
  return { score, answeredCount };
}
