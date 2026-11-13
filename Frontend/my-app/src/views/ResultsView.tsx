import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Markdown } from '@/components/ui/Markdown';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useUser } from '@/contexts/UserContext';
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatDate, formatScore } from '@/libs/format';
import { NavLink, useParams } from 'react-router-dom';
import mooklyService from '@/services/mooklyService';

const sections = [
  {
    key: 'summary',
    title: 'الملخص',
    icon: Sparkles,
    field: 'summary' as const,
  },
  {
    key: 'strengths',
    title: 'نقاط القوة',
    icon: CheckCircle2,
    field: 'strengths' as const,
  },
  {
    key: 'improvements',
    title: 'فرص التحسين',
    icon: Target,
    field: 'areasForImprovement' as const,
  },
  {
    key: 'recommendations',
    title: 'التوصيات',
    icon: Lightbulb,
    field: 'recommendations' as const,
  },
];

export function ResultsView() {
  const { mockInterviewId = '' } = useParams<{ mockInterviewId: string }>();
  const { userId } = useUser();
  const safeUserId = userId ?? '';

  const result = useAsyncData(
    () => mooklyService.getMockInterviewResult(safeUserId, mockInterviewId),
    [safeUserId, mockInterviewId],
  );

  if (result.loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <LoadingState label="جارٍ تحميل نتيجة المقابلة…" />
      </div>
    );
  }

  if (result.error || !result.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          icon={<Award size={22} />}
          title="لم تصدر نتيجة هذه المقابلة بعد"
          description="أكمل المقابلة مع المدرب الذكي أولاً، ثم عد إلى هذه الصفحة لعرض التقرير التفصيلي."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={result.reload}>
                <RotateCcw size={14} />
                إعادة المحاولة
              </Button>
              <NavLink
                to="/history"
                className="inline-flex h-9 items-center rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink"
              >
                سجل المقابلات
              </NavLink>
            </div>
          }
        />
      </div>
    );
  }

  const data = result.data;
  const score = Math.max(0, Math.min(100, data.overallScore));
  const scoreColor =
    score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-danger';

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <NavLink
            to="/history"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted"
          >
            <ArrowRight size={14} />
            سجل المقابلات
          </NavLink>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            نتيجة المقابلة
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
            <CalendarDays size={13} />
            {formatDate(data.createdAt)}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary-dark">
          <Award size={14} />
          تقرير المدرب الذكي
        </span>
      </div>

      <section className="grid gap-5 rounded-3xl border border-line bg-surface p-5 sm:p-7 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex justify-center">
          <div
            className="relative flex h-36 w-36 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(var(--color-primary) ${score}%, var(--color-line) ${
                score
              }% 100%)`,
            }}
          >
            <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-surface">
              <span className={`text-3xl font-bold ${scoreColor}`}>
                {Math.round(score)}
              </span>
              <span className="mt-0.5 text-[11px] text-muted">من 100</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-ink">تقييمك العام</h2>
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary-dark">
              {formatScore(score)}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-8 text-muted">
            {score >= 80
              ? 'أداء ممتاز! استمر في التحسن وحافظ على هذا المستوى.'
              : score >= 60
                ? 'أداء جيد، مع بعض النقاط التي يمكن تحسينها قبل المقابلة القادمة.'
                : 'تحتاج إلى مزيد من التدريب. راجع الملاحظات أدناه وابدأ مقابلة جديدة.'}
          </p>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${score}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <NavLink
              to="/create-interview"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <TrendingUp size={16} />
              مقابلة جديدة
            </NavLink>
            <NavLink
              to="/"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-primary/40"
            >
              الرئيسية
            </NavLink>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const value = data[section.field];

          return (
            <section
              key={section.key}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
                  <Icon size={17} />
                </span>
                <h2 className="text-base font-semibold text-ink">{section.title}</h2>
              </div>
              {value ? (
                <Markdown text={value} className="text-sm leading-8 text-ink" />
              ) : (
                <p className="text-sm text-muted">لا توجد ملاحظات في هذا القسم.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
