import { useMemo, useState } from 'react';
import { ClipboardList, PlusCircle } from 'lucide-react';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { InterviewCard } from '@/components/interview/InterviewCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useUser } from '@/contexts/UserContext';
import { useAsyncData } from '@/hooks/useAsyncData';
import { cn } from '@/libs/cn';
import { NavLink } from 'react-router-dom';
import mooklyService from '@/services/mooklyService';

const filters = [
  { key: 'all', label: 'الكل' },
  { key: 'active', label: 'قيد المتابعة' },
  { key: 'completed', label: 'مكتملة' },
] as const;

type FilterKey = (typeof filters)[number]['key'];

export function HistoryView() {
  const { userId } = useUser();
  const safeUserId = userId ?? '';
  const [filter, setFilter] = useState<FilterKey>('all');

  const interviews = useAsyncData(
    () => mooklyService.getMockInterviewsByUserId(safeUserId),
    [safeUserId],
  );

  const filtered = useMemo(() => {
    const data = interviews.data ?? [];
    if (filter === 'completed') return data.filter((item) => item.status === 'Completed');
    if (filter === 'active') return data.filter((item) => item.status !== 'Completed' && item.status !== 'Cancelled');
    return data;
  }, [interviews.data, filter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <SectionHeading
        title="المقابلات السابقة"
        hint="راجع مقابلاتك، تابع ما لم يكتمل، واطّلع على النتائج."
        action={
          <NavLink
            to="/create-interview"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <PlusCircle size={16} />
            مقابلة جديدة
          </NavLink>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
              filter === item.key
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-surface text-muted hover:text-ink',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {interviews.loading && <LoadingState label="جارٍ تحميل المقابلات…" />}
      {!interviews.loading && interviews.error && (
        <ErrorState message={interviews.error} onRetry={interviews.reload} />
      )}
      {!interviews.loading && !interviews.error && filtered.length === 0 && (
        <EmptyState
          icon={<ClipboardList size={22} />}
          title="لا توجد مقابلات هنا"
          description="ابدأ مقابلة جديدة لتظهر في سجلك وتستطيع متابعتها لاحقاً."
          action={
            <NavLink
              to="/create-interview"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white"
            >
              <PlusCircle size={16} />
              إنشاء مقابلة
            </NavLink>
          }
        />
      )}
      {!interviews.loading && !interviews.error && filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((interview) => (
            <InterviewCard key={interview.id ?? interview.chatSignture} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}
