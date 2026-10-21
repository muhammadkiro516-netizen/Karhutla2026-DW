interface SourceTagProps {
  source: string;
  time: string;
  tz: string;
}

export function SourceTag({ source, time, tz }: SourceTagProps) {
  return (
    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
      {source} • {time} {tz}
    </p>
  );
}
