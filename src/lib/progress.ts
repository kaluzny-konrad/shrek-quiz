import {
  MAX_SCORE,
  PROGRESS_STORAGE_KEY,
  TOTAL_QUESTIONS,
  type QuizProgress,
  type QuestionAnswerRecord,
} from "@/types/quiz";
import { computeTotals } from "@/lib/quiz";

export function createEmptyProgress(playerId: string, nickname: string): QuizProgress {
  return {
    version: 1,
    playerId,
    nickname,
    answers: {},
  };
}

let snapshotRaw: string | null | undefined;
let snapshotProgress: QuizProgress | null = null;

function invalidateSnapshot(): void {
  snapshotRaw = undefined;
}

export function loadProgress(): QuizProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw === snapshotRaw) {
      return snapshotProgress;
    }
    snapshotRaw = raw;
    if (!raw) {
      snapshotProgress = null;
      return null;
    }
    const parsed = JSON.parse(raw) as QuizProgress;
    if (parsed.version !== 1 || !parsed.playerId) {
      snapshotProgress = null;
      return null;
    }
    snapshotProgress = parsed;
    return parsed;
  } catch {
    snapshotProgress = null;
    return null;
  }
}

const progressListeners = new Set<() => void>();

export function subscribeProgress(onStoreChange: () => void): () => void {
  progressListeners.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === PROGRESS_STORAGE_KEY) {
      invalidateSnapshot();
      onStoreChange();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    progressListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function notifyProgressListeners(): void {
  progressListeners.forEach((listener) => listener());
}

export function saveProgress(progress: QuizProgress): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(progress);
  localStorage.setItem(PROGRESS_STORAGE_KEY, raw);
  snapshotRaw = raw;
  snapshotProgress = progress;
  notifyProgressListeners();
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROGRESS_STORAGE_KEY);
  snapshotRaw = null;
  snapshotProgress = null;
  notifyProgressListeners();
}

export function getProgressTotals(progress: QuizProgress | null) {
  if (!progress) {
    return {
      score: 0,
      answeredCount: 0,
      maxScore: MAX_SCORE,
      totalQuestions: TOTAL_QUESTIONS,
    };
  }
  const { score, answeredCount } = computeTotals(progress.answers);
  return {
    score,
    answeredCount,
    maxScore: MAX_SCORE,
    totalQuestions: TOTAL_QUESTIONS,
  };
}

export function recordAnswer(
  progress: QuizProgress,
  questionId: number,
  record: QuestionAnswerRecord,
): QuizProgress {
  return {
    ...progress,
    answers: {
      ...progress.answers,
      [questionId]: record,
    },
  };
}

export function generatePlayerId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `player-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function normalizeNickname(value: string): string {
  return value.trim();
}

export function isValidNickname(nickname: string): boolean {
  const n = normalizeNickname(nickname);
  return n.length >= 2 && n.length <= 24;
}
