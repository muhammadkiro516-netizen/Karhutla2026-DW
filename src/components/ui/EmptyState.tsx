interface EmptyStateProps {
  message: string;
  icon?: string;
}

export function EmptyState({ message, icon = "🌿" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500">
      <span className="text-4xl mb-2">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
