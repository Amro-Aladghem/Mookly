import { LogOut, Mail, RefreshCw, UserRound, Briefcase, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { useUser } from '@/contexts/UserContext';
import { formatDate, initials } from '@/libs/format';
import { NavLink, useNavigate } from 'react-router-dom';

export function ProfileView() {
  const { user, userId, loading, refreshUser, logout } = useUser();
  const navigate = useNavigate();

  if (loading && !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <LoadingState label="جارٍ تحميل الملف الشخصي…" />
      </div>
    );
  }

  if (!userId || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-line bg-surface px-6 py-10 text-center">
          <p className="text-sm font-semibold text-ink">لا يوجد ملف شخصي بعد</p>
          <p className="mt-1 text-xs text-muted">أنشئ ملفك الشخصي للبدء.</p>
          <Button
            className="mt-4"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            إنشاء ملف
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const rows = [
    { label: 'نوع الوظيفة', value: user.jobType, icon: Briefcase },
    { label: 'المستوى الوظيفي', value: user.jobLevel, icon: Layers },
    { label: 'تاريخ الانضمام', value: formatDate(user.createdDateTime), icon: UserRound },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <NavLink to="/" className="text-xs font-medium text-muted">
            العودة للرئيسية
          </NavLink>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">ملفي الشخصي</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void refreshUser()}>
            <RefreshCw size={14} />
            تحديث
          </Button>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            <LogOut size={14} />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="bg-primary px-6 py-8 text-white sm:px-8">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold">
              {initials(user.firstName, user.lastName)}
            </span>
            <div>
              <h2 className="text-2xl font-bold">
                {`${user.firstName} ${user.lastName ?? ''}`.trim()}
              </h2>
              <p className="mt-1 text-sm text-white/75">
                {user.jobType} · {user.jobLevel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:grid-cols-3 sm:px-8">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="rounded-2xl border border-line bg-canvas p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
                  <Icon size={17} />
                </span>
                <p className="mt-3 text-xs text-muted">{row.label}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{row.value}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-line px-6 py-5 sm:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Mail size={16} className="text-primary" />
            نبذة عني
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-8 text-muted">
            {user.about?.trim() || 'لم تضف نبذة بعد.'}
          </p>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap gap-3">
        <NavLink
          to="/create-interview"
          className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          إنشاء مقابلة جديدة
        </NavLink>
        <NavLink
          to="/history"
          className="inline-flex h-10 items-center rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-primary/40"
        >
          المقابلات السابقة
        </NavLink>
      </div>
    </div>
  );
}
