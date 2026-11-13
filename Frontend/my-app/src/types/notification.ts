import type { AgentType, NotificationStatus } from '@/types/enums';

export interface NotificationDto {
  id: string;
  userId: string;
  chatId: string;
  text: string;
  notificationStatus: NotificationStatus;
  agentType: AgentType | string;
  data?: string | null;
  updatedAt: string;
}
