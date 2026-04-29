'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, RotateCcw, Filter } from 'lucide-react';

interface DashboardFiltersProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  onStatusChange: (status: string) => void;
  onReset: () => void;
}

export function DashboardFilters({
  onDateRangeChange,
  onStatusChange,
  onReset,
}: DashboardFiltersProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [status, setStatus] = useState<string>('ALL');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setStartDate(date);
    onDateRangeChange(date ? new Date(date) : null, endDate ? new Date(endDate) : null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setEndDate(date);
    onDateRangeChange(startDate ? new Date(startDate) : null, date ? new Date(date) : null);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusChange(value);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setStatus('');
    onReset();
  };

  return (
    <Card className="border-amber-200/40 bg-linear-to-br from-amber-50/50 to-white dark:border-amber-900/40 dark:from-amber-950/20 dark:to-background p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5 text-amber-700 dark:text-amber-300" />
        <h3 className="font-semibold text-foreground">Filter Dashboard</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Start Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 dark:border-amber-900 dark:focus:border-amber-400 dark:focus:ring-amber-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 dark:border-amber-900 dark:focus:border-amber-400 dark:focus:ring-amber-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Order Status</label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 dark:border-amber-900 dark:focus:border-amber-400 dark:focus:ring-amber-400 transition-all duration-200">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <Button
            onClick={handleReset}
            className="w-full border border-amber-300 bg-white text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:bg-card dark:text-amber-300 dark:hover:bg-amber-950/40 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
