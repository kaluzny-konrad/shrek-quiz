import { TOTAL_QUESTIONS } from "@/types/quiz";
import type { PlayerState } from "@/types/quiz";

type Props = {
  player: PlayerState;
};

export function AnswerHeatmap({ player }: Props) {
  const cells = [];
  for (let id = 1; id <= TOTAL_QUESTIONS; id++) {
    const a = player.answers[id];
    let className = "bg-stone-200 text-stone-500";
    let title = `Pytanie ${id}: brak odpowiedzi`;
    if (a) {
      className = a.correct
        ? "bg-emerald-500 text-white"
        : "bg-red-400 text-white";
      title = `Pytanie ${id}: ${a.correct ? "dobrze" : "źle"} (+${a.pointsEarned})`;
    }
    cells.push(
      <div
        key={id}
        title={title}
        className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-medium ${className}`}
      >
        {id}
      </div>,
    );
  }

  return (
    <div className="flex flex-wrap gap-1 pt-2" aria-label="Mapa odpowiedzi">
      {cells}
    </div>
  );
}
