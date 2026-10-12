import { MAX_SCORE } from "@/types/quiz";

type Props = {
  score: number;
  nickname: string;
};

export function QuizCompleteBanner({ score, nickname }: Props) {
  const pct = Math.round((score / MAX_SCORE) * 100);
  let message = "Nieźle — jeszcze kilka warstw do zgłębienia!";
  if (pct >= 90) message = "Legenda bagna! Farquaad by płakał.";
  else if (pct >= 70) message = "Solidny ogr — Fiona by była dumna.";
  else if (pct >= 50) message = "Cebula ma warstwy, Ty też — idź po więcej punktów!";

  return (
    <div className="animate-pop-in mb-8 rounded-2xl border-2 border-[var(--swamp-gold)] bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-center text-white shadow-xl">
      <p className="text-3xl" aria-hidden>🏆</p>
      <h2 className="mt-2 text-xl font-bold">Gratulacje, {nickname}!</h2>
      <p className="mt-1 text-emerald-100">
        Masz <strong className="text-[var(--swamp-gold)]">{score}</strong> / {MAX_SCORE}{" "}
        pkt ({pct}%)
      </p>
      <p className="mt-3 text-sm text-emerald-200">{message}</p>
      <p className="mt-4 text-sm text-emerald-200">
        Sprawdź tablicę po prawej (desktop) lub przycisk „Tablica” na telefonie.
      </p>
    </div>
  );
}
