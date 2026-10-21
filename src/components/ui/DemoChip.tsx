import { id } from "@/i18n/id";

export function DemoChip() {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
      {id.ui.demoChip}
    </span>
  );
}
