"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { OrderStatus } from "@/types/orders";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

export interface DateFilter {
  from: Date | undefined;
  to: Date | undefined;
}

export type DateType =
  | "created"
  | "confirmed"
  | "courierAssigned"
  | "pickedUp"
  | "delivered"
  | "partial"
  | "cancelled"
  | "hold"
   | "noResponse";

export interface OrderFiltersProps {
  statusFilter: OrderStatus | "";
  deliveryStatusFilter: string;
  searchFilter: string;
  dateFilter: DateFilter;
  dateType: DateType;
  onStatusChange: (status: OrderStatus | "") => void;
  onDeliveryStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
  onDateChange: (date: DateFilter) => void;
  onDateTypeChange?: (type: DateType) => void;
  onReset: () => void;
  totalResults?: number;
}

const ORDER_STATUSES: {
  value: OrderStatus;
  label: string;
  dot: string;
  chip: string;
}[] = [
  {
    value: "PENDING",
    label: "Pending",
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    dot: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    dot: "bg-red-500",
    chip: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },

  {
    value: "NO_RESPONSE",
    label: "No Response",
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
  },
];

const DELIVERY_STATUSES = [
  { value: "PENDING",          label: "Pending",           dot: "bg-amber-500",   chip: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" },
  { value: "NOT_SHIPPED",      label: "Not Shipped",       dot: "bg-slate-500",   chip: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800" },
  { value: "IN_REVIEW",        label: "In Review",         dot: "bg-purple-500",  chip: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800" },
  { value: "COURIERASSIGNED",  label: "Courier Assigned",  dot: "bg-violet-500",  chip: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800" },
  { value: "IN_TRANSIT",       label: "In Transit",        dot: "bg-blue-500",    chip: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" },
  { value: "PICKED_UP",        label: "Picked Up",         dot: "bg-cyan-500",    chip: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800" },
  { value: "DELIVERED",        label: "Delivered",         dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" },
  { value: "PARTIAL",          label: "Partial Delivered", dot: "bg-violet-500",  chip: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800" },
  { value: "CANCELLED",        label: "Cancelled",         dot: "bg-red-500",     chip: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" },
  { value: "HOLD",             label: "On Hold",           dot: "bg-orange-500",  chip: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" },
];

const DATE_TYPES: { value: DateType; label: string; dot: string }[] = [
  { value: "created",        label: "Order",     dot: "bg-slate-400"  },
  { value: "confirmed",      label: "Confirmed At",      dot: "bg-emerald-500"},
  { value: "courierAssigned",label: "Courier Assigned",  dot: "bg-violet-500" },
  { value: "pickedUp",       label: "Picked Up",         dot: "bg-cyan-500"   },
  { value: "delivered",      label: "Delivered At",      dot: "bg-blue-500"   },
  { value: "partial",        label: "Partial Delivered", dot: "bg-orange-500" },
  { value: "cancelled",      label: "Cancelled At",      dot: "bg-red-500"    },
  { value: "hold",           label: "On Hold At",        dot: "bg-amber-500"  },
  { value: "noResponse",      label: "No Response At",   dot: "bg-rose-500"    },
];

const PRESETS = [
  {
    label: "Today",
    get: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }),
  },
  {
    label: "Yesterday",
    get: () => {
      const y = new Date(); y.setDate(y.getDate() - 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    },
  },
  {
    label: "This week",
    get: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "This month",
    get: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
  },
  {
    label: "Last 30 days",
    get: () => {
      const d = new Date(); d.setDate(d.getDate() - 30);
      return { from: startOfDay(d), to: endOfDay(new Date()) };
    },
  },
];

function formatDateRange(from: Date | undefined, to: Date | undefined): string {
  if (!from) return "Pick a date";
  const fromStr = format(from, "MMM d, yyyy HH:mm");
  if (!to || isSameDay(from, to)) return fromStr;
  return `${format(from, "MMM d HH:mm")} – ${format(to, "MMM d, yyyy HH:mm")}`;
}

function getActivePresetLabel(from: Date | undefined, to: Date | undefined): string | null {
  if (!from || !to) return null;
  for (const preset of PRESETS) {
    const p = preset.get();
    if (isSameDay(p.from, from) && isSameDay(p.to, to)) return preset.label;
  }
  return null;
}

// Apply hour/min/sec to a Date without mutating
function applyTime(date: Date, h: number, m: number, s: number): Date {
  return setSeconds(setMinutes(setHours(date, h), m), s);
}

function parseTimeString(t: string): { h: number; m: number } {
  const [h = 0, m = 0] = t.split(":").map(Number);
  return { h, m };
}

interface TimeInputProps {
  label: string;
  value: string; // "HH:mm"
  onChange: (val: string) => void;
  accentClass: string;
}

function TimeInput({ label, value, onChange, accentClass }: TimeInputProps) {
  return (
    <div className="flex-1 space-y-1">
      <p className={cn("text-[10px] font-bold uppercase tracking-widest", accentClass)}>
        {label}
      </p>
      <div className="relative">
        <Clock className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-9 w-full rounded-lg border bg-white pl-7 pr-2 text-sm font-mono",
            "text-gray-900 dark:text-gray-50",
            "border-gray-200 dark:border-gray-700 dark:bg-gray-800/60",
            "focus:outline-none focus:ring-1 focus:ring-amber-400 dark:focus:ring-amber-500",
            "transition-colors",
          )}
        />
      </div>
    </div>
  );
}

export function OrderFilters({
  statusFilter,
  searchFilter,
  dateFilter,
  dateType,
  onStatusChange,
  onSearchChange,
  deliveryStatusFilter,
  onDeliveryStatusChange,
  onDateChange,
  onReset,
  totalResults,
}: OrderFiltersProps) {

  const [localSearch, setLocalSearch] = useState(searchFilter);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarRange, setCalendarRange] = useState<DateRange | undefined>(
    dateFilter.from ? { from: dateFilter.from, to: dateFilter.to } : undefined,
  );

  const [fromTime, setFromTime] = useState<string>(
    dateFilter.from ? format(dateFilter.from, "HH:mm") : "00:00",
  );
  const [toTime, setToTime] = useState<string>(
    dateFilter.to ? format(dateFilter.to, "HH:mm") : "23:59",
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setLocalSearch(searchFilter); }, [searchFilter]);

  useEffect(() => {
    setCalendarRange(
      dateFilter.from ? { from: dateFilter.from, to: dateFilter.to } : undefined,
    );
    if (dateFilter.from) setFromTime(format(dateFilter.from, "HH:mm"));
    if (dateFilter.to)   setToTime(format(dateFilter.to,   "HH:mm"));
  }, [dateFilter]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearchChange(val), 400);
  };

  const clearSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalSearch(""); onSearchChange("");
  };

  const emitDate = (
    range: DateRange | undefined,
    fTime: string,
    tTime: string,
  ) => {
    if (!range?.from) {
      onDateChange({ from: undefined, to: undefined });
      return;
    }
    const { h: fh, m: fm } = parseTimeString(fTime);
    const { h: th, m: tm } = parseTimeString(tTime);

    const from = applyTime(range.from, fh, fm, 0);
    const to   = range.to ? applyTime(range.to, th, tm, 59) : applyTime(range.from, th, tm, 59);
    onDateChange({ from, to });
  };

  const applyPreset = (preset: typeof PRESETS[number]) => {
    const { from, to } = preset.get();
    const newRange = { from, to };
    setCalendarRange(newRange);
    setFromTime("00:00");
    setToTime("23:59");
    emitDate(newRange, "00:00", "23:59");
    setCalendarOpen(false);
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setCalendarRange(range);
    if (range?.from) {
      emitDate(range, fromTime, toTime);
    } else {
      onDateChange({ from: undefined, to: undefined });
    }
  };

  const handleFromTimeChange = (val: string) => {
    setFromTime(val);
    emitDate(calendarRange, val, toTime);
  };

  const handleToTimeChange = (val: string) => {
    setToTime(val);
    emitDate(calendarRange, fromTime, val);
  };

  const clearDate = () => {
    setCalendarRange(undefined);
    setFromTime("00:00");
    setToTime("23:59");
    onDateChange({ from: undefined, to: undefined });
  };

  const activeStatus        = ORDER_STATUSES.find((s) => s.value === statusFilter);
  const activeDeliveryStatus= DELIVERY_STATUSES.find((s) => s.value === deliveryStatusFilter);
  const activeDateType      = DATE_TYPES.find((d) => d.value === dateType);
  const activeDateLabel     = getActivePresetLabel(dateFilter.from, dateFilter.to);
  const dateDisplayLabel    = dateFilter.from ? formatDateRange(dateFilter.from, dateFilter.to) : null;

  const hasActiveFilters =
    !!statusFilter || !!deliveryStatusFilter || !!searchFilter || !!dateFilter.from;

    return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900 space-y-3">

      {/* ── Row 1: Search + Status selects ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">

        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer, phone…"
            value={localSearch}
            onChange={handleSearchInput}
            className="h-10 pl-9 pr-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 transition-colors"
          />
          {localSearch && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Order Status */}
        <div className="flex shrink-0 items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />
          <Select
            value={statusFilter || "all"}
            onValueChange={(val) => onStatusChange(val === "all" ? "" : (val as OrderStatus))}
          >
            <SelectTrigger className="h-10 w-44 rounded-lg border-gray-200 bg-gray-50/60 text-sm dark:border-gray-700 dark:bg-gray-800/60 transition-colors">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="cursor-pointer text-sm">All Statuses</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="cursor-pointer text-sm">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", s.dot)} />
                    {s.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Delivery Status */}
          <Select
            value={deliveryStatusFilter || "all"}
            onValueChange={(val) => onDeliveryStatusChange(val === "all" ? "" : val)}
          >
            <SelectTrigger className="h-10 w-44 rounded-lg border-gray-200 bg-gray-50/60 text-sm dark:border-gray-700 dark:bg-gray-800/60 transition-colors">
              <SelectValue placeholder="Delivery Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="cursor-pointer text-sm">All Deliveries</SelectItem>
              {DELIVERY_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="cursor-pointer text-sm">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", s.dot)} />
                    {s.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Date type + Date-time picker (grouped pill) ── */}
        <div className="flex shrink-0 items-center gap-0 rounded-lg border border-gray-200 bg-gray-50/60 dark:border-gray-700 dark:bg-gray-800/60 overflow-hidden">

          {/* Date type selector
          {onDateTypeChange && (
            <>
              <Select
                value={dateType}
                onValueChange={(v) => onDateTypeChange(v as DateType)}
              >
                <SelectTrigger className="h-10 gap-1.5 border-0 border-r border-gray-200 dark:border-gray-700 bg-transparent rounded-none w-40 text-xs font-semibold text-gray-600 dark:text-gray-400 focus:ring-0 shadow-none">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", activeDateType?.dot ?? "bg-slate-400")} />
                    <span className="truncate">{activeDateType?.label ?? "Date type"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {DATE_TYPES.map((dt) => (
                    <SelectItem key={dt.value} value={dt.value} className="cursor-pointer text-sm">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", dt.dot)} />
                        {dt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )} */}

          {/* Date-time range trigger */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "inline-flex h-10 items-center gap-2 px-3 text-sm font-medium transition-colors duration-150 focus:outline-none",
                  dateFilter.from
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200",
                )}
              >
                {dateFilter.from ? (
                  <CalendarRange className="h-4 w-4 shrink-0" />
                ) : (
                  <CalendarDays className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate max-w-40">
                  {dateDisplayLabel ?? "Pick date & time"}
                </span>
                <ChevronDown className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                  calendarOpen && "rotate-180",
                )} />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              side="bottom"
              className="w-auto p-0 rounded-2xl border-gray-200/80 dark:border-gray-700/60 shadow-xl overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">

                {/* ── Left: presets ── */}
                <div className="border-b border-gray-100 dark:border-gray-800 sm:border-b-0 sm:border-r sm:w-36 p-3 space-y-0.5">
                  <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Quick select
                  </p>
                  {PRESETS.map((preset) => {
                    const p = preset.get();
                    const isActive =
                      dateFilter.from && dateFilter.to &&
                      isSameDay(p.from, dateFilter.from) &&
                      isSameDay(p.to, dateFilter.to);
                    return (
                      <button
                        key={preset.label}
                        onClick={() => applyPreset(preset)}
                        className={cn(
                          "w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                          isActive
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800",
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                  {dateFilter.from && (
                    <>
                      <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />
                      <button
                        onClick={() => { clearDate(); setCalendarOpen(false); }}
                        className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Clear all
                      </button>
                    </>
                  )}
                </div>

                {/* ── Right: calendar + time ── */}
                <div className="p-3 space-y-3">
                  <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Custom range
                  </p>

                  {/* Calendar */}
                  <Calendar
                    mode="range"
                    selected={calendarRange}
                    onSelect={handleCalendarSelect}
                    numberOfMonths={1}
                    disabled={{ after: new Date() }}
                    initialFocus
                    className="rounded-xl"
                    classNames={{
                      day_selected:
                        "bg-amber-500 text-white hover:bg-amber-500 focus:bg-amber-500 dark:bg-amber-600",
                      day_range_middle:
                        "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                      day_range_start:
                        "bg-amber-500 text-white rounded-l-full dark:bg-amber-600",
                      day_range_end:
                        "bg-amber-500 text-white rounded-r-full dark:bg-amber-600",
                      day_today:
                        "border border-amber-400 text-amber-700 font-bold dark:border-amber-500 dark:text-amber-400",
                    }}
                  />

                  {/* ── Time range inputs ── */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40 space-y-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Time Range
                      </span>
                    </div>

                    <div className="flex items-end gap-2">
                      <TimeInput
                        label="From"
                        value={fromTime}
                        onChange={handleFromTimeChange}
                        accentClass="text-amber-600 dark:text-amber-400"
                      />

                      <div className="flex h-9 items-center pb-0.5">
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                      </div>

                      <TimeInput
                        label="To"
                        value={toTime}
                        onChange={handleToTimeChange}
                        accentClass="text-blue-600 dark:text-blue-400"
                      />
                    </div>

                    {/* Active date range summary */}
                    {calendarRange?.from && (() => {
                      const { h: fh, m: fm } = parseTimeString(fromTime);
                      const { h: th, m: tm } = parseTimeString(toTime);
                      const fromDt = applyTime(calendarRange.from, fh, fm, 0);
                      const toDt   = calendarRange.to
                        ? applyTime(calendarRange.to,   th, tm, 59)
                        : applyTime(calendarRange.from, th, tm, 59);
                      return (
                        <div className="mt-2 rounded-lg border border-amber-200/60 bg-amber-50/40 px-2.5 py-1.5 dark:border-amber-900/30 dark:bg-amber-900/10">
                          <p className="text-[11px] font-mono text-amber-800 dark:text-amber-300 leading-relaxed">
                            {format(fromDt, "MMM d, yyyy · HH:mm")}
                            {" "}
                            <span className="text-amber-400">→</span>
                            {" "}
                            {format(toDt, "MMM d, yyyy · HH:mm")}
                          </p>
                        </div>
                      );
                    })()}

                    {calendarRange?.from && !calendarRange?.to && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 px-0.5">
                        Select an end date to complete the range
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Inline clear */}
          {dateFilter.from && (
            <button
              onClick={clearDate}
              aria-label="Clear date filter"
              className="h-10 px-2.5 text-gray-400 hover:text-red-500 border-l border-gray-200 dark:border-gray-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-10 shrink-0 gap-1.5 rounded-lg border-gray-200 text-gray-600 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* ── Active filter chips ── */}
      {(hasActiveFilters || totalResults !== undefined) && (
        <div className="flex flex-wrap items-center gap-2">
          {totalResults !== undefined && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {totalResults} result{totalResults !== 1 ? "s" : ""}
              {hasActiveFilters && " matching filters"}
            </span>
          )}

          {searchFilter && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
            >
              <Search className="h-3 w-3" />
              &quot;{searchFilter}&quot;
              <button onClick={clearSearch} aria-label="Remove search" className="ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {activeStatus && (
            <Badge
              variant="outline"
              className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", activeStatus.chip)}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", activeStatus.dot)} />
              {activeStatus.label}
              <button onClick={() => onStatusChange("")} aria-label="Remove status" className="ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {activeDeliveryStatus && (
            <Badge
              variant="outline"
              className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", activeDeliveryStatus.chip)}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", activeDeliveryStatus.dot)} />
              {activeDeliveryStatus.label}
              <button onClick={() => onDeliveryStatusChange("")} aria-label="Remove delivery status" className="ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {dateFilter.from && (
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
            >
              <Clock className="h-3 w-3" />
              {activeDateType && (
                <span className="font-normal text-gray-500 dark:text-gray-400">
                  {activeDateType.label}:
                </span>
              )}
              {activeDateLabel ?? formatDateRange(dateFilter.from, dateFilter.to)}
              <button onClick={clearDate} aria-label="Remove date filter" className="ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}