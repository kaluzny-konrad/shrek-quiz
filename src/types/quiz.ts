export type RoundId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type OptionId = "a" | "b" | "c" | "d";

export type McqOption = {
  id: OptionId;
  label: string;
};

export type QuizQuestion = {
  id: number;
  round: RoundId;
  roundTitle: string;
  points: number;
  prompt: string;
  options: McqOption[];
  correctOptionId: OptionId;
  explanation: string;
};

export type QuestionAnswerRecord = {
  selectedOptionId: OptionId;
  correct: boolean;
  pointsEarned: number;
  optionOrder: OptionId[];
  answeredAt: string;
};

export type QuizProgress = {
  version: 1;
  playerId: string;
  nickname: string;
  answers: Record<number, QuestionAnswerRecord>;
};

export type PlayerAnswerSummary = {
  correct: boolean;
  pointsEarned: number;
  answeredAt: string;
};

export type PlayerState = {
  playerId: string;
  nickname: string;
  score: number;
  answeredCount: number;
  answers: Record<number, PlayerAnswerSummary>;
  updatedAt: string;
};

export const TOTAL_QUESTIONS = 43;
export const MAX_SCORE = 76;
export const PROGRESS_STORAGE_KEY = "shrek-quiz-progress-v1";
