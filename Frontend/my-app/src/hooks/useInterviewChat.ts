import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mooklyService from '@/services/mooklyService';
import { buildChatTimeline } from '@/libs/chatGrouping';
import { parseCanvaFromChatData } from '@/libs/canva';
import { POLL_INTERVAL_MS } from '@/libs/config';
import {
  markAutoMessageSent,
  readAutoMessageSent,
} from '@/libs/storage';
import { eChatRole } from '@/types/enums';
import type { NotificationStatus } from '@/types/enums';
import type { ChatDto } from '@/types/chat';
import type { NotificationDto } from '@/types/notification';
import type { ChatTimelineItem, ChatTimelineUserItem } from '@/types/chatSession';
import type { CanvaDto } from '@/types/canva';

const TERMINAL_STATUSES: NotificationStatus[] = [
  'WaitingForUser',
  'Completed',
  'Failed',
];

function lastInterviewerNotification(
  notifications: NotificationDto[],
): NotificationDto | null {
  for (let index = notifications.length - 1; index >= 0; index -= 1) {
    if (notifications[index].agentType === 'InterviewerAgent') {
      return notifications[index];
    }
  }
  return null;
}

interface UseInterviewChatOptions {
  userId: string;
  chatSignature: string;
  autoMessage: string | null;
}

export interface InterviewChatState {
  timeline: ChatTimelineItem[];
  history: ChatDto[];
  notifications: NotificationDto[];
  loading: boolean;
  sending: boolean;
  hasMessages: boolean;
  isStarting: boolean;
  isWaitingForUser: boolean;
  isFinished: boolean;
  isFailed: boolean;
  lastStatus: NotificationStatus | null;
  latestCanva: CanvaDto | null;
  autoMessageError: string | null;
  sendMessage: (text: string) => Promise<boolean>;
  reload: () => void;
  retryAutoMessage: () => void;
}

export function useInterviewChat({
  userId,
  chatSignature,
  autoMessage,
}: UseInterviewChatOptions): InterviewChatState {
  const [history, setHistory] = useState<ChatDto[]>([]);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [pending, setPending] = useState<ChatTimelineUserItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [autoMessageError, setAutoMessageError] = useState<string | null>(null);

  const loadedRef = useRef(false);
  const notificationsJsonRef = useRef('');
  const autoSentRef = useRef(false);
  const autoSendingRef = useRef(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!loadedRef.current) setInitialLoading(true);

      try {
        const [notificationsResult, historyResult] = await Promise.all([
          mooklyService.getNotificationsForChat(userId, chatSignature),
          mooklyService.getChatHistory(userId, chatSignature),
        ]);

        if (!active) return;

        const notificationsData = notificationsResult.isSuccess
          ? notificationsResult.data
          : [];
        const historyData = historyResult.isSuccess ? historyResult.data : [];

        notificationsJsonRef.current = JSON.stringify(notificationsData);
        setNotifications(notificationsData);
        setHistory(historyData);
      } catch {
        if (!active) return;
        notificationsJsonRef.current = '[]';
        setNotifications([]);
        setHistory([]);
      } finally {
        if (active) {
          loadedRef.current = true;
          setInitialLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [userId, chatSignature, refreshToken]);

  const timeline = useMemo(() => {
    const base = buildChatTimeline(history, notifications);
    return pending.length > 0 ? [...base, ...pending] : base;
  }, [history, notifications, pending]);

  const lastNotification = useMemo(
    () => lastInterviewerNotification(notifications),
    [notifications],
  );

  const lastStatus = lastNotification?.notificationStatus ?? null;

  const isFinished = useMemo(
    () =>
      lastStatus === 'Completed' ||
      history.some(
        (message) =>
          message.chatRoleId === eChatRole.Agent && message.isFinalResponse === true,
      ),
    [lastStatus, history],
  );

  const isWaitingForUser = lastStatus === 'WaitingForUser' && !isFinished;
  const isFailed = lastStatus === 'Failed';
  const agentStarted =
    history.some((message) => message.chatRoleId === eChatRole.Agent) ||
    notifications.length > 0;
  const hasUserMessage = history.some(
    (message) =>
      message.chatRoleId === eChatRole.User && message.message.trim().length > 0,
  );
  const hasMessages = timeline.length > 0;
  const isStarting =
    !initialLoading && !agentStarted && !isFinished && !isFailed;

  const latestCanva = useMemo(() => {
    let latest: { canva: CanvaDto; at: string } | null = null;

    for (const message of history) {
      const canva = parseCanvaFromChatData(message.data);
      if (!canva) continue;

      if (!latest || message.creationTime >= latest.at) {
        latest = { canva, at: message.creationTime };
      }
    }

    return latest?.canva ?? null;
  }, [history]);

  const sendMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const message = text.trim();
      if (!message || sending) return false;

      const pendingId = `pending-${crypto.randomUUID()}`;
      setPending((prev) => [
        ...prev,
        {
          kind: 'user',
          id: pendingId,
          message,
          imageUrl: null,
          imageType: null,
          createdAt: new Date().toISOString(),
        },
      ]);

      setSending(true);

      try {
        const result = await mooklyService.chatWithAgent(userId, chatSignature, {
          chatSignture: chatSignature,
          userId,
          message,
          imageUri: null,
          agentType: 'InterviewerAgent',
        });

        setPending((prev) => prev.filter((item) => item.id !== pendingId));

        if (result.isSuccess) {
          setRefreshToken((value) => value + 1);
          return true;
        }

        return false;
      } catch {
        setPending((prev) => prev.filter((item) => item.id !== pendingId));
        return false;
      } finally {
        setSending(false);
      }
    },
    [userId, chatSignature, sending],
  );

  const sendAutoMessage = useCallback(async () => {
    if (
      !autoMessage ||
      autoSentRef.current ||
      autoSendingRef.current ||
      readAutoMessageSent(chatSignature) ||
      hasUserMessage
    ) {
      autoSentRef.current = true;
      return;
    }

    autoSentRef.current = true;
    autoSendingRef.current = true;
    setAutoMessageError(null);

    const success = await sendMessage(autoMessage);

    if (success) {
      markAutoMessageSent(chatSignature);
    } else {
      setAutoMessageError('تعذّر إرسال معلومات المقابلة. يمكنك المحاولة مرة أخرى.');
    }

    autoSendingRef.current = false;
  }, [autoMessage, chatSignature, hasUserMessage, sendMessage]);

  useEffect(() => {
    if (initialLoading || !autoMessage) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void sendAutoMessage();
  }, [initialLoading, autoMessage, sendAutoMessage]);

  useEffect(() => {
    if (initialLoading || !chatSignature) return;
    if (lastStatus !== null && TERMINAL_STATUSES.includes(lastStatus)) return;

    let cancelled = false;
    let inFlight = false;

    const run = async () => {
      if (inFlight) return;
      inFlight = true;

      try {
        const result = await mooklyService.getNotificationsForChat(userId, chatSignature);
        if (cancelled || !result.isSuccess) return;

        const serialized = JSON.stringify(result.data);
        const changed = serialized !== notificationsJsonRef.current;
        const latest = lastInterviewerNotification(result.data);
        const isTerminal =
          latest !== null && TERMINAL_STATUSES.includes(latest.notificationStatus);

        if (!changed && !isTerminal) return;

        let nextHistory: ChatDto[] | null = null;
        if (isTerminal) {
          const historyResult = await mooklyService.getChatHistory(
            userId,
            chatSignature,
          );
          if (historyResult.isSuccess) nextHistory = historyResult.data;
        }

        if (cancelled) return;

        notificationsJsonRef.current = serialized;
        setNotifications(result.data);
        if (nextHistory) setHistory(nextHistory);
      } catch {
        // polling failures are intentionally silent
      } finally {
        inFlight = false;
      }
    };

    const interval = window.setInterval(() => {
      void run();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [initialLoading, userId, chatSignature, lastStatus]);

  const reload = useCallback(() => {
    setRefreshToken((value) => value + 1);
  }, []);

  const retryAutoMessage = useCallback(() => {
    setAutoMessageError(null);
    autoSentRef.current = false;
    autoSendingRef.current = false;
    void sendAutoMessage();
  }, [sendAutoMessage]);

  return {
    timeline,
    history,
    notifications,
    loading: initialLoading,
    sending,
    hasMessages,
    isStarting,
    isWaitingForUser,
    isFinished,
    isFailed,
    lastStatus,
    latestCanva,
    autoMessageError,
    sendMessage,
    reload,
    retryAutoMessage,
  };
}
