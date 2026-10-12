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
    title: "Shrek (2001) — podstawy",
    pointsPerQuestion: 1,
    questionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    id: 2,
    title: "Cytaty i dialogi",
    pointsPerQuestion: 2,
    questionIds: [10, 11, 12, 13, 14, 15],
  },
  {
    id: 3,
    title: "Muzyka",
    pointsPerQuestion: 2,
    questionIds: [16, 17, 18, 19],
  },
  {
    id: 4,
    title: "Głosy (EN + PL)",
    pointsPerQuestion: 2,
    questionIds: [20, 21, 22, 23],
  },
  {
    id: 5,
    title: "Sequels i Kot w butach",
    pointsPerQuestion: 2,
    questionIds: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
  },
  {
    id: 6,
    title: "Kulisy (tylko z quizów)",
    pointsPerQuestion: 3,
    questionIds: [35, 36, 37],
  },
  {
    id: 7,
    title: "Detale z filmu",
    pointsPerQuestion: 2,
    questionIds: [38, 39],
  },
  {
    id: 8,
    title: "Blitz",
    pointsPerQuestion: 1,
    questionIds: [40, 41, 42, 43],
  },
];
