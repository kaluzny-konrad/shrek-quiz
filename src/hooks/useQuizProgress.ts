"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { QUESTIONS_BY_ID } from "@/data/questions";
import { registerPlayer, resetPlayerOnServer, syncAnswer } from "@/lib/api";
import { gradeAnswer } from "@/lib/quiz";
import {
  clearProgress,
  createEmptyProgress,
  generatePlayerId,
  isValidNickname,
  loadProgress,
  normalizeNickname,
  recordAnswer,
  saveProgress,
  subscribeProgress,
} from "@/lib/progress";
import type { OptionId, QuizProgress } from "@/types/quiz";

function getServerSnapshot(): QuizProgress | null {
  return null;
}

export function useQuizProgress() {
  const progress = useSyncExternalStore(
    subscribeProgress,
    loadProgress,
    getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  const ensurePlayer = useCallback(async (nickname: string) => {
    const nick = normalizeNickname(nickname);
    if (!isValidNickname(nick)) return null;

    let current = loadProgress();
    if (!current) {
      current = createEmptyProgress(generatePlayerId(), nick);
    } else {
      current = { ...current, nickname: nick };
    }
    saveProgress(current);
    try {
      await registerPlayer(current.playerId, nick);
      setSyncError(null);
    } catch {
      setSyncError("Nick nie zsynchronizowany z serwerem (offline?).");
    }
    return current;
  }, []);

  const submitAnswer = useCallback(
    async (
      questionId: number,
      selectedOptionId: OptionId,
      optionOrder: OptionId[],
    ) => {
      const current = loadProgress();
      if (!current) return;
      if (current.answers[questionId]) return;

      const question = QUESTIONS_BY_ID.get(questionId);
      if (!question) return;

      const { correct, pointsEarned } = gradeAnswer(question, selectedOptionId);
      const answeredAt = new Date().toISOString();

      const next = recordAnswer(current, questionId, {
        selectedOptionId,
        correct,
        pointsEarned,
        optionOrder,
        answeredAt,
      });
      saveProgress(next);

      try {
        await syncAnswer(
          next.playerId,
          next.nickname,
          questionId,
          selectedOptionId,
          answeredAt,
        );
        setSyncError(null);
      } catch {
        setSyncError("Odpowiedź zapisana lokalnie — sync z serwerem nieudany.");
      }
    },
    [],
  );

  const resetAll = useCallback(async () => {
    const current = loadProgress();
    if (current) {
      try {
        await resetPlayerOnServer(current.playerId, current.nickname);
      } catch {
        /* local reset still applies */
      }
      const fresh = createEmptyProgress(current.playerId, current.nickname);
      saveProgress(fresh);
    } else {
      clearProgress();
    }
    setSyncError(null);
  }, []);

  const startFreshIdentity = useCallback(
    async (nickname: string) => {
      clearProgress();
      return ensurePlayer(nickname);
    },
    [ensurePlayer],
  );

  return {
    progress,
    hydrated,
    syncError,
    ensurePlayer,
    submitAnswer,
    resetAll,
    startFreshIdentity,
  };
}
