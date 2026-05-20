"use client";

import { Badge } from "@/components/ui/badge";
import type { OrderStatus, DeliveryStatus } from "@/types/orders";
import {
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
  AlertCircle,
  Eye,
  Pause,
  FileCheck,
  ArrowRightCircle,
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus | DeliveryStatus;
  type?: "order" | "delivery";
}

const orderStatusStyles: Record<string, string> = {
  CONFIRMED:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  PENDING:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  COMPLETED:
    "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-400 dark:border-lime-800",
  CANCELLED:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  PARTIAL:
    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
};

const deliveryStatusStyles: Record<string, string> = {
  // Final states
  DELIVERED:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  CANCELLED:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  FAILED:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",

  // In-progress states
  IN_TRANSIT:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  COURIERASSIGNED:
    "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800",
  PICKED_UP:
    "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800",
  IN_REVIEW:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",

  // Partial/Special states
  PARTIAL:
    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  HOLD: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  PENDING:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",

  // Initial states
  NOT_SHIPPED:
    "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700",
};

const fallbackStyle =
  "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700";

const orderIcons: Record<string, React.ReactNode> = {
  CONFIRMED: <CheckCircle className="h-3 w-3" />,
  PENDING: <Clock className="h-3 w-3" />,
  COMPLETED: <CheckCircle className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
  PARTIAL: <AlertCircle className="h-3 w-3" />,
};

const deliveryIcons: Record<string, React.ReactNode> = {
  // Final states
  DELIVERED: <CheckCircle className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
  FAILED: <XCircle className="h-3 w-3" />,

  // In-progress states
  COURIERASSIGNED: <ArrowRightCircle className="h-3 w-3" />,
  IN_TRANSIT: <Truck className="h-3 w-3" />,
  PICKED_UP: <Package className="h-3 w-3" />,
  IN_REVIEW: <Eye className="h-3 w-3" />,

  // Partial/Special states
  PARTIAL: <AlertCircle className="h-3 w-3" />,
  HOLD: <Pause className="h-3 w-3" />,
  PENDING: <Clock className="h-3 w-3" />,

  // Initial states
  NOT_SHIPPED: <FileCheck className="h-3 w-3" />,
};

const formatStatusLabel = (status: string) => {
  const customLabels: Record<string, string> = {
    COURIERASSIGNED: "COURIER ASSIGNED",
    IN_TRANSIT: "IN TRANSIT",
    PICKED_UP: "PICKED UP",
    IN_REVIEW: "IN REVIEW",
    NOT_SHIPPED: "NOT SHIPPED",
  };

  return customLabels[status] || status.replace(/_/g, " ");
};

export function OrderStatusBadge({
  status,
  type = "order",
}: OrderStatusBadgeProps) {
  const colorClass =
    type === "order"
      ? (orderStatusStyles[status] ?? fallbackStyle)
      : (deliveryStatusStyles[status] ?? fallbackStyle);

  const icon =
    type === "order"
      ? (orderIcons[status] ?? null)
      : (deliveryIcons[status] ?? null);

  const label = formatStatusLabel(status);

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
