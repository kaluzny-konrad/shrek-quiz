import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function SiteShell({ children }: Props) {
  return (
    <div className="swamp-bg flex min-h-screen flex-col">
      <header className="border-b border-emerald-900/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="group flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-lg shadow-inner"
              aria-hidden
            >
              🎃
            </span>
            <span className="font-bold text-emerald-950 group-hover:text-emerald-700">
              Quiz imprezowy
            </span>
          </Link>
          <nav className="flex gap-1 text-sm font-medium sm:gap-2">
            <Link
              href="/quiz"
              className="rounded-lg px-3 py-1.5 text-emerald-900 hover:bg-emerald-100"
            >
              Quiz
            </Link>
            <Link
              href="/host"
              className="rounded-lg px-3 py-1.5 text-emerald-900 hover:bg-emerald-100"
            >
              Prowadzący
            </Link>
            <Link
              href="/tablica"
              className="rounded-lg px-3 py-1.5 text-emerald-900 hover:bg-emerald-100"
            >
              Tablica
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-emerald-900/10 py-4 text-center text-xs text-stone-500">
        1670 · Halloween · Zwierzogród
      </footer>
    </div>
  );
}
