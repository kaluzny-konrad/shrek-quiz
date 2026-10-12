import { NextResponse } from "next/server";
import { getPlayer, savePlayer } from "@/lib/kv-store";
import type { PlayerState } from "@/types/quiz";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    playerId?: string;
    nickname?: string;
  };

  const nickname = body.nickname?.trim() ?? "";
  if (nickname.length < 2 || nickname.length > 24) {
    return NextResponse.json(
      { error: "Nickname musi mieć 2–24 znaki." },
      { status: 400 },
    );
  }

  const playerId = body.playerId?.trim();
  if (!playerId) {
    return NextResponse.json({ error: "Brak playerId." }, { status: 400 });
  }

  const existing = await getPlayer(playerId);
  const state: PlayerState = existing
    ? { ...existing, nickname, updatedAt: new Date().toISOString() }
    : {
        playerId,
        nickname,
        score: 0,
        answeredCount: 0,
        answers: {},
        updatedAt: new Date().toISOString(),
      };

  await savePlayer(state);
  return NextResponse.json(state);
}
