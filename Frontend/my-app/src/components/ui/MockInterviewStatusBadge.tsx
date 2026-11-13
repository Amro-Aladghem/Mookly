import { cn } from '@/libs/cn';
import {
  mockInterviewStatusLabels,
  mockInterviewStatusStyles,
} from '@/types/enums';

export function MockInterviewStatusBadge({
  status,
  className,
}: {
  status?: string | null;
  className?: string;
}) {
  const value = status ?? 'Scheduled';
  const label = mockInterviewStatusLabels[value] ?? value;
  const style = mockInterviewStatusStyles[value] ?? 'bg-slate-100 text-slate-600';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
