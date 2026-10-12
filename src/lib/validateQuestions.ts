import { QUESTIONS } from "@/data/questions";
import { MAX_SCORE, TOTAL_QUESTIONS } from "@/types/quiz";

export function validateQuestions(): void {
  if (QUESTIONS.length !== TOTAL_QUESTIONS) {
    throw new Error(
      `Expected ${TOTAL_QUESTIONS} questions, got ${QUESTIONS.length}`,
    );
  }

  let pointSum = 0;
  const ids = new Set<number>();

  for (const q of QUESTIONS) {
    if (ids.has(q.id)) throw new Error(`Duplicate question id ${q.id}`);
    ids.add(q.id);
    pointSum += q.points;

    if (q.options.length !== 4) {
      throw new Error(`Question ${q.id} must have 4 options`);
    }
    const labels = new Set(q.options.map((o) => o.label));
    if (labels.size !== 4) {
      throw new Error(`Question ${q.id} has duplicate option labels`);
    }
    if (!q.options.some((o) => o.id === q.correctOptionId)) {
      throw new Error(`Question ${q.id} correctOptionId missing in options`);
    }
  }

  if (pointSum !== MAX_SCORE) {
    throw new Error(`Expected max score ${MAX_SCORE}, got ${pointSum}`);
  }
}

validateQuestions();
