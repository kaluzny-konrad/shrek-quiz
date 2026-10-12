import { Redis } from "@upstash/redis";
import type { PlayerState } from "@/types/quiz";

const PLAYER_PREFIX = "player:";
const PLAYERS_INDEX_KEY = "players:index";

type MemoryStore = {
  players: Map<string, PlayerState>;
  index: string[];
};

const globalStore = globalThis as typeof globalThis & {
  __shrekQuizMemory?: MemoryStore;
};

function memory(): MemoryStore {
  if (!globalStore.__shrekQuizMemory) {
    globalStore.__shrekQuizMemory = { players: new Map(), index: [] };
  }
  return globalStore.__shrekQuizMemory;
}

function redis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function getPlayer(playerId: string): Promise<PlayerState | null> {
  const client = redis();
  if (!client) {
    return memory().players.get(playerId) ?? null;
  }
  return (await client.get<PlayerState>(`${PLAYER_PREFIX}${playerId}`)) ?? null;
}

export async function savePlayer(state: PlayerState): Promise<void> {
  const client = redis();
  if (!client) {
    const mem = memory();
    mem.players.set(state.playerId, state);
    if (!mem.index.includes(state.playerId)) {
      mem.index.push(state.playerId);
    }
    return;
  }
  await client.set(`${PLAYER_PREFIX}${state.playerId}`, state);
  await client.sadd(PLAYERS_INDEX_KEY, state.playerId);
}

export async function listPlayers(): Promise<PlayerState[]> {
  const client = redis();
  if (!client) {
    const mem = memory();
    return mem.index
      .map((id) => mem.players.get(id))
      .filter((p): p is PlayerState => p != null);
  }
  const ids = await client.smembers<string[]>(PLAYERS_INDEX_KEY);
  if (!ids?.length) return [];
  const keys = ids.map((id) => `${PLAYER_PREFIX}${id}`);
  const players = await client.mget<PlayerState[]>(...keys);
  return (players ?? []).filter((p): p is PlayerState => p != null);
}

export async function resetPlayerAnswers(
  playerId: string,
  nickname: string,
): Promise<PlayerState> {
  const state: PlayerState = {
    playerId,
    nickname,
    score: 0,
    answeredCount: 0,
    answers: {},
    updatedAt: new Date().toISOString(),
  };
  await savePlayer(state);
  return state;
}

export function mergeAnswerIntoState(
  existing: PlayerState | null,
  playerId: string,
  nickname: string,
  questionId: number,
  answer: {
    correct: boolean;
    pointsEarned: number;
    answeredAt: string;
  },
): PlayerState {
  const base: PlayerState =
    existing ?? {
      playerId,
      nickname,
      score: 0,
      answeredCount: 0,
      answers: {},
      updatedAt: new Date().toISOString(),
    };

  const answers = { ...base.answers, [questionId]: answer };
  let score = 0;
  for (const a of Object.values(answers)) {
    score += a.pointsEarned;
  }
  return {
    ...base,
    nickname,
    answers,
    score,
    answeredCount: Object.keys(answers).length,
    updatedAt: new Date().toISOString(),
  };
}
