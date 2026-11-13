import { Bot, Loader2, MessageCircle } from 'lucide-react';
import { Markdown } from '@/components/ui/Markdown';
import { resolveMessageText } from '@/libs/chatGrouping';
import { cn } from '@/libs/cn';
import { notificationStatusLabels, notificationStatusStyles } from '@/types/enums';
import type { ChatExecutionGroup } from '@/types/chatSession';

interface AgentGroupProps {
  group: ChatExecutionGroup;
}

export function AgentGroup({ group }: AgentGroupProps) {
  const status = group.status;
  const waiting = status === 'WaitingForUser';
  const busy = status === 'Running' || status === 'Queued';

  return (
    <div className="flex justify-start gap-2">
      <div className="w-9 shrink-0 pt-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary-dark">
          <Bot size={18} />
        </span>
      </div>

      <div className="flex min-w-0 max-w-[88%] flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-muted">المدرب الذكي</span>
          {status !== null && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                notificationStatusStyles[status],
              )}
            >
              {busy && <Loader2 size={11} className="animate-spin" aria-hidden="true" />}
              {waiting && <MessageCircle size={11} aria-hidden="true" />}
              {notificationStatusLabels[status]}
            </span>
          )}
        </div>

        {group.messages.length === 0 ? (
          <div className="flex items-center gap-2.5 rounded-2xl rounded-tr-sm border border-line bg-surface px-3 py-2.5">
            <span className="flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: '120ms' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: '240ms' }}
              />
            </span>
            <p className="text-xs text-muted">
              {waiting ? 'بانتظار إجابتك…' : 'المدرب يجهّز ردّه…'}
            </p>
          </div>
        ) : (
          group.messages.map((message, index) => {
            const text = resolveMessageText(message.message);

            return (
              <div
                key={`${group.id}-${index}`}
                className="overflow-hidden rounded-2xl rounded-tr-sm border border-line bg-surface px-3.5 py-2.5 text-sm text-ink"
              >
                {text && <Markdown text={text} className="break-words" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
