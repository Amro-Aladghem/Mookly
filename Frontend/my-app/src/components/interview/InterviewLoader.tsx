import { Bot } from 'lucide-react';

export function InterviewLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-line bg-surface px-6 py-12 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary/10 [animation:pulse-ring_1.8s_ease-out_infinite]" />
        <span className="absolute inset-2 rounded-full bg-primary/10 [animation:pulse-ring_1.8s_ease-out_0.45s_infinite]" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
          <Bot size={26} />
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-ink">المقابلة على وشك البدء…</h3>
        <p className="mt-1 max-w-sm text-sm leading-7 text-muted">
          يتم تجهيز المدرب الذكي ومراجعة معلومات المقابلة. لحظات من فضلك.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2">
        <span className="flex items-center gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: '140ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: '280ms' }}
          />
        </span>
        <span className="text-xs font-medium text-muted">جارٍ بدء المقابلة</span>
      </div>
    </div>
  );
}
