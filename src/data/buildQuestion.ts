import type { OptionId, QuizQuestion, RoundId } from "@/types/quiz";

const OPTION_IDS: OptionId[] = ["a", "b", "c", "d"];

export function buildQuestion(
  id: number,
  round: RoundId,
  roundTitle: string,
  points: number,
  prompt: string,
  correct: string,
  distractors: [string, string, string],
  explanation: string,
  correctSlot: OptionId = "a",
): QuizQuestion {
  const labels = [...distractors];
  const slotIndex = OPTION_IDS.indexOf(correctSlot);
  labels.splice(slotIndex, 0, correct);

  const options = OPTION_IDS.map((optionId, index) => ({
    id: optionId,
    label: labels[index],
  }));

  return {
    id,
    round,
    roundTitle,
    points,
    prompt,
    options,
    correctOptionId: correctSlot,
    explanation,
  };
}
