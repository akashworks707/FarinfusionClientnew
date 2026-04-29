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
} from "lucide-react";
import type { OrderStatus } from "@/types/orders";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

export interface DateFilter {
  from: Date | undefined;
  to: Date | undefined;
}

export interface OrderFiltersProps {
  statusFilter: OrderStatus | "";
  searchFilter: string;
  dateFilter: DateFilter;
  onStatusChange: (status: OrderStatus | "") => void;
  onSearchChange: (search: string) => void;
  onDateChange: (date: DateFilter) => void;
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
];

const PRESETS = [
  {
    label: "Today",
    get: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }),
  },
  {
    label: "Yesterday",
    get: () => {
      const y = new Date();
      y.setDate(y.getDate() - 1);
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
    get: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last 30 days",
    get: () => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return { from: startOfDay(d), to: endOfDay(new Date()) };
    },
  },
];

function formatDateRange(from: Date | undefined, to: Date | undefined): string {
  if (!from) return "Pick a date";
  if (!to || isSameDay(from, to)) return format(from, "MMM d, yyyy");
  return `${format(from, "MMM d")} – ${format(to, "MMM d, yyyy")}`;
}

function getActivePresetLabel(
  from: Date | undefined,
  to: Date | undefined,
): string | null {
  if (!from || !to) return null;
  for (const preset of PRESETS) {
    const p = preset.get();
    if (isSameDay(p.from, from) && isSameDay(p.to, to)) return preset.label;
  }
  return null;
}

export function OrderFilters({
  statusFilter,
  searchFilter,
  dateFilter,
  onStatusChange,
  onSearchChange,
  onDateChange,
  onReset,
  totalResults,
}: OrderFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchFilter);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarRange, setCalendarRange] = useState<DateRange | undefined>(
    dateFilter.from ? { from: dateFilter.from, to: dateFilter.to } : undefined,
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(searchFilter);
  }, [searchFilter]);

  useEffect(() => {
    setCalendarRange(
      dateFilter.from
        ? { from: dateFilter.from, to: dateFilter.to }
        : undefined,
    );
  }, [dateFilter]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearchChange(val), 400);
  };

  const clearSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalSearch("");
    onSearchChange("");
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    const { from, to } = preset.get();
    setCalendarRange({ from, to });
    onDateChange({ from, to });
    setCalendarOpen(false);
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setCalendarRange(range);
    if (range?.from && range?.to) {
      onDateChange({
        from: startOfDay(range.from),
        to: endOfDay(range.to),
      });
    } else if (range?.from && !range?.to) {
      onDateChange({
        from: startOfDay(range.from),
        to: endOfDay(range.from),
      });
    } else {
      onDateChange({ from: undefined, to: undefined });
    }
  };

  const clearDate = () => {
    setCalendarRange(undefined);
    onDateChange({ from: undefined, to: undefined });
  };

  const hasActiveFilters =
    !!statusFilter || !!searchFilter || !!dateFilter.from;
  const activeStatus = ORDER_STATUSES.find((s) => s.value === statusFilter);
  const activeDateLabel = getActivePresetLabel(dateFilter.from, dateFilter.to);
  const dateDisplayLabel = dateFilter.from
    ? formatDateRange(dateFilter.from, dateFilter.to)
    : null;

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-50">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer, email…"
            value={localSearch}
            onChange={handleSearchInput}
            className="h-10 pl-9 pr-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-blue-500 transition-colors"
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

        {/* Status */}
        <div className="flex shrink-0 items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />
          <Select
            value={statusFilter || "all"}
            onValueChange={(val) =>
              onStatusChange(val === "all" ? "" : (val as OrderStatus))
            }
          >
            <SelectTrigger className="h-10 w-44 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-blue-500 transition-colors">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="cursor-pointer text-sm">
                All Statuses
              </SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem
                  key={s.value}
                  value={s.value}
                  className="cursor-pointer text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", s.dot)} />
                    {s.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date picker */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "group inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-all duration-200",
                dateFilter.from
                  ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "border-gray-200 bg-gray-50/60 text-gray-600 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800",
              )}
            >
              {dateFilter.from ? (
                <CalendarRange className="h-4 w-4 shrink-0" />
              ) : (
                <CalendarDays className="h-4 w-4 shrink-0" />
              )}
              <span className="truncate max-w-35">
                {dateDisplayLabel ?? "Filter by date"}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                  calendarOpen && "rotate-180",
                )}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            side="bottom"
            className="w-auto p-0 rounded-2xl border-gray-200/80 dark:border-gray-700/60 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              {/* ── Presets panel ── */}
              <div className="border-b border-gray-100 dark:border-gray-800 sm:border-b-0 sm:border-r sm:w-36 p-3 space-y-0.5">
                <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Quick select
                </p>
                {PRESETS.map((preset) => {
                  const p = preset.get();
                  const isActive =
                    dateFilter.from &&
                    dateFilter.to &&
                    isSameDay(p.from, dateFilter.from) &&
                    isSameDay(p.to, dateFilter.to);

                  return (
                    <button
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      className={cn(
                        "w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors duration-150",
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
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
                      onClick={() => {
                        clearDate();
                        setCalendarOpen(false);
                      }}
                      className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Clear date
                    </button>
                  </>
                )}
              </div>

              {/* ── Calendar ── */}
              <div className="p-3">
                <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Custom range
                </p>
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
                      "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600 dark:bg-blue-700",
                    day_range_middle:
                      "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                    day_range_start:
                      "bg-blue-600 text-white rounded-l-full dark:bg-blue-700",
                    day_range_end:
                      "bg-blue-600 text-white rounded-r-full dark:bg-blue-700",
                    day_today:
                      "border border-blue-400 text-blue-700 font-bold dark:border-blue-500 dark:text-blue-400",
                  }}
                />
                {/* Apply button for range — show when from selected but no to yet */}
                {calendarRange?.from && !calendarRange?.to && (
                  <div className="mt-2 px-1">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                      Click another date to complete the range, or single date
                      shows one day.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-10 shrink-0 gap-1.5 rounded-lg border-gray-200 text-gray-600 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset all
          </Button>
        )}
      </div>

      {/* ── Active filter chips + result count ── */}
      {(hasActiveFilters || totalResults !== undefined) && (
        <div className="flex flex-wrap items-center gap-2">
          {totalResults !== undefined && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {totalResults} result{totalResults !== 1 ? "s" : ""}
              {hasActiveFilters && " matching filters"}
            </span>
          )}

          {/* Search chip */}
          {searchFilter && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            >
              <Search className="h-3 w-3" />
              &quot;{searchFilter}&quot;
              <button
                onClick={clearSearch}
                aria-label="Remove search"
                className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Status chip */}
          {activeStatus && (
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                activeStatus.chip,
              )}
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full", activeStatus.dot)}
              />
              {activeStatus.label}
              <button
                onClick={() => onStatusChange("")}
                aria-label="Remove status"
                className="ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Date chip */}
          {dateFilter.from && (
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 rounded-full border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            >
              <CalendarDays className="h-3 w-3" />
              {activeDateLabel ??
                formatDateRange(dateFilter.from, dateFilter.to)}
              <button
                onClick={clearDate}
                aria-label="Remove date filter"
                className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
