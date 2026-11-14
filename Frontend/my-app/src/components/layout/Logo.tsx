import { NavLink } from 'react-router-dom';

export function Logo() {
  return (
    <NavLink to="/" end className="flex items-center gap-2.5" aria-label="Mookly الرئيسية">
      <img
        src="/logo-mark.png"
        alt="Mookly"
        draggable={false}
        className="h-10 w-auto"
      />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-ink">Mookly</span>
        <span className="mt-0.5 text-[10px] font-medium text-muted">مقابلاتك التدريبية</span>
      </span>
    </NavLink>
  );
}