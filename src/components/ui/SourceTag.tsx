interface SourceTagProps { source: string; time: string; tz: string }

export function SourceTag({ source, time, tz }: SourceTagProps) {
  return (
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
      {source} • {time} {tz}
    </p>
  );
}
