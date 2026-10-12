import { NextResponse } from "next/server";
import { getPlayer, resetPlayerAnswers } from "@/lib/kv-store";

export async function POST(
  request: Request,
  context: { params: Promise<{ playerId: string }> },
) {
  const { playerId } = await context.params;
  const body = (await request.json()) as { nickname?: string };
  const existing = await getPlayer(playerId);
  const nickname =
    body.nickname?.trim() || existing?.nickname || "Gracz";

  const state = await resetPlayerAnswers(playerId, nickname);
  return NextResponse.json(state);
}
