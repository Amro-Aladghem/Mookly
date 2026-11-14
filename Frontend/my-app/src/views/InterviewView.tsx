import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { AgentGroup } from '@/components/interview/AgentGroup';
import { AgentAvatar } from '@/components/interview/AgentAvatar';
import { CanvaPanel } from '@/components/interview/CanvaPanel';
import { ChatComposer } from '@/components/interview/ChatComposer';
import { InterviewLoader } from '@/components/interview/InterviewLoader';
import { NotificationsDialog } from '@/components/interview/NotificationsDialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useUser } from '@/contexts/UserContext';
import { useInterviewChat } from '@/hooks/useInterviewChat';
import { buildMockInterviewInfoMessage, makeActiveInterviewCache } from '@/libs/mockInterview';
import { cn } from '@/libs/cn';
import { formatDate } from '@/libs/format';
import { NavLink, useParams } from 'react-router-dom';
import {
  readActiveInterview,
  writeActiveInterview,
} from '@/libs/storage';
import mooklyService from '@/services/mooklyService';
import {
  notificationStatusLabels,
  notificationStatusStyles,
} from '@/types/enums';
import type { ActiveInterviewCache } from '@/types/mockInterview';

export function InterviewView() {
  const { chatSignature = '' } = useParams<{ chatSignature: string }>();
  const { userId } = useUser();
  const safeUserId = userId ?? '';

  const [interview, setInterview] = useState<ActiveInterviewCache | null>(() =>
    readActiveInterview(chatSignature),
  );
  const [interviewLoading, setInterviewLoading] = useState(true);
  const [interviewError, setInterviewError] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [focusToken, setFocusToken] = useState(0);
  const endRef = useRef<HTMLDivElement | null>(null);

  const loadInterview = useCallback(async () => {
    setInterviewLoading(true);

    try {
      const result = await mooklyService.getMockInterviewByChatSignature(
        safeUserId,
        chatSignature,
      );

      if (result.isSuccess) {
        const cache = makeActiveInterviewCache(result.data);
        writeActiveInterview(cache);
        setInterview(cache);
        setInterviewError(null);
      } else {
        setInterviewError(result.error);
      }
    } catch {
      setInterviewError('تعذّر تحميل معلومات المقابلة.');
    } finally {
      setInterviewLoading(false);
    }
  }, [safeUserId, chatSignature]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadInterview();
  }, [loadInterview]);

  const infoMessage = interview
    ? interview.infoMessage || buildMockInterviewInfoMessage(interview)
    : null;

  const chat = useInterviewChat({
    userId: safeUserId,
    chatSignature,
    autoMessage: infoMessage,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (chat.isWaitingForUser) setFocusToken((value) => value + 1);
  }, [chat.isWaitingForUser]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [chat.timeline, chat.isStarting]);

  const statusLabel = chat.isFinished
    ? 'مكتملة'
    : chat.isWaitingForUser
      ? 'بانتظار إجابتك'
      : chat.isFailed
        ? 'تعذّر التنفيذ'
        : chat.lastStatus
          ? notificationStatusLabels[chat.lastStatus]
          : 'قيد التجهيز';

  const statusStyle = chat.isFinished
    ? notificationStatusStyles.Completed
    : chat.isWaitingForUser
      ? notificationStatusStyles.WaitingForUser
      : chat.isFailed
        ? notificationStatusStyles.Failed
        : chat.lastStatus
          ? notificationStatusStyles[chat.lastStatus]
          : notificationStatusStyles.Queued;

  if (interviewLoading && !interview) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <LoadingState label="جارٍ تحميل المقابلة…" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState
          message={interviewError ?? 'لم نتمكن من العثور على هذه المقابلة.'}
          onRetry={() => void loadInterview()}
        />
        <div className="mt-4 text-center">
          <NavLink to="/" className="text-sm font-medium text-primary">
            العودة للرئيسية
          </NavLink>
        </div>
      </div>
    );
  }

  const resultsTarget = interview.mockInterviewId
    ? `/results/${interview.mockInterviewId}`
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <NavLink
            to="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted"
          >
            <ArrowRight size={14} />
            العودة للرئيسية
          </NavLink>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              {interview.mockInterviewType}
            </h1>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                statusStyle,
              )}
            >
              {(chat.isStarting || chat.lastStatus === 'Running') && (
                <Loader2 size={11} className="animate-spin" />
              )}
              {chat.isWaitingForUser && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              {statusLabel}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span>{interview.jobType ?? 'وظيفة عامة'}</span>
            <span aria-hidden="true">·</span>
            <span>{interview.jobLevel ?? 'مستوى غير محدد'}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={12} />
              {formatDate(interview.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <IconButton
              label="إشعارات المقابلة"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell size={19} />
              {chat.notifications.length > 0 && (
                <Badge className="pointer-events-none absolute -right-0.5 -top-0.5">
                  {chat.notifications.length > 99 ? '99+' : chat.notifications.length}
                </Badge>
              )}
            </IconButton>
          </div>
          <NavLink
            to="/history"
            className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink sm:inline-flex"
          >
            <ClipboardList size={16} />
            سجل المقابلات
          </NavLink>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex h-[calc(100dvh-170px)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-line bg-surface">
          <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <AgentAvatar size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">غرفة المقابلة</p>
                <p className="truncate text-[11px] text-muted">
                  المدرب الذكي · {interview.mockInterviewType}
                </p>
              </div>
            </div>
            {chat.isWaitingForUser && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-[10px] font-semibold text-warning">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                دورك الآن
              </span>
            )}
          </header>

          <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4 sm:px-4">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
              {chat.loading ? (
                <LoadingState label="جارٍ تحميل المحادثة…" />
              ) : chat.isStarting ? (
                <InterviewLoader />
              ) : (
                <>
                  {chat.timeline.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-line bg-canvas px-4 py-8 text-center">
                      <p className="text-sm font-semibold text-ink">المقابلة جاهزة للبدء</p>
                      <p className="mt-1 text-xs text-muted">
                        سيبدأ المدرب بطرح الأسئلة بعد لحظات.
                      </p>
                    </div>
                  )}

                  {chat.timeline.map((item) =>
                    item.kind === 'user' ? (
                      <div key={item.id} className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-primary px-3.5 py-2.5 text-sm text-white">
                          <p dir="auto" className="whitespace-pre-wrap break-words leading-7">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <AgentGroup key={item.id} group={item} />
                    ),
                  )}
                </>
              )}

              {chat.autoMessageError && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-danger/20 bg-danger-soft px-3 py-2 text-xs text-danger">
                  <span>{chat.autoMessageError}</span>
                  <Button variant="danger" size="sm" onClick={chat.retryAutoMessage}>
                    <RotateCcw size={13} />
                    إعادة المحاولة
                  </Button>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </div>

          <div className="border-t border-line bg-surface px-3 py-3 sm:px-4">
            <div className="mx-auto w-full max-w-3xl">
              {chat.isFinished ? (
                <div className="rounded-2xl border border-success/20 bg-success-soft px-4 py-4 text-center">
                  <p className="flex items-center justify-center gap-2 text-sm font-semibold text-success">
                    <CheckCircle2 size={17} />
                    انتهت المقابلة
                  </p>
                  <p className="mt-1 text-xs leading-6 text-success/80">
                    يمكنك الآن الاطلاع على نتيجتك التفصيلية وملاحظات المدرب.
                  </p>
                  {resultsTarget ? (
                    <NavLink
                      to={resultsTarget}
                      className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                    >
                      <Trophy size={16} />
                      عرض النتيجة
                    </NavLink>
                  ) : (
                    <p className="mt-2 text-xs text-danger">
                      تعذّر تحديد رقم المقابلة لعرض النتيجة.
                    </p>
                  )}
                </div>
              ) : chat.isFailed ? (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-danger/20 bg-danger-soft px-4 py-3">
                  <p className="text-sm text-danger">
                    تعذّر إكمال المقابلة. يمكنك إعادة المحاولة.
                  </p>
                  <Button variant="secondary" size="sm" onClick={chat.reload}>
                    <RotateCcw size={14} />
                    إعادة المحاولة
                  </Button>
                </div>
              ) : (
                <>
                  {chat.isWaitingForUser && (
                    <p className="mb-2 text-center text-[11px] font-medium text-warning">
                      دورك الآن — اكتب إجابتك أو اسأل عن توضيح.
                    </p>
                  )}
                  <ChatComposer
                    onSubmit={(message) => chat.sendMessage(message)}
                    loading={chat.sending}
                    disabled={chat.isFinished}
                    focusToken={focusToken}
                  />
                </>
              )}
            </div>
          </div>
        </section>

        <div className="lg:sticky lg:top-24 lg:h-[calc(100dvh-170px)]">
          <CanvaPanel canva={chat.latestCanva} />
        </div>
      </div>

      <NotificationsDialog
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={chat.notifications}
      />
    </div>
  );
}
