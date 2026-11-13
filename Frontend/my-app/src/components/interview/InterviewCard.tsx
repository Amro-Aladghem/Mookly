import { ArrowLeft, CalendarDays, ClipboardList, PlayCircle } from 'lucide-react';
import { MockInterviewStatusBadge } from '@/components/ui/MockInterviewStatusBadge';
import { formatDate } from '@/libs/format';
import { cn } from '@/libs/cn';
import { NavLink } from 'react-router-dom';
import type { GetMockInterviewDto } from '@/types/mockInterview';

interface InterviewCardProps {
  interview: GetMockInterviewDto;
  className?: string;
}

export function InterviewCard({ interview, className }: InterviewCardProps) {
  const isCompleted = interview.status === 'Completed';
  const target = isCompleted
    ? `/results/${interview.id ?? ''}`
    : `/interview/${interview.chatSignture}`;

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-ink">
            {interview.mockInterviewType}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {[interview.jobType, interview.jobLevel].filter(Boolean).join(' · ') ||
              'مقابلة تدريبية'}
          </p>
        </div>
        <MockInterviewStatusBadge status={interview.status} />
      </div>

      <p className="line-clamp-2 text-sm leading-7 text-muted">{interview.about}</p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={13} />
          {formatDate(interview.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1">
          <ClipboardList size={13} />
          {interview.jobType ?? 'عام'}
        </span>
      </div>

      <NavLink
        to={target}
        className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        {isCompleted ? (
          <>
            عرض النتيجة
            <ArrowLeft size={16} />
          </>
        ) : (
          <>
            <PlayCircle size={16} />
            متابعة المقابلة
          </>
        )}
      </NavLink>
    </article>
  );
}
