import type { ReactNode } from 'react';
import { cn } from '@/libs/cn';

interface SectionHeadingProps {
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({ title, hint, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}
