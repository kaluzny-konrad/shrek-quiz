import { Redis } from "@upstash/redis";
import { TOTAL_QUESTIONS } from "@/types/quiz";

export type PartySession = {
  currentQuestionId: number;
  updatedAt: string;
};

const SESSION_KEY = "party:session";

const globalStore = globalThis as typeof globalThis & {
  __partySession?: PartySession;
};

function redis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function defaultSession(): PartySession {
  return {
    currentQuestionId: 1,
    updatedAt: new Date().toISOString(),
  };
}

export async function getPartySession(): Promise<PartySession> {
  const client = redis();
  if (!client) {
    return globalStore.__partySession ?? defaultSession();
  }
  const session = await client.get<PartySession>(SESSION_KEY);
  return session ?? defaultSession();
}

export async function setPartySession(session: PartySession): Promise<void> {
  const client = redis();
  if (!client) {
    globalStore.__partySession = session;
    return;
  }
  await client.set(SESSION_KEY, session);
}

export async function advancePartySession(): Promise<PartySession> {
  const session = await getPartySession();
  const nextId = Math.min(session.currentQuestionId + 1, TOTAL_QUESTIONS + 1);
  const updated: PartySession = {
    currentQuestionId: nextId,
    updatedAt: new Date().toISOString(),
  };
  await setPartySession(updated);
  return updated;
}

export async function resetPartySession(): Promise<PartySession> {
  const updated = defaultSession();
  await setPartySession(updated);
  return updated;
}

export { isQuizFinished } from "@/lib/quiz";
