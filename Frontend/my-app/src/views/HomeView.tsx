import { ArrowLeft, ClipboardList, PlusCircle, Sparkles, Trophy, UserRound } from 'lucide-react';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { InterviewCard } from '@/components/interview/InterviewCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { MockInterviewStatusBadge } from '@/components/ui/MockInterviewStatusBadge';
import { useUser } from '@/contexts/UserContext';
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatDate } from '@/libs/format';
import { NavLink } from 'react-router-dom';
import mooklyService from '@/services/mooklyService';

export function HomeView() {
  const { userId, user } = useUser();
  const safeUserId = userId ?? '';

  const lastInterview = useAsyncData(
    () => mooklyService.getLastMockInterview(safeUserId),
    [safeUserId],
  );
  const allInterviews = useAsyncData(
    () => mooklyService.getMockInterviewsByUserId(safeUserId),
    [safeUserId],
  );

  const interviews = allInterviews.data ?? [];
  const completedCount = interviews.filter((item) => item.status === 'Completed').length;
  const activeCount = interviews.filter(
    (item) => item.status !== 'Completed' && item.status !== 'Cancelled',
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="grid gap-6 px-6 py-8 sm:px-9 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-dark">
              <Sparkles size={14} />
              مرحباً {user?.firstName ?? 'بك'} في Mookly
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-snug text-ink sm:text-4xl">
              مقابلة تدريبية واحدة تفصلك عن وظيفتك القادمة
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-8 text-muted">
              تدرّب مع مدرب ذكي يطرح عليك أسئلة مخصصة، يقيّم إجاباتك، ويعطيك ملاحظات
              واضحة تساعدك على التحسن قبل المقابلة الحقيقية.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <NavLink
                to="/create-interview"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                <PlusCircle size={17} />
                إنشاء مقابلة جديدة
              </NavLink>
              <NavLink
                to="/history"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 text-sm font-medium text-ink transition-colors hover:border-primary/40"
              >
                <ClipboardList size={17} />
                المقابلات السابقة
              </NavLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'إجمالي المقابلات',
                value: interviews.length,
                icon: ClipboardList,
              },
              {
                label: 'مكتملة',
                value: completedCount,
                icon: Trophy,
              },
              {
                label: 'قيد المتابعة',
                value: activeCount,
                icon: Sparkles,
              },
              {
                label: 'نوع الوظيفة',
                value: user?.jobType ?? '—',
                icon: UserRound,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-line bg-canvas p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
                    <Icon size={17} />
                  </span>
                  <p className="mt-3 text-xl font-bold text-ink">{item.value}</p>
                  <p className="mt-1 text-[11px] text-muted">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <SectionHeading
            title="آخر مقابلة"
            hint={lastInterview.data ? 'تابع من حيث توقفت' : undefined}
            action={
              <NavLink
                to="/history"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary"
              >
                عرض الكل
                <ArrowLeft size={14} />
              </NavLink>
            }
          />

          {lastInterview.loading && <LoadingState label="جارٍ تحميل آخر مقابلة…" />}
          {!lastInterview.loading && lastInterview.data && (
            <InterviewCard interview={lastInterview.data} />
          )}
          {!lastInterview.loading && !lastInterview.data && (
            <EmptyState
              icon={<Sparkles size={22} />}
              title="لا توجد مقابلات بعد"
              description="ابدأ أول مقابلة تدريبية وستظهر هنا مع حالتها ونتائجها."
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
        </div>

        <div>
          <SectionHeading title="ملفك الشخصي" />
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-base font-bold text-primary-dark">
                {user?.firstName?.charAt(0) ?? 'م'}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'المستخدم'}
                </p>
                <p className="truncate text-xs text-muted">
                  {user?.jobType ?? '—'} · {user?.jobLevel ?? '—'}
                </p>
              </div>
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">
              {user?.about?.trim() || 'أضف نبذة عنك من صفحة ملفك الشخصي.'}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
              <span className="text-[11px] text-muted">
                عضو منذ {formatDate(user?.createdDateTime)}
              </span>
              <NavLink to="/profile" className="text-xs font-medium text-primary">
                عرض الملف
              </NavLink>
            </div>
          </div>

          {lastInterview.data && (
            <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">حالة آخر مقابلة</p>
                <MockInterviewStatusBadge status={lastInterview.data.status} />
              </div>
              <p className="mt-2 text-xs leading-6 text-muted">
                {lastInterview.data.mockInterviewType}
              </p>
              <NavLink
                to={`/interview/${lastInterview.data.chatSignture}`}
                className="mt-3 inline-flex text-xs font-medium text-primary"
              >
                فتح المحادثة
              </NavLink>
            </div>
          )}
        </div>
      </section>

      {allInterviews.error && (
        <div className="mt-8">
          <ErrorState message={allInterviews.error} onRetry={allInterviews.reload} />
        </div>
      )}

      {interviews.length > 0 && (
        <section className="mt-8">
          <SectionHeading
            title="نشاطك الأخير"
            action={
              <NavLink to="/history" className="text-xs font-medium text-primary">
                كل المقابلات
              </NavLink>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {interviews.slice(0, 3).map((interview) => (
              <InterviewCard key={interview.id ?? interview.chatSignture} interview={interview} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
