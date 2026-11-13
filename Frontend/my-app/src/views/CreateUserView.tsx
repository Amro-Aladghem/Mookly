import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, BrainCircuit, Sparkles, UserPlus } from 'lucide-react';
import { SelectField, TextField, TextareaField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { useUser } from '@/contexts/UserContext';
import { useAsyncData } from '@/hooks/useAsyncData';
import mooklyService from '@/services/mooklyService';
import { useNavigate } from 'react-router-dom';

export function CreateUserView() {
  const { createUser } = useUser();
  const navigate = useNavigate();
  const jobTypes = useAsyncData(() => mooklyService.getJobTypes(), []);
  const jobLevels = useAsyncData(() => mooklyService.getJobLevels(), []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [about, setAbout] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobLevel, setJobLevel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupsLoading = jobTypes.loading || jobLevels.loading;
  const lookupsError = jobTypes.error || jobLevels.error;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!firstName.trim() || !jobType || !jobLevel) {
      setError('يرجى تعبئة الاسم ونوع الوظيفة والمستوى الوظيفي.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await createUser({
        firstName: firstName.trim(),
        lastName: lastName.trim() || null,
        about: about.trim() || null,
        jobType,
        jobLevel,
        createdDateTime: new Date().toISOString(),
      });

      if (!result.isSuccess) {
        setError(result.error);
        return;
      }

      navigate('/');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-6">
      <section className="order-2 overflow-hidden rounded-3xl border border-line bg-surface lg:order-1">
        <div className="border-b border-line bg-primary px-6 py-8 text-white sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            <Sparkles size={14} />
            مدرب مقابلات ذكي باللغة العربية
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-snug sm:text-4xl">
            استعد لمقابلتك القادمة بثقة
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-8 text-white/80">
            أنشئ ملفك الشخصي، اختر نوع المقابلة والمستوى الوظيفي، وابدأ محادثة تدريبية
            تفاعلية مع مدرب ذكي يطرح عليك الأسئلة ويعطيك ملاحظات مباشرة.
          </p>
        </div>

        <div className="grid gap-3 px-6 py-6 sm:grid-cols-3 sm:px-8">
          {[
            { title: 'مقابلة مخصصة', text: 'حسب نوع الوظيفة ومستواك' },
            { title: 'أسئلة تفاعلية', text: 'تظهر أثناء المحادثة' },
            { title: 'نتيجة مفصلة', text: 'نقاط القوة والتحسين' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-canvas p-4">
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-xs leading-6 text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="order-1 rounded-3xl border border-line bg-surface p-5 sm:p-7 lg:order-2">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
            <UserPlus size={21} />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-ink">أنشئ ملفك الشخصي</h2>
            <p className="text-xs text-muted">نحتاج بعض المعلومات لتخصيص المقابلة.</p>
          </div>
        </div>

        {lookupsLoading ? (
          <LoadingState label="جارٍ تحميل الخيارات…" />
        ) : lookupsError ? (
          <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
            {lookupsError}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="الاسم الأول"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="مثال: أحمد"
                required
                autoComplete="given-name"
              />
              <TextField
                label="اسم العائلة"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="مثال: العلي"
                autoComplete="family-name"
              />
            </div>

            <SelectField
              label="نوع الوظيفة"
              value={jobType}
              onChange={(event) => setJobType(event.target.value)}
              required
            >
              <option value="">اختر نوع الوظيفة</option>
              {jobTypes.data?.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="المستوى الوظيفي"
              value={jobLevel}
              onChange={(event) => setJobLevel(event.target.value)}
              required
            >
              <option value="">اختر المستوى الوظيفي</option>
              {jobLevels.data?.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </SelectField>

            <TextareaField
              label="نبذة عنك"
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              placeholder="اكتب نبذة قصيرة عن خبرتك وأهدافك…"
              hint="اختياري، لكنه يساعد المدرب على تخصيص الأسئلة."
            />

            {error && (
              <p className="rounded-xl border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? 'جارٍ إنشاء الملف…' : 'ابدأ الآن'}
              <ArrowLeft size={17} />
            </Button>
          </form>
        )}

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted">
          <BrainCircuit size={13} />
          Mookly — مساحتك الآمنة للتدريب على المقابلات
        </p>
      </section>
    </div>
  );
}
