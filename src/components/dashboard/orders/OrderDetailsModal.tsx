/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { CourierInfo } from "./CourierInfo";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Car,
  Zap,
  Wallet,
  Banknote,
  User2,
  MinusCircle,
  PackageSearch,
} from "lucide-react";
import { format } from "date-fns";
import type { Order } from "@/types/orders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetCourierByOrderIdQuery } from "@/lib/hooks";

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const { data: courierRes } = useGetCourierByOrderIdQuery(order?._id || "", {
    skip: !order?._id,
  });

  const courier = courierRes?.data;

  if (!order) return null;

  const isWaitingForStock = order.orderStatus === "WAITING_FOR_STOCK";
  const hasIncompleteReservation = order.stockReservationCompleted === false;

  const totalReserved =
    order.products?.reduce(
      (sum: number, p: any) =>
        sum + (p.reservedQuantity ?? p.quantity ?? 0),
      0,
    ) ?? 0;

  const totalPending =
    order.products?.reduce(
      (sum: number, p: any) => sum + (p.pendingQuantity ?? 0),
      0,
    ) ?? 0;

  const showStockReservationCard =
    isWaitingForStock || hasIncompleteReservation || !!order.waitingStockResolvedAt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <ScrollArea className="max-h-[90vh] overflow-y-auto pr-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <Badge variant="outline" className="font-mono">
                {order.customOrderId || order._id?.slice(0, 10)}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Created on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status Section */}
            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-semibold">Status Information</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Order Status</p>
                  <div className="mt-1">
                    {isWaitingForStock ? (
                      <Badge
                        variant="outline"
                        className="gap-1 border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                      >
                        <PackageSearch className="h-3.5 w-3.5" />
                        Waiting for Stock
                      </Badge>
                    ) : (
                      <OrderStatusBadge status={order.orderStatus} type="order" />
                    )}
                  </div>
                </div>
                {order.confirmedBy && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Confirmed By
                    </p>

                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-700"
                      >
                        <User2 className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {order?.confirmedBy?.name}
                        </span>
                      </Badge>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Delivery Status
                  </p>
                  <div className="mt-1">
                    <OrderStatusBadge
                      status={order.deliveryStatus}
                      type="delivery"
                    />
                  </div>
                </div>
              </div>
              {order.scheduledAt && (
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      Scheduled Order
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {format(new Date(order.scheduledAt), "PPpp")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Scheduled processing date & time
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stock Reservation Summary */}
            {showStockReservationCard && (
              <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-800/60 dark:bg-amber-900/10">
                <div className="flex items-center gap-2">
                  <PackageSearch className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    Stock Reservation
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Reserved
                    </p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                      {Number(totalReserved)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Pending
                    </p>
                    <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                      {Number(totalPending)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-semibold">
                      {order.stockReservationCompleted
                        ? "Fully Reserved"
                        : "Waiting for Stock"}
                    </p>
                  </div>
                </div>

                {order.waitingStockResolvedAt && (
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Resolved on{" "}
                    {format(new Date(order.waitingStockResolvedAt), "PPpp")}
                  </p>
                )}
              </div>
            )}

            {/* Customer Information */}
            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-semibold">Customer Information</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {order.billingDetails?.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{order.billingDetails?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.billingDetails?.phone}</p>
                  </div>
                </div>
                {order?.billingDetails?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Shipping Address
                      </p>
                      <p className="font-medium">
                        {order.billingDetails?.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Order Items</p>
                {hasIncompleteReservation && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                  >
                    <PackageSearch className="h-3 w-3" />
                    Partially Reserved
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                {order?.products.map((product: any, idx: number) => {
                  const reserved =
                    product.reservedQuantity ?? product.quantity;
                  const pending = product.pendingQuantity ?? 0;
                  const itemIsWaiting =
                    product.isWaitingStock || pending > 0;

                  return (
                    <div
                      key={idx}
                      className="border-t pt-2 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">
                            {product.product?.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {product.quantity} × ৳
                            {product?.price?.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">
                          ৳{(product.quantity * product.price)?.toFixed(2)}
                        </p>
                      </div>

                      {itemIsWaiting && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                          >
                            Reserved: {reserved}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                          >
                            Pending: {pending}
                          </Badge>
                          {product.fulfilledAt && (
                            <span className="text-[11px] text-muted-foreground">
                              Fulfilled{" "}
                              {format(new Date(product.fulfilledAt), "PPp")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* delivery charge */}
            <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Delivery Charge</span>
                </div>
                <p className="text-xl font-bold">৳{order?.shippingCost}</p>
              </div>

              {(order?.discount ?? 0) > 0 && (
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MinusCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Discount</span>
                </div>
                <p className="text-xl text-gray-700 font-semibold">- ৳{order?.discount}</p>
              </div>

              )}
            </div>

            <div className="space-y-3 rounded-lg border p-4 bg-white dark:bg-gray-900">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Advance Payment
              </p>

              <div className="flex items-center justify-between space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">Method:</span>
                  <span className="capitalize">
                    {order?.advanceDetails?.option || "N/A"}
                  </span>
                </p>

                {order?.advanceDetails?.amount > 0 && (
                  <p className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Amount:</span>
                    <span className="font-semibold text-green-600">
                      ৳{order?.advanceDetails?.amount ?? 0}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Total Amount</span>
                </div>
                <p className="text-xl font-bold">৳{order?.total?.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  Updated: {new Date(order.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {courier && <CourierInfo courier={courier} />}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}