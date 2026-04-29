"use client";

import React, { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays, CalendarRange, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import {Button} from "@/components/ui/button";

type DateFilterProps = {
    onChange?: (value: { startDate?: string; endDate?: string }) => void;
};

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
    if (!from) return "Date Filter";
    if (!to || isSameDay(from, to)) return format(from, "MMM d, yyyy");
    return `${format(from, "MMM d")} – ${format(to, "MMM d, yyyy")}`;
}

const DateFilter = ({ onChange }: DateFilterProps) => {
    const [open, setOpen] = useState(false);
    const [calendarRange, setCalendarRange] = useState<DateRange | undefined>(undefined);
    const [dateFilter, setDateFilter] = useState<{ from?: Date; to?: Date }>({});

    const applyDate = (from: Date, to: Date) => {
        setDateFilter({ from, to });
        onChange?.({
            startDate: from.toISOString(),
            endDate: to.toISOString(),
        });
    };

    const applyPreset = (preset: (typeof PRESETS)[number]) => {
        const { from, to } = preset.get();
        setCalendarRange({ from, to });
        applyDate(from, to);
        setOpen(false);
    };

    const handleCalendarSelect = (range: DateRange | undefined) => {
        setCalendarRange(range);
        if (range?.from && range?.to) {
            applyDate(startOfDay(range.from), endOfDay(range.to));
        } else if (range?.from && !range?.to) {
            applyDate(startOfDay(range.from), endOfDay(range.from));
        } else {
            setDateFilter({});
            onChange?.({});
        }
    };

    const clearDate = () => {
        setCalendarRange(undefined);
        setDateFilter({});
        onChange?.({});
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        "inline-flex  shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-all duration-200",
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
                    <span className="truncate max-w-[140px]">
                        {formatDateRange(dateFilter.from, dateFilter.to)}
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                            open && "rotate-180",
                        )}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                side="bottom"
                className="w-auto p-0 rounded-2xl border-gray-200/80 dark:border-gray-700/60 shadow-xl overflow-hidden"
            >
                <div className="flex">
                    {/* Presets */}
                    <div className="border-b border-gray-100 dark:border-gray-800 sm:border-b-0 sm:border-r w-30 sm:w-36 p-3 space-y-0.5">
                        <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Quick select
                        </p>
                        {PRESETS.map((preset) => {9
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
                                        " cursor-pointer w-full rounded-lg px-2.5 py-1.5 text-left text-xs" +
                                        " font-medium" +
                                        " transition-colors duration-150",
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
                                <Button
                                    variant={"outline"}
                                    onClick={() => {
                                        clearDate();
                                        setOpen(false);
                                    }}
                                    className="w-full cursor-pointer rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    Clear date
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Calendar */}
                    <div className="p-3 ">
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
                                day_selected: "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600 dark:bg-blue-700",
                                day_range_middle: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                                day_range_start: "bg-blue-600 text-white rounded-l-full dark:bg-blue-700",
                                day_range_end: "bg-blue-600 text-white rounded-r-full dark:bg-blue-700",
                                day_today: "border border-blue-400 text-blue-700 font-bold dark:border-blue-500 dark:text-blue-400",
                            }}
                        />
                        {calendarRange?.from && !calendarRange?.to && (
                            <p className="mt-2 px-1 text-[11px] text-gray-400 dark:text-gray-500">
                                Click another date to complete the range.
                            </p>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default DateFilter;
