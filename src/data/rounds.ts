import type { RoundId } from "@/types/quiz";

export type RoundMeta = {
  id: RoundId;
  title: string;
  pointsPerQuestion: number;
  questionIds: number[];
};

export const ROUNDS: RoundMeta[] = [
  {
    id: 1,
    title: "1670 (serial)",
    pointsPerQuestion: 1,
    questionIds: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 2,
    title: "Halloween",
    pointsPerQuestion: 1,
    questionIds: [7, 8, 9, 10, 11, 12],
  },
  {
    id: 3,
    title: "Zwierzogród",
    pointsPerQuestion: 1,
    questionIds: [13, 14, 15, 16, 17, 18],
  },
];
