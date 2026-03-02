// src/components/StatusBadge.tsx
import { OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Pending',   className: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-blue-100   text-blue-700'   },
  PAID:      { label: 'Paid',      className: 'bg-green-100  text-green-700'  },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100    text-red-700'    },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
