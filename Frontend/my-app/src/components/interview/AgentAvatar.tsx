import { cn } from '@/libs/cn';

const sizeClasses = {
  xs: 'h-8 w-8',
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
  xl: 'h-20 w-20',
} as const;

type AgentAvatarSize = keyof typeof sizeClasses;

interface AgentAvatarProps {
  size?: AgentAvatarSize;
  className?: string;
  ring?: boolean;
}

export function AgentAvatar({ size = 'sm', className, ring = false }: AgentAvatarProps) {
  return (
    <img
      src="/InterviewerAgent.png"
      alt="المدرب الذكي"
      draggable={false}
      className={cn(
        'shrink-0 rounded-full object-cover',
        sizeClasses[size],
        ring && 'ring-2 ring-primary/15',
        className,
      )}
    />
  );
}