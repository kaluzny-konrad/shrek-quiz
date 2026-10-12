"use client";

import type { OptionId } from "@/types/quiz";

type Props = {
  letter: OptionId;
  label: string;
  disabled?: boolean;
  variant?: "default" | "correct" | "wrong" | "muted";
  onClick?: () => void;
};

const variantClass: Record<NonNullable<Props["variant"]>, string> = {
  default:
    "border-emerald-800/40 bg-white hover:border-emerald-600 hover:bg-emerald-50",
  correct: "border-emerald-600 bg-emerald-100 text-emerald-950",
  wrong: "border-red-500 bg-red-50 text-red-950",
  muted: "border-stone-200 bg-stone-50 text-stone-600",
};

export function OptionButton({
  letter,
  label,
  disabled,
  variant = "default",
  onClick,
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base ${variantClass[variant]}`}
    >
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold uppercase text-white"
        aria-hidden
      >
        {letter}
      </span>
      <span>{label}</span>
    </button>
  );
}
