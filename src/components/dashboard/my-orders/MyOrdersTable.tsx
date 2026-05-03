/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  FilePenLine,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ShoppingBag,
  Package,
  Trash,
  Trash2,
} from "lucide-react";
import type { Order } from "@/types/orders";
import { cn } from "@/lib/utils";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";
import { useGetAllCouriersQuery } from "@/lib/hooks";
import { format } from "date-fns";

export type UserRole =
  | "ADMIN"
  | "MODERATOR"
  | "MANAGER"
  | "TELLICELSS"
  | "CUSTOMER";

interface MyOrdersTableProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  userRole: UserRole;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onAssignCourier?: (order: Order) => void;
  setDeleteTarget?: (order: Order) => void;
  setDeleteOpen?: (open: boolean) => void;
  refetch: () => void;
}

const ORDER_STATUS: Record<
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

function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-xl bg-amber-50/60 dark:bg-amber-900/10"
        />
      ))}
    </div>
  );
}

export function MyOrdersTable({
  orders,
  loading,
  error,
  userRole,
  onView,
  onEdit,
  onAssignCourier,
  setDeleteTarget,
  setDeleteOpen,
}: MyOrdersTableProps) {
  // Role permissions
  const canEdit = ["ADMIN", "MODERATOR", "MANAGER", "TELLICELSS"].includes(
    userRole,
  );

  const { data: courierRes } = useGetAllCouriersQuery([], {
    pollingInterval: 10000,
  });
  const courierMap = new Map<string, any>();

  courierRes?.data?.forEach((c: any) => {
    courierMap.set(c.order, c);
  });

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/10">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            Failed to load orders
          </p>
          <p className="text-xs text-red-500 dark:text-red-500 mt-0.5">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <TableSkeleton />;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-200 dark:border-amber-900/30 py-16 gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
          <ShoppingBag className="h-7 w-7 text-amber-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            No orders found
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-700/60">
      <Table>
        <TableHeader>
          <TableRow className="bg-amber-50/60 hover:bg-amber-50/60 dark:bg-amber-900/10 dark:hover:bg-amber-900/10 border-b border-amber-100/80 dark:border-amber-900/20">
            {[
              "Order ID",
              "Assigned By",
              "Payment",
              "Customer",
              "Total",
              "Order Status",
              "Delivery Status",
              "Courier",
              "Date",
              "Actions",
            ].map((h) => (
              <TableHead
                key={h}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest text-amber-700/70 dark:text-amber-500/70",
                  h === "Total" && "text-right",
                  h === "Actions" && "text-center",
                )}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order, idx) => {
            const status =
              ORDER_STATUS[order.orderStatus ?? "PENDING"] ??
              ORDER_STATUS.PENDING;
            const StatusIcon = status.icon;
            const isConfirmed = order.orderStatus === "CONFIRMED";
            const moderatorEdit =
              ["MODERATOR"].includes(userRole) && !isConfirmed;
            const canEditOrder =
              moderatorEdit && canEdit && !order?.courierName;
            const courier = courierMap.get(order._id);
            // const canAssignCourier = canEdit && !order?.courierName;

            return (
              <TableRow
                key={order._id as string}
                className={cn(
                  "border-b border-gray-100/80 dark:border-gray-800/50 transition-colors duration-100",
                  idx % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-amber-50/20 dark:bg-amber-900/5",
                  "hover:bg-amber-50/60 dark:hover:bg-amber-900/10",
                )}
              >
                {/* Order ID */}
                <TableCell className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {order.customOrderId
                    ? `#${order.customOrderId}`
                    : (order._id as string)?.slice(0, 10) + "…"}
                </TableCell>

                <TableCell>
                  {order?.seller ? (
                    <div className="flex flex-col text-xs">
                      <span className="font-medium">{order?.seller?.name}</span>
                      <span className="text-muted-foreground">
                        {order?.seller?.role}
                      </span>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium">
                    {order?.transactionId && (
                      <span className="text-green-600">COD</span>
                    )}
                  </span>
                </TableCell>

                {/* Customer */}
                <TableCell>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug">
                      {order.billingDetails?.fullName ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                      {order.billingDetails?.phone ??
                        order.billingDetails?.email ??
                        ""}
                    </p>
                  </div>
                </TableCell>

                {/* Total */}
                <TableCell className="text-right">
                  <span className="font-bold tabular-nums text-amber-600 dark:text-amber-400">
                    ৳{order.total?.toFixed(2) ?? "0.00"}
                  </span>
                </TableCell>

                {/* Order Status */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex w-fit items-center gap-1.5 rounded-full border text-[10px] font-semibold",
                      status.cls,
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>

                {/* Delivery */}
                <TableCell>
                  {order.orderStatus === "CONFIRMED" && !courier ? (
                    <span className="text-xs text-yellow-600 flex items-center gap-1">
                      <Truck size={12} className="animate-pulse" />
                      Not assigned...
                    </span>
                  ) : order?.deliveryStatus ? (
                    <OrderStatusBadge
                      status={order?.deliveryStatus}
                      type="delivery"
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {courier ? (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Truck size={14} />
                      {courier.courierName}
                    </div>
                  ) : order.orderStatus === "CONFIRMED" ? (
                    <span className="text-xs text-yellow-600">
                      Not assigned...
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>

                {/* Date */}
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                    {order.scheduledAt && (
                      <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-[10px] font-medium text-blue-700 dark:text-blue-300 w-fit">
                        <Clock className="h-3 w-3" />
                        {format(new Date(order.scheduledAt), "MMM d, p")}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-xl"
                    >
                      {/* View */}
                      <DropdownMenuItem
                        className="gap-2 text-sm cursor-pointer"
                        onClick={() => onView(order)}
                      >
                        <Eye className="h-3.5 w-3.5 text-gray-500" />
                        View Details
                      </DropdownMenuItem>

                      {canEditOrder && (
                        <DropdownMenuItem
                          className="gap-2 text-sm cursor-pointer text-amber-600 focus:text-amber-600 dark:text-amber-400"
                          onClick={() => onEdit(order)}
                        >
                          <FilePenLine className="h-3.5 w-3.5" />
                          Edit Order
                        </DropdownMenuItem>
                      )}

                      {userRole === "ADMIN" && (
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteTarget?.(order);
                            setDeleteOpen?.(true);
                          }}
                           className="gap-2 text-sm cursor-pointer text-rose-600 focus:text-rose-600 dark:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      )}

                      {/* Assign Courier */}
                      {/* {canAssignCourier &&
                        isConfirmed &&
                        !(order as any).courierName &&
                        onAssignCourier && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-sm cursor-pointer text-blue-600 focus:text-blue-600 dark:text-blue-400"
                              onClick={() => onAssignCourier(order)}
                            >
                              <Truck className="h-3.5 w-3.5" />
                              Assign Courier
                            </DropdownMenuItem>
                          </>
                        )} */}

                      {/* Products count hint */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled
                        className="gap-2 text-xs text-gray-400 cursor-default"
                      >
                        <Package className="h-3.5 w-3.5" />
                        {order.products?.length ?? 0} item
                        {(order.products?.length ?? 0) !== 1 ? "s" : ""}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
