export const eChatRole = {
  Agent: 1,
  User: 2,
  Tool: 3,
} as const;

export type eChatRole = (typeof eChatRole)[keyof typeof eChatRole];

export type AgentType = 'InterviewerAgent';

export type NotificationStatus =
  | 'Queued'
  | 'Running'
  | 'WaitingForUser'
  | 'Completed'
  | 'Failed';

export type MockInterviewStatus =
  | 'Scheduled'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'Failed';

export const notificationStatusLabels: Record<NotificationStatus, string> = {
  Queued: 'في الانتظار',
  Running: 'جارٍ التنفيذ',
  WaitingForUser: 'بانتظار إجابتك',
  Completed: 'مكتمل',
  Failed: 'تعذّر التنفيذ',
};

export const notificationStatusStyles: Record<NotificationStatus, string> = {
  Queued: 'bg-slate-100 text-slate-600',
  Running: 'bg-primary-soft text-primary-dark',
  WaitingForUser: 'bg-warning-soft text-warning',
  Completed: 'bg-success-soft text-success',
  Failed: 'bg-danger-soft text-danger',
};

export const mockInterviewStatusLabels: Record<string, string> = {
  Scheduled: 'مجدولة',
  InProgress: 'قيد التنفيذ',
  Completed: 'مكتملة',
  Cancelled: 'ملغاة',
  Failed: 'فاشلة',
};

export const mockInterviewStatusStyles: Record<string, string> = {
  Scheduled: 'bg-primary-soft text-primary-dark',
  InProgress: 'bg-warning-soft text-warning',
  Completed: 'bg-success-soft text-success',
  Cancelled: 'bg-slate-100 text-slate-600',
  Failed: 'bg-danger-soft text-danger',
};
