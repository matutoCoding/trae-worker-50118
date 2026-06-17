import { cn } from '@/lib/utils';

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'pending';

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-orange-100 text-orange-700 border-orange-200',
  danger: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export default function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', {
        'bg-green-500': variant === 'success',
        'bg-orange-500': variant === 'warning',
        'bg-red-500': variant === 'danger',
        'bg-blue-500': variant === 'info',
        'bg-slate-500': variant === 'default',
        'bg-yellow-500': variant === 'pending',
      })}></span>
      {children}
    </span>
  );
}
