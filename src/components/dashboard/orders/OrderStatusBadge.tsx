'use client';

import { Badge } from '@/components/ui/badge';
import type { OrderStatus, DeliveryStatus } from '@/types/orders';
import { CheckCircle, Clock, XCircle, Truck, Package } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus | DeliveryStatus;
  type?: 'order' | 'delivery';
}

const orderStatusStyles: Record<string, string> = {
  CONFIRMED:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  PENDING:
    'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  CANCELLED:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

const deliveryStatusStyles: Record<string, string> = {
  DELIVERED:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  IN_TRANSIT:
    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  NOT_SHIPPED:
    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
  FAILED:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  CANCELLED:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

const fallbackStyle =
  'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700';

const orderIcons: Record<string, React.ReactNode> = {
  CONFIRMED: <CheckCircle className="h-3 w-3" />,
  PENDING: <Clock className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
};

const deliveryIcons: Record<string, React.ReactNode> = {
  DELIVERED: <CheckCircle className="h-3 w-3" />,
  IN_TRANSIT: <Truck className="h-3 w-3" />,
  NOT_SHIPPED: <Package className="h-3 w-3" />,
  FAILED: <XCircle className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
};

export function OrderStatusBadge({ status, type = 'order' }: OrderStatusBadgeProps) {
  const colorClass =
    type === 'order'
      ? (orderStatusStyles[status] ?? fallbackStyle)
      : (deliveryStatusStyles[status] ?? fallbackStyle);

  const icon =
    type === 'order'
      ? (orderIcons[status] ?? null)
      : (deliveryIcons[status] ?? null);

  const label = status.replace(/_/g, ' ');

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 border font-medium ${colorClass}`}
    >
      {icon}
      <span>{label}</span>
    </Badge>
  );
}
