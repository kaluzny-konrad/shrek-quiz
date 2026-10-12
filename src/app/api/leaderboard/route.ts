import { connection } from "next/server";
import { NextResponse } from "next/server";
import { listPlayers } from "@/lib/kv-store";
import type { PlayerState } from "@/types/quiz";

function sortPlayers(players: PlayerState[]): PlayerState[] {
  return [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.answeredCount !== a.answeredCount) {
      return b.answeredCount - a.answeredCount;
    }
    return a.nickname.localeCompare(b.nickname, "pl");
  });
}

export async function GET() {
  await connection();
  const players = sortPlayers(await listPlayers());
  return NextResponse.json(
    { players },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
