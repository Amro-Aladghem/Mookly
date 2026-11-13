import type { AgentType, NotificationStatus } from '@/types/enums';
import type { ChatDto } from '@/types/chat';
import type { NotificationDto } from '@/types/notification';
import type {
  ChatExecutionGroup,
  ChatTimelineItem,
  ChatTimelineUserItem,
} from '@/types/chatSession';
import { eChatRole } from '@/types/enums';

const roleToAgentType: Record<number, AgentType> = {
  [eChatRole.Agent]: 'InterviewerAgent',
};

const ACTIVE_STATUSES: NotificationStatus[] = [
  'Queued',
  'Running',
  'WaitingForUser',
];

interface MutableGroup extends ChatExecutionGroup {
  closed: boolean;
}

interface NotificationRun {
  agentType: AgentType;
  status: NotificationStatus;
  startedAt: string;
  updatedAt: string;
}

function buildRuns(notifications: NotificationDto[]): NotificationRun[] {
  const runs: NotificationRun[] = [];
  let current: NotificationRun | null = null;

  for (const notification of notifications) {
    if (notification.agentType !== 'InterviewerAgent') continue;

    if (current === null || notification.notificationStatus === 'Queued') {
      current = {
        agentType: 'InterviewerAgent',
        status: notification.notificationStatus,
        startedAt: notification.updatedAt,
        updatedAt: notification.updatedAt,
      };
      runs.push(current);
    } else {
      current.status = notification.notificationStatus;
      current.updatedAt = notification.updatedAt;
    }
  }

  return runs;
}

function findActiveRun(runs: NotificationRun[]): NotificationRun | null {
  const last = runs[runs.length - 1];
  if (!last) return null;
  return ACTIVE_STATUSES.includes(last.status) ? last : null;
}

export function buildChatTimeline(
  history: ChatDto[],
  notifications: NotificationDto[],
): ChatTimelineItem[] {
  const timeline: ChatTimelineItem[] = [];
  const groups: MutableGroup[] = [];
  let current: MutableGroup | null = null;

  for (const [index, message] of history.entries()) {
    if (message.showMessage !== true) continue;

    if (message.chatRoleId === eChatRole.User) {
      current = null;
      const item: ChatTimelineUserItem = {
        kind: 'user',
        id: `user-${index}-${message.creationTime}`,
        message: message.message,
        imageUrl: message.imageUrl,
        imageType: message.imageType,
        createdAt: message.creationTime,
      };
      timeline.push(item);
      continue;
    }

    const agentType = roleToAgentType[message.chatRoleId];
    if (agentType === undefined) continue;

    if (current === null || current.agentType !== agentType || current.closed) {
      const group: MutableGroup = {
        kind: 'execution',
        id: `exec-${index}-${message.creationTime}`,
        agentType,
        status: null,
        messages: [message],
        startedAt: message.creationTime,
        updatedAt: message.creationTime,
        closed: message.isFinalResponse === true,
      };
      current = group;
      groups.push(group);
      timeline.push(group);
    } else {
      current.messages.push(message);
      current.updatedAt = message.creationTime;
      if (message.isFinalResponse === true) current.closed = true;
    }
  }

  for (const group of groups) {
    if (group.closed) group.status = 'Completed';
  }

  const run = findActiveRun(buildRuns(notifications));
  if (run) {
    const status: NotificationStatus =
      run.status === 'WaitingForUser' ? 'WaitingForUser' : 'Running';

    if (current && !current.closed && current.agentType === run.agentType) {
      current.status = status;
    } else {
      timeline.push({
        kind: 'execution',
        id: `run-${run.startedAt}-${run.agentType}`,
        agentType: run.agentType,
        status,
        messages: [],
        startedAt: run.startedAt,
        updatedAt: run.updatedAt,
      });
    }
  }

  return timeline;
}

export function resolveMessageText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return raw;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (
      parsed &&
      typeof parsed === 'object' &&
      'Message' in parsed &&
      typeof (parsed as { Message?: unknown }).Message === 'string'
    ) {
      return (parsed as { Message: string }).Message;
    }
    if (
      parsed &&
      typeof parsed === 'object' &&
      'message' in parsed &&
      typeof (parsed as { message?: unknown }).message === 'string'
    ) {
      return (parsed as { message: string }).message;
    }
  } catch {
    return raw;
  }

  return raw;
}
