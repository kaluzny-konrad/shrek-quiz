import type { OptionId, PlayerState } from "@/types/quiz";

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
