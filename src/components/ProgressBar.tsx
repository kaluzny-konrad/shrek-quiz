type Props = {
  value: number;
  max: number;
  label?: string;
};

export function ProgressBar({ value, max, label }: Props) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-xs text-emerald-200/90">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className="h-2 overflow-hidden rounded-full bg-emerald-950/50"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="progress-shine h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
