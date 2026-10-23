import type { PartySession } from "@/lib/party-session";
import type { OptionId, PlayerState } from "@/types/quiz";

export async function fetchPartySession(): Promise<{
  session: PartySession;
  totalQuestions: number;
}> {
  const res = await fetch("/api/session", { cache: "no-store" });
  if (!res.ok) throw new Error("Nie udało się pobrać sesji.");
  return res.json() as Promise<{ session: PartySession; totalQuestions: number }>;
}

export async function hostSessionAction(
  hostSecret: string,
  action: "next" | "reset" | "resetAll",
): Promise<{ session: PartySession; totalQuestions: number; cleared?: boolean }> {
  const res = await fetch("/api/session", {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-host-secret": hostSecret,
    },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Akcja prowadzącego nieudana.");
  return res.json() as Promise<{ session: PartySession; totalQuestions: number }>;
}

export async function registerPlayer(
  playerId: string,
  nickname: string,
): Promise<PlayerState> {
  const res = await fetch("/api/players", {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId, nickname }),
  });
  if (!res.ok) throw new Error("Nie udało się zapisać nicku.");
  return res.json() as Promise<PlayerState>;
}

export async function syncAnswer(
  playerId: string,
  nickname: string,
  questionId: number,
  selectedOptionId: OptionId,
  answeredAt: string,
): Promise<PlayerState> {
  const res = await fetch(`/api/players/${playerId}/answers`, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nickname,
      questionId,
      selectedOptionId,
      answeredAt,
    }),
  });
  if (!res.ok) throw new Error("Nie udało się zsynchronizować odpowiedzi.");
  return res.json() as Promise<PlayerState>;
}

export async function resetPlayerOnServer(
  playerId: string,
  nickname: string,
): Promise<void> {
  const res = await fetch(`/api/players/${playerId}/reset`, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname }),
  });
  if (!res.ok) throw new Error("Nie udało się zresetować postępu na serwerze.");
}

export async function fetchLeaderboard(): Promise<PlayerState[]> {
  const res = await fetch("/api/leaderboard", { cache: "no-store" });
  if (!res.ok) throw new Error("Nie udało się pobrać tablicy.");
  const data = (await res.json()) as { players: PlayerState[] };
  return data.players;
}
