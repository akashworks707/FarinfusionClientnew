"use client";

import React, { useState } from "react";
import { CalendarClock, Zap, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";

export type ScheduleType = "INSTANT" | "SCHEDULED";

interface ScheduleOrderProps {
  value: {
    type: ScheduleType;
    scheduledAt?: string;
  };
  onChange: (val: { type: ScheduleType; scheduledAt?: string }) => void;
}

export function ScheduleOrder({ value, onChange }: ScheduleOrderProps) {
  const isScheduled = value.type === "SCHEDULED";
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value.scheduledAt
      ? parse(value.scheduledAt, "yyyy-MM-dd'T'HH:mm", new Date())
      : undefined,
  );
  const [time, setTime] = useState<string>(
    value.scheduledAt
      ? format(
          parse(value.scheduledAt, "yyyy-MM-dd'T'HH:mm", new Date()),
          "HH:mm",
        )
      : "09:00",
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateScheduledTime(date, time);
      setCalendarOpen(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (selectedDate) {
      updateScheduledTime(selectedDate, newTime);
    }
  };

  const updateScheduledTime = (date: Date, timeStr: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const [hours, minutes] = timeStr.split(":");
    
    const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    onChange({
      type: "SCHEDULED",
      scheduledAt: localDateTime,
    });
  };


  const formattedDate = selectedDate
    ? format(selectedDate, "dd MMM, yyyy")
    : "Select date";

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        Order Timing
      </p>

      {/* Toggle buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => onChange({ type: "INSTANT" })}
          className={cn(
            "flex-1 rounded-lg text-xs font-semibold transition-all duration-200",
            !isScheduled
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-150 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
          )}
        >
          <Zap className="h-3.5 w-3.5 mr-1.5" />
          Instant Order
        </Button>

        <Button
          type="button"
          onClick={() =>
            onChange({
              type: "SCHEDULED",
              scheduledAt:
                value.scheduledAt || format(new Date(), "yyyy-MM-dd'T'09:00"),
            })
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
      </div>

      {/* Professional Date Time Picker */}
      {isScheduled && (
        <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Select Date
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-blue-400 hover:bg-blue-50/30 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-gray-600/50 transition-all duration-200 text-left flex items-center justify-between">
                    <span>{formattedDate}</span>
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-3 rounded-xl">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      return date < today;
                    }}
                    className="rounded-lg"
                    classNames={{
                      day_selected:
                        "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600 dark:bg-blue-600",
                      day_today:
                        "border border-blue-400 font-bold dark:border-blue-500",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Select Time
              </label>
              <Input
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Display Summary */}
          {selectedDate && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Scheduled for:</span>{" "}
                {format(selectedDate, "EEEE, dd MMMM, yyyy")} at {time}
              </p>
            </div>
          )}

          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Your order will be processed at the selected date and time. Make
            sure to schedule it during business hours for faster processing.
          </p>
        </div>
      )}
    </div>
  );
}
