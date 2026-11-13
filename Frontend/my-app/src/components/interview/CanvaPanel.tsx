import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { Code2, FileQuestion, ShieldCheck } from 'lucide-react';
import { Markdown } from '@/components/ui/Markdown';
import { resolveCanvaType } from '@/libs/canva';
import type { CanvaDto } from '@/types/canva';

interface CanvaPanelProps {
  canva: CanvaDto | null;
}

export function CanvaPanel({ canva }: CanvaPanelProps) {
  const kind = resolveCanvaType(canva);

  const sanitizedHtml = useMemo(() => {
    if (!canva || kind !== 'html') return '';
    return DOMPurify.sanitize(canva.content);
  }, [canva, kind]);

  return (
    <aside className="flex h-full min-h-72 flex-col rounded-2xl border border-line bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
            <FileQuestion size={17} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-ink">أسئلة تفاعلية</h2>
            <p className="text-[11px] text-muted">تظهر هنا الأسئلة التي يرسلها المدرب</p>
          </div>
        </div>

        {canva && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-semibold text-primary-dark">
            <Code2 size={11} />
            {kind === 'html' ? 'HTML' : kind === 'markdown' ? 'Markdown' : 'نص'}
          </span>
        )}
      </header>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4">
        {!canva ? (
          <div className="flex h-full min-h-56 flex-col items-center justify-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary-dark">
              <FileQuestion size={22} />
            </span>
            <p className="text-sm font-semibold text-ink">لا توجد أسئلة تفاعلية بعد</p>
            <p className="max-w-xs text-xs leading-6 text-muted">
              عندما يرسل المدرب سؤالاً أو تمريناً تفاعلياً سيظهر هنا مباشرة.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {canva.isSolved && (
              <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-[10px] font-semibold text-success">
                <ShieldCheck size={12} />
                تم حل السؤال
              </span>
            )}

            {kind === 'markdown' && <Markdown text={canva.content} />}
            {kind === 'html' && (
              <div
                className="canva-html"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            )}
            {kind === 'text' && (
              <p className="whitespace-pre-wrap text-sm leading-8 text-ink">
                {canva.content}
              </p>
            )}

            {canva.userAnswer && (
              <div className="mt-4 rounded-xl border border-line bg-canvas px-3 py-2">
                <p className="text-[11px] font-semibold text-muted">إجابتك السابقة</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
                  {canva.userAnswer}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-line px-4 py-2.5">
        <p className="text-[11px] leading-5 text-muted">
          يتم تحديث هذا القسم تلقائياً أثناء المقابلة.
        </p>
      </footer>
    </aside>
  );
}
