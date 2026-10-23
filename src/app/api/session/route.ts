import { connection } from "next/server";
import { NextResponse } from "next/server";
import {
  advancePartySession,
  getPartySession,
  resetPartySession,
} from "@/lib/party-session";
import { clearAllPlayers } from "@/lib/kv-store";
import { TOTAL_QUESTIONS } from "@/types/quiz";

function checkHost(request: Request): boolean {
  const secret = process.env.HOST_SECRET ?? "impreza";
  const header = request.headers.get("x-host-secret");
  const url = new URL(request.url);
  const query = url.searchParams.get("key");
  return header === secret || query === secret;
}

export async function GET() {
  await connection();
  const session = await getPartySession();
  return NextResponse.json(
    { session, totalQuestions: TOTAL_QUESTIONS },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  await connection();
  if (!checkHost(request)) {
    return NextResponse.json({ error: "Brak uprawnień prowadzącego." }, { status: 403 });
  }
  const body = (await request.json()) as {
    action?: "next" | "reset" | "resetAll";
  };
  if (body.action === "resetAll") {
    await clearAllPlayers();
    const session = await resetPartySession();
    return NextResponse.json({
      session,
      totalQuestions: TOTAL_QUESTIONS,
      cleared: true,
    });
  }
  if (body.action === "reset") {
    const session = await resetPartySession();
    return NextResponse.json({ session, totalQuestions: TOTAL_QUESTIONS });
  }
  const session = await advancePartySession();
  return NextResponse.json({ session, totalQuestions: TOTAL_QUESTIONS });
}
