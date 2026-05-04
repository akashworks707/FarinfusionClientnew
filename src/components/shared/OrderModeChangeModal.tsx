/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  FilePenLine,
  TimerIcon,
  Zap,
  PauseCircle,
  CalendarClock,
  Calendar,
  Clock,
  User,
  Phone,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { toast } from "sonner";

import { useUpdateOrderMutation } from "@/redux/features/orders/ordersApi";

import type { Order } from "@/types/orders";

import { format, parse } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";

interface EditOrderModalProps {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Derive all schedule-related state from the order in one place.
function deriveScheduleState(order: Order | null) {
  const type =
    ((order as any)?.scheduleType as "INSTANT" | "SCHEDULED" | "HOLD") ||
    "INSTANT";

  const rawScheduledAt = (order as any)?.scheduledAt;

  const scheduledAt = rawScheduledAt
    ? new Date(rawScheduledAt).toISOString().slice(0, 16)
    : undefined;

  let selectedDate: Date | undefined;
  let time = "09:00";

  if (scheduledAt) {
    const parsed = parse(scheduledAt, "yyyy-MM-dd'T'HH:mm", new Date());
    selectedDate = parsed;
    time = format(parsed, "HH:mm");
  }

  return { type, scheduledAt, selectedDate, time };
}

export function OrderModeChangeModal({
  open,
  order,
  onOpenChange,
  onSuccess,
}: EditOrderModalProps) {
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [state, setState] = useState<{
    scheduleType: "INSTANT" | "SCHEDULED" | "HOLD";
    scheduledAt?: string;
    selectedDate?: Date;
    time: string;
    calendarOpen: boolean;
  }>(() => {
    const derived = deriveScheduleState(order);
    return {
      scheduleType: derived.type,
      scheduledAt: derived.scheduledAt,
      selectedDate: derived.selectedDate,
      time: derived.time,
      calendarOpen: false,
    };
  });

  const prevOrderId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!open) return;

    const currentId = (order as any)?._id;
    if (currentId === prevOrderId.current) return;
    prevOrderId.current = currentId;

    const derived = deriveScheduleState(order);
    setState({
      scheduleType: derived.type,
      scheduledAt: derived.scheduledAt,
      selectedDate: derived.selectedDate,
      time: derived.time,
      calendarOpen: false,
    });
  }, [order, open]);

  const isInstant = state.scheduleType === "INSTANT";
  const isScheduled = state.scheduleType === "SCHEDULED";
  const isHold = state.scheduleType === "HOLD";

  // Build a local datetime string from a date + time string.
  const buildLocalDateTime = (date: Date, timeStr: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const [hours, minutes] = timeStr.split(":");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setState((prev) => ({
      ...prev,
      selectedDate: date,
      scheduleType: "SCHEDULED",
      scheduledAt: buildLocalDateTime(date, prev.time),
      calendarOpen: false,
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setState((prev) => ({
      ...prev,
      time: newTime,
      scheduledAt: prev.selectedDate
        ? buildLocalDateTime(prev.selectedDate, newTime)
        : prev.scheduledAt,
    }));
  };

  const formattedDate = state.selectedDate
    ? format(state.selectedDate, "dd MMM, yyyy")
    : "Select date";

  const HandleUpload = async () => {
    if (!(order as any)?._id) return;

    try {
      let payload: any = {};

      if (isInstant) {
        payload = {
          scheduleType: "INSTANT",
          isPublished: true,
          scheduledAt: null,
        };
      }

      if (isScheduled) {
        if (!state.scheduledAt) {
          toast.error("Please select schedule date & time");
          return;
        }
        payload = {
          scheduleType: "SCHEDULED",
          isPublished: false,
          scheduledAt: state.scheduledAt,
        };
      }

      if (isHold) {
        payload = { scheduleType: "HOLD", isPublished: false };
      }

      await updateOrder({
        _id: (order as any)._id,
        data: payload,
      }).unwrap();

      toast.success("Order updated successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update order");
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full overflow-hidden rounded-2xl border-gray-200/80 p-0 gap-0 sm:max-w-2xl dark:border-gray-700/60">
        {/* top */}
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500" />

        {/* header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <TimerIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>

          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
              Change Order Timing
            </DialogTitle>

            <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
              {(order as any)?.customOrderId
                ? `Order ${(order as any).customOrderId}`
                : `ID: ${(order as any)?._id?.slice(0, 14)}…`}
            </DialogDescription>
          </div>
        </div>

        {/* body */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Order Timing
          </p>

          {/* buttons */}
          <div className="flex flex-wrap gap-2">
            {/* instant */}
            <Button
              type="button"
              onClick={() =>
                setState((prev) => ({ ...prev, scheduleType: "INSTANT" }))
              }
              className={cn(
                "flex-1 rounded-lg text-xs font-semibold transition-all duration-200",
                isInstant
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-150 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
              )}
            >
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Instant Order
            </Button>

            {/* scheduled */}
            <Button
              type="button"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  scheduleType: "SCHEDULED",
                  scheduledAt:
                    prev.scheduledAt ||
                    format(new Date(), "yyyy-MM-dd'T'09:00"),
                }))
              }
              className={cn(
                "flex-1 rounded-lg text-xs font-semibold transition-all duration-200",
                isScheduled
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-150 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
              )}
            >
              <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
              Schedule Order
            </Button>

            {/* hold */}
            <Button
              type="button"
              onClick={() =>
                setState((prev) => ({ ...prev, scheduleType: "HOLD" }))
              }
              className={cn(
                "flex-1 max-w-43 rounded-lg text-xs font-semibold transition-all duration-200",
                isHold
                  ? "bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-150 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
              )}
            >
              <PauseCircle className="h-3.5 w-3.5 mr-1.5" />
              Hold Orders
            </Button>
          </div>

          {/* schedule section */}
          {isScheduled && (
            <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* date */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Select Date
                  </label>

                  <Popover
                    open={state.calendarOpen}
                    onOpenChange={(open) =>
                      setState((prev) => ({ ...prev, calendarOpen: open }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <button className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-blue-400 hover:bg-blue-50/30 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-gray-600/50 transition-all duration-200 text-left flex items-center justify-between">
                        <span>{formattedDate}</span>
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      align="start"
                      className="w-auto p-3 rounded-xl"
                    >
                      <CalendarComponent
                        mode="single"
                        selected={state.selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* time */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Time
                  </label>

                  <Input
                    type="time"
                    value={state.time}
                    onChange={handleTimeChange}
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* summary */}
              {state.selectedDate && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <span className="font-semibold">Scheduled for:</span>{" "}
                    {format(state.selectedDate, "EEEE, dd MMMM, yyyy")} at{" "}
                    {state.time}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* product show */}
        <Card className="mx-4">
          <div className="border-b border-border">
            <div className="flex items-center justify-between px-4 pb-2 ">
              <span className="text-sm font-medium">Order items</span>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 rounded-full">
                {order?.products?.length} items
              </span>
            </div>

            <div className="flex flex-wrap gap-5 items-center space-y-1 rounded-lg border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-900/40">
              {/* Name */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {order?.billingDetails?.fullName || "N/A"}
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {order?.billingDetails?.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <ScrollArea className="overflow-y-auto h-[30vh]">
            {order?.products?.map((item: any) => (
              <div
                key={item?._id}
                className="flex items-center gap-3.5 px-4 py-3.5 border-b border-border last:border-0 hover:cursor-pointer hover:bg-amber-50 duration-500 transition-all"
              >
                <Image
                  src={item?.product?.images[0]}
                  alt={item?.product?.title}
                  width={52}
                  height={52}
                  className="w-13 h-13 rounded-lg object-cover border border-border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item?.product?.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    SKU #{item?.product?.sku}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">${item?.product?.price}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Qty: {item?.quantity}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </Card>

        {/* footer */}
        <DialogFooter className="mb-4 border-t border-gray-100 px-6 pt-4 dark:border-gray-800">
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={isUpdating}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <button
              type="button"
              onClick={HandleUpload}
              disabled={isUpdating}
              className={cn(
                "group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold text-white",
                "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600",
                "transition-all duration-200 active:scale-95",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
              />

              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <FilePenLine className="h-3.5 w-3.5" />
                  Save Changes
                </span>
              )}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
