/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  CalendarDays,
  Hash,
  StickyNote,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/orders";

interface MyOrderDetailModalProps {
  open: boolean;
  order: Order | null;
  userRole: string;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

const ORDER_STATUS_MAP: Record<
  string,
  { label: string; cls: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: "Processing",
    cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    icon: AlertCircle,
  },
  SHIPPED: {
    label: "Shipped",
    cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    cls: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
    icon: CheckCircle2,
  },
  COMPLETED: {
    label: "Completed",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    icon: XCircle,
  },
};

const DELIVERY_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  NOT_SHIPPED: {
    label: "Not Shipped",
    cls: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700",
  },
  IN_TRANSIT: {
    label: "In Transit",
    cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  DELIVERED: {
    label: "Delivered",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  RETURNED: {
    label: "Returned",
    cls: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  },
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-900/20">
        <Icon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium text-gray-800 dark:text-gray-200 wrap-break-word">
          {value ?? (
            <span className="italic font-normal text-gray-400 dark:text-gray-600">
              —
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// function DetailSkeleton() {
//   return (
//     <div className="space-y-4 py-2 px-6">
//       {[...Array(6)].map((_, i) => (
//         <div key={i} className="flex items-start gap-3">
//           <div className="h-6 w-6 animate-pulse rounded-md bg-amber-100 dark:bg-amber-900/20" />
//           <div className="flex-1 space-y-1.5">
//             <div className="h-2.5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
//             <div className="h-4 w-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

export function MyOrderDetailModal({
  open,
  order,
  onOpenChange,
  userRole,
  onEdit,
}: MyOrderDetailModalProps) {
  const orderStatus =
    ORDER_STATUS_MAP[order?.orderStatus ?? "PENDING"] ??
    ORDER_STATUS_MAP.PENDING;
  const deliveryStatus =
    DELIVERY_STATUS_MAP[order?.deliveryStatus ?? "NOT_SHIPPED"] ??
    DELIVERY_STATUS_MAP.NOT_SHIPPED;
  const StatusIcon = orderStatus.icon;
  const canEdit =
    ["ADMIN", "MODERATOR", "MANAGER", "TELLICELSS"].includes(userRole) &&
    !order?.courierName;
  const isConfirmed = order?.orderStatus === "CONFIRMED";
  const moderatorEdit = ["MODERATOR"].includes(userRole) && !isConfirmed;
  const canEditOrder = moderatorEdit && canEdit && !order?.courierName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-800">
        {/* Amber brand accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-400 to-yellow-400" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
                Order Details
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
                {order?.customOrderId
                  ? `#${order.customOrderId}`
                  : order?._id
                    ? `ID: ${order?._id.slice(0, 16)}…`
                    : "Loading…"}
              </DialogDescription>
            </div>
          </div>
          {order && (
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                orderStatus.cls,
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {orderStatus.label}
            </Badge>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto">
          {/* {isLoading ? (
            <div className="py-4">
              <DetailSkeleton />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center px-6">
              <div className="rounded-full bg-red-50 p-3 dark:bg-red-900/20">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Failed to load order details
              </p>
            </div>
          ) : order ? ( */}
          {order ? (
            <div className="px-6 py-4 space-y-0">
              {/* ── Financial summary card ── */}
              <div className="mb-4 rounded-xl border border-amber-200/60 bg-amber-50/40 dark:border-amber-900/30 dark:bg-amber-900/10 p-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Subtotal",
                      value: `৳${order.subTotal?.toFixed(2) ?? "0.00"}`,
                    },
                    {
                      label: "Shipping",
                      value: `৳${order.shippingCost?.toFixed(2) ?? "0.00"}`,
                    },
                    {
                      label: "Discount",
                      value: `-৳${order.discount?.toFixed(2) ?? "0.00"}`,
                    },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600/70 dark:text-amber-500/70">
                        {item.label}
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-amber-200/60 pt-3 dark:border-amber-900/30">
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                    Total
                  </span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    ৳{order.total?.toFixed(2) ?? "0.00"}
                  </span>
                </div>
              </div>

              {/* ── Info rows ── */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                <InfoRow
                  icon={Hash}
                  label="Order ID"
                  value={order.customOrderId ? `#${order.customOrderId}` : "—"}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Placed On"
                  value={
                    order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"
                  }
                />
                <InfoRow
                  icon={User}
                  label="Customer"
                  value={order.billingDetails?.fullName}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={order.billingDetails?.email}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={order.billingDetails?.phone}
                />
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={order.billingDetails?.address}
                />
                <InfoRow
                  icon={CreditCard}
                  label="Payment"
                  value={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{(order as any).paymentMethod ?? "COD"}</span>
                      {order.transactionId && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          {order.transactionId}
                        </span>
                      )}
                    </div>
                  }
                />
                <InfoRow
                  icon={Truck}
                  label="Delivery"
                  value={
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                          deliveryStatus.cls,
                        )}
                      >
                        {deliveryStatus.label}
                      </Badge>
                      {order.courierName && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          via {order.courierName}
                        </span>
                      )}
                      {order.trackingNumber && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          {order.trackingNumber}
                        </span>
                      )}
                    </div>
                  }
                />
                {order.note && (
                  <InfoRow
                    icon={StickyNote}
                    label="Notes"
                    value={
                      <span className="whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-400 font-normal text-xs">
                        {order.note}
                      </span>
                    }
                  />
                )}
              </div>

              {/* ── Products ── */}
              {order.products && order.products.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    <Package className="h-3 w-3" />
                    Products ({order.products.length})
                  </p>
                  <div className="space-y-2">
                    {order.products.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/30"
                      >
                        {item.product?.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product.images[0]}
                            alt={item.title ?? "Product"}
                            className="h-10 w-10 shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-900/20">
                            <Package className="h-4 w-4 text-amber-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                            {item.title ?? item.product?.title ?? "Product"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ৳{item.price?.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold tabular-nums text-amber-600 dark:text-amber-400">
                          ৳
                          {((item.price ?? 0) * (item.quantity ?? 1)).toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="rounded-lg">
              Close
            </Button>
          </DialogClose>
          {canEditOrder && canEdit && onEdit && order && (
            <button
              onClick={() => {
                onOpenChange(false);
                onEdit();
              }}
              className={cn(
                "group relative overflow-hidden inline-flex items-center gap-1.5",
                "rounded-lg px-4 py-2 text-sm font-semibold text-white",
                "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500",
                "transition-all duration-200 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1",
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
              />
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              Edit Order
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
