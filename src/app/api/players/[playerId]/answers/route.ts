import { NextResponse } from "next/server";
import {
  getPlayer,
  mergeAnswerIntoState,
  savePlayer,
} from "@/lib/kv-store";
import type { OptionId } from "@/types/quiz";
import { QUESTIONS_BY_ID } from "@/data/questions";
import { gradeAnswer } from "@/lib/quiz";
import { getPartySession, isQuizFinished } from "@/lib/party-session";

export async function POST(
  request: Request,
  context: { params: Promise<{ playerId: string }> },
) {
  const { playerId } = await context.params;
  const body = (await request.json()) as {
    nickname?: string;
    questionId?: number;
    selectedOptionId?: OptionId;
    answeredAt?: string;
  };

  const nickname = body.nickname?.trim() ?? "";
  if (nickname.length < 2 || nickname.length > 24) {
    return NextResponse.json({ error: "Nieprawidłowy nickname." }, { status: 400 });
  }

  const questionId = body.questionId;
  const selectedOptionId = body.selectedOptionId;
  if (!questionId || !selectedOptionId) {
    return NextResponse.json({ error: "Brak pytania lub odpowiedzi." }, { status: 400 });
  }

  const session = await getPartySession();
  if (isQuizFinished(session)) {
    return NextResponse.json({ error: "Quiz zakończony." }, { status: 400 });
  }
  if (questionId !== session.currentQuestionId) {
    return NextResponse.json(
      { error: "To nie jest aktualne pytanie na ekranie." },
      { status: 409 },
    );
  }

  const question = QUESTIONS_BY_ID.get(questionId);
  if (!question) {
    return NextResponse.json({ error: "Nieznane pytanie." }, { status: 404 });
  }

  const existing = await getPlayer(playerId);
  if (existing?.answers[questionId]) {
    return NextResponse.json({ error: "Już odpowiedziałeś na to pytanie." }, { status: 409 });
  }

  const { correct, pointsEarned } = gradeAnswer(question, selectedOptionId);
  const answeredAt = body.answeredAt ?? new Date().toISOString();

  const state = mergeAnswerIntoState(existing, playerId, nickname, questionId, {
    correct,
    pointsEarned,
    answeredAt,
  });

  await savePlayer(state);
  return NextResponse.json(state);
}
