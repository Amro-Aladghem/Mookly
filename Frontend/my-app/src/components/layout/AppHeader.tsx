import { LogOut, PlusCircle, UserRound } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { IconButton } from '@/components/ui/IconButton';
import { useUser } from '@/contexts/UserContext';
import { initials } from '@/libs/format';
import { cn } from '@/libs/cn';
import { NavLink, useNavigate } from 'react-router-dom';

const linkClass =
  'rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink';

export function AppHeader() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <Logo />

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto pb-1 sm:order-2 sm:w-auto sm:pb-0">
          <NavLink
            to="/"
            end
            className={({ isActive }) => cn(linkClass, isActive && 'text-ink')}
          >
            الرئيسية
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => cn(linkClass, isActive && 'text-ink')}
          >
            المقابلات السابقة
          </NavLink>
          <NavLink
            to="/create-interview"
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary-dark transition-colors hover:bg-primary-soft',
                isActive && 'bg-primary-soft',
              )
            }
          >
            <PlusCircle size={16} />
            إنشاء مقابلة
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => cn(linkClass, isActive && 'text-ink')}
          >
            ملفي
          </NavLink>
        </nav>

        <div className="order-2 flex items-center gap-2 sm:order-3">
          <NavLink
            to="/profile"
            className="flex items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-1.5 transition-colors hover:border-primary/30"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-dark">
              {initials(user?.firstName, user?.lastName)}
            </span>
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
              <span className="max-w-32 truncate text-xs font-semibold text-ink">
                {user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'المستخدم'}
              </span>
              <span className="max-w-32 truncate text-[10px] text-muted">
                {user?.jobType ?? 'مرحباً بك'}
              </span>
            </span>
          </NavLink>

          <IconButton label="تسجيل الخروج" onClick={handleLogout}>
            <LogOut size={18} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

export function UserAvatar({ className }: { className?: string }) {
  const { user } = useUser();

  return (
    <span
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-dark',
        className,
      )}
    >
      {initials(user?.firstName, user?.lastName)}
    </span>
  );
}

export function UserChip() {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2">
      <UserRound size={16} className="text-primary" />
      <span className="text-sm font-medium text-ink">
        {user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'المستخدم'}
      </span>
    </div>
  );
}
