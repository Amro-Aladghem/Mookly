import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  Loader2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { SelectField, TextareaField } from '@/components/ui/FormField';
import { useUser } from '@/contexts/UserContext';
import { useAsyncData } from '@/hooks/useAsyncData';
import { cn } from '@/libs/cn';
import { makeActiveInterviewCache } from '@/libs/mockInterview';
import { writeActiveInterview, writeLastChatSignature } from '@/libs/storage';
import { NavLink, useNavigate } from 'react-router-dom';
import mooklyService from '@/services/mooklyService';
import { eChatRole } from '@/types/enums';
import type { GetMockInterviewDto } from '@/types/mockInterview';

type StepKey = 'idle' | 'chat' | 'interview' | 'finalize';

const steps: Array<{ key: StepKey; label: string }> = [
  { key: 'chat', label: 'إنشاء المحادثة' },
  { key: 'interview', label: 'إنشاء المقابلة' },
  { key: 'finalize', label: 'تجهيز المقابلة' },
];

function stepIndex(step: StepKey): number {
  if (step === 'chat') return 0;
  if (step === 'interview') return 1;
  if (step === 'finalize') return 2;
  return -1;
}

export function CreateInterviewView() {
  const { userId, user } = useUser();
  const safeUserId = userId ?? '';
  const navigate = useNavigate();

  const jobTypes = useAsyncData(() => mooklyService.getJobTypes(), []);
  const jobLevels = useAsyncData(() => mooklyService.getJobLevels(), []);
  const interviewTypes = useAsyncData(() => mooklyService.getMockInterviewTypes(), []);

  const [jobTypeId, setJobTypeId] = useState('');
  const [jobLevelId, setJobLevelId] = useState('');
  const [mockInterviewTypeId, setMockInterviewTypeId] = useState('');
  const [about, setAbout] = useState('');
  const [step, setStep] = useState<StepKey>('idle');
  const [error, setError] = useState<string | null>(null);

  const submitting = step !== 'idle';
  const lookupsLoading = jobTypes.loading || jobLevels.loading || interviewTypes.loading;
  const lookupsError = jobTypes.error || jobLevels.error || interviewTypes.error;

  const selectedJobType = jobTypes.data?.find((item) => String(item.id) === jobTypeId);
  const selectedJobLevel = jobLevels.data?.find((item) => String(item.id) === jobLevelId);
  const selectedInterviewType = interviewTypes.data?.find(
    (item) => item.id === mockInterviewTypeId,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!mockInterviewTypeId || !jobTypeId || !jobLevelId || !about.trim()) {
      setError('يرجى اختيار نوع المقابلة ونوع الوظيفة والمستوى وكتابة نبذة.');
      return;
    }

    const chatSignature = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    try {
      setStep('chat');

      const chatResult = await mooklyService.createChat(safeUserId, {
        chatSignature,
        userId: safeUserId,
        creationTime: createdAt,
        chatRoleId: eChatRole.User,
        message: '',
        data: null,
        agentType: null,
        showMessage: false,
        isFinalResponse: false,
      });

      if (!chatResult.isSuccess) {
        setError(chatResult.error);
        setStep('idle');
        return;
      }

      setStep('interview');

      const interviewResult = await mooklyService.createMockInterview(
        safeUserId,
        chatSignature,
        {
          mockInterviewTypeId,
          jobTypeId: Number(jobTypeId),
          jobLevelId: Number(jobLevelId),
          about: about.trim(),
        },
      );

      if (!interviewResult.isSuccess) {
        setError(interviewResult.error);
        setStep('idle');
        return;
      }

      setStep('finalize');

      const infoResult = await mooklyService.getMockInterviewByChatSignature(
        safeUserId,
        chatSignature,
      );

      let interviewDto: GetMockInterviewDto;

      if (infoResult.isSuccess) {
        interviewDto = infoResult.data;
      } else {
        const typeLabel = selectedInterviewType
          ? `${selectedInterviewType.title}${
              selectedInterviewType.description
                ? ` - ${selectedInterviewType.description}`
                : ''
            }`
          : 'مقابلة تدريبية';

        interviewDto = {
          id: interviewResult.data.id ?? null,
          chatSignture: chatSignature,
          userId: safeUserId,
          mockInterviewType: typeLabel,
          status: interviewResult.data.status,
          jobType: selectedJobType?.name ?? null,
          jobLevel: selectedJobLevel?.name ?? null,
          about: about.trim(),
          createdAt,
        };
      }

      const cache = makeActiveInterviewCache(interviewDto);
      writeActiveInterview(cache);
      writeLastChatSignature(chatSignature);

      navigate(`/interview/${chatSignature}`);
    } catch {
      setError('تعذّر إنشاء المقابلة. يرجى المحاولة مرة أخرى.');
      setStep('idle');
    }
  };

  const currentStep = stepIndex(step);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <NavLink to="/" className="inline-flex items-center gap-1 text-xs font-medium text-muted">
            <ArrowRight size={14} />
            العودة للرئيسية
          </NavLink>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            إنشاء مقابلة تدريبية
          </h1>
          <p className="mt-1 text-sm text-muted">
            اختر التفاصيل التي تناسبك، وسيبدأ المدرب الذكي المقابلة مباشرة.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary-dark">
          <Sparkles size={14} />
          {user?.firstName ? `مرحباً ${user.firstName}` : 'جاهز للبدء'}
        </span>
      </div>

      {lookupsLoading ? (
        <LoadingState label="جارٍ تحميل الخيارات…" />
      ) : lookupsError ? (
        <div className="rounded-2xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
          {lookupsError}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
                <ClipboardList size={17} />
              </span>
              <h2 className="text-lg font-semibold text-ink">تفاصيل المقابلة</h2>
            </div>

            <div className="flex flex-col gap-4">
              <SelectField
                label="نوع المقابلة"
                value={mockInterviewTypeId}
                onChange={(event) => setMockInterviewTypeId(event.target.value)}
                required
              >
                <option value="">اختر نوع المقابلة</option>
                {interviewTypes.data?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                    {item.description ? ` — ${item.description}` : ''}
                  </option>
                ))}
              </SelectField>

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="نوع الوظيفة"
                  value={jobTypeId}
                  onChange={(event) => setJobTypeId(event.target.value)}
                  required
                >
                  <option value="">اختر نوع الوظيفة</option>
                  {jobTypes.data?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  label="المستوى الوظيفي"
                  value={jobLevelId}
                  onChange={(event) => setJobLevelId(event.target.value)}
                  required
                >
                  <option value="">اختر المستوى</option>
                  {jobLevels.data?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </SelectField>
              </div>

              <TextareaField
                label="نبذة عن المقابلة"
                value={about}
                onChange={(event) => setAbout(event.target.value)}
                placeholder="مثال: أستعد لمقابلة Senior Frontend Engineer وأريد التركيز على React والأداء."
                hint="كلما كانت النبذة أوضح، كانت أسئلة المدرب أدق."
                required
              />

              {error && (
                <p className="rounded-xl border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    جارٍ تجهيز المقابلة…
                  </>
                ) : (
                  <>
                    بدء المقابلة
                    <ArrowLeft size={17} />
                  </>
                )}
              </Button>
            </div>
          </form>

          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
                  <MessageSquare size={17} />
                </span>
                <h2 className="text-base font-semibold text-ink">ملخص المقابلة</h2>
              </div>

              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted">نوع المقابلة</dt>
                  <dd className="text-left font-medium text-ink">
                    {selectedInterviewType?.title ?? '—'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted">نوع الوظيفة</dt>
                  <dd className="text-left font-medium text-ink">
                    {selectedJobType?.name ?? '—'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted">المستوى</dt>
                  <dd className="text-left font-medium text-ink">
                    {selectedJobLevel?.name ?? '—'}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 border-t border-line pt-3">
                  <dt className="text-muted">النبذة</dt>
                  <dd className="text-sm leading-7 text-ink">
                    {about.trim() || 'لم تكتب نبذة بعد.'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="text-sm font-semibold text-ink">خطوات التجهيز</h3>
              <ol className="mt-3 flex flex-col gap-3">
                {steps.map((item, index) => {
                  const done = currentStep > index;
                  const active = currentStep === index;
                  return (
                    <li key={item.key} className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold',
                          done && 'bg-success-soft text-success',
                          active && 'bg-primary text-white',
                          !done && !active && 'bg-canvas text-muted',
                        )}
                      >
                        {done ? <Check size={14} /> : index + 1}
                      </span>
                      <span
                        className={cn(
                          'text-xs',
                          active ? 'font-semibold text-ink' : 'text-muted',
                        )}
                      >
                        {item.label}
                      </span>
                      {active && step !== 'idle' && (
                        <Loader2 size={13} className="animate-spin text-primary" />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
