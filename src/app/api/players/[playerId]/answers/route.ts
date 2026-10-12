import { NextResponse } from "next/server";
import {
  getPlayer,
  mergeAnswerIntoState,
  savePlayer,
} from "@/lib/kv-store";
import type { OptionId } from "@/types/quiz";
import { QUESTIONS_BY_ID } from "@/data/questions";
import { gradeAnswer } from "@/lib/quiz";

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

  const question = QUESTIONS_BY_ID.get(questionId);
  if (!question) {
    return NextResponse.json({ error: "Nieznane pytanie." }, { status: 404 });
  }

  const { correct, pointsEarned } = gradeAnswer(question, selectedOptionId);
  const answeredAt = body.answeredAt ?? new Date().toISOString();

  const existing = await getPlayer(playerId);
  const state = mergeAnswerIntoState(existing, playerId, nickname, questionId, {
    correct,
    pointsEarned,
    answeredAt,
  });

  await savePlayer(state);
  return NextResponse.json(state);
}
