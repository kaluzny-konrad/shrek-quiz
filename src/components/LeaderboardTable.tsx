"use client";

import { useState } from "react";
import { AnswerHeatmap } from "@/components/AnswerHeatmap";
import { MAX_SCORE, TOTAL_QUESTIONS, type PlayerState } from "@/types/quiz";

type Props = {
  players: PlayerState[];
  currentPlayerId?: string;
};

function Podium({ players }: { players: PlayerState[] }) {
  const top = players.slice(0, 3);
  if (top.length === 0) return null;
  const order = [top[1], top[0], top[2]].filter(Boolean);
  const heights = ["h-20", "h-28", "h-16"];
  const medals = ["🥈", "🥇", "🥉"];

  return (
    <div className="mb-8 flex items-end justify-center gap-3 px-2">
      {order.map((player, i) => {
        if (!player) return null;
        const rank = player === top[0] ? 1 : player === top[1] ? 2 : 3;
        return (
          <div
            key={player.playerId}
            className="flex max-w-[120px] flex-1 flex-col items-center text-center"
          >
            <span className="text-2xl">{medals[i]}</span>
            <p className="mt-1 truncate text-sm font-bold text-emerald-950">
              {player.nickname}
            </p>
            <p className="text-xs text-stone-600">
              {player.score} pkt
            </p>
            <div
              className={`mt-2 w-full rounded-t-xl bg-gradient-to-t from-emerald-700 to-emerald-500 ${heights[i]} flex items-end justify-center pb-2 text-white font-bold`}
            >
              #{rank}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LeaderboardTable({ players, currentPlayerId }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (players.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-emerald-300 bg-white/80 p-8 text-center text-stone-600">
        Jeszcze nikt nie gra — wpisz nick na stronie głównej i bądź pierwszy na
        bagnie!
      </p>
    );
  }

  return (
    <div>
      {players.length >= 2 && <Podium players={players} />}
      <ul className="space-y-2">
        {players.map((player, index) => {
          const isYou = player.playerId === currentPlayerId;
          const open = expanded === player.playerId;
          return (
            <li
              key={player.playerId}
              className={`rounded-xl border bg-white/95 shadow-sm ${
                isYou
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-stone-200"
              }`}
            >
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
                onClick={() =>
                  setExpanded(open ? null : player.playerId)
                }
              >
                <span className="w-8 shrink-0 text-sm font-bold text-stone-400">
                  {index + 1}.
                </span>
                <span className="min-w-0 flex-1 font-semibold text-stone-900">
                  {player.nickname}
                  {isYou && (
                    <span className="ml-2 text-xs font-normal text-emerald-700">
                      (Ty)
                    </span>
                  )}
                </span>
                <span className="text-sm font-medium text-emerald-800">
                  {player.score}/{MAX_SCORE}
                </span>
                <span className="text-sm text-stone-500">
                  {player.answeredCount}/{TOTAL_QUESTIONS}
                </span>
              </button>
              {open && (
                <div className="border-t border-stone-100 px-4 pb-4">
                  <p className="pt-2 text-xs text-stone-500">
                    Ostatnia aktywność:{" "}
                    {new Date(player.updatedAt).toLocaleString("pl-PL")}
                  </p>
                  <AnswerHeatmap player={player} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
