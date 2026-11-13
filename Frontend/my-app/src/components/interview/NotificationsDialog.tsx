import { BellOff, Bot } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelative } from '@/libs/format';
import {
  notificationStatusLabels,
  notificationStatusStyles,
} from '@/types/enums';
import type { NotificationDto } from '@/types/notification';

interface NotificationsDialogProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationDto[];
}

export function NotificationsDialog({
  open,
  onClose,
  notifications,
}: NotificationsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="إشعارات المقابلة" size="sm">
      {notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff size={20} />}
          title="لا توجد إشعارات بعد"
          description="ستظهر هنا حالة المدرب أثناء المقابلة."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex gap-3 rounded-xl border border-line bg-surface p-3"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-dark">
                <Bot size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">المدرب الذكي</p>
                {notification.text && (
                  <p className="mt-1 whitespace-pre-wrap text-xs leading-6 text-muted">
                    {notification.text}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 font-medium ${notificationStatusStyles[notification.notificationStatus]}`}
                  >
                    {notificationStatusLabels[notification.notificationStatus]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{formatRelative(notification.updatedAt)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
