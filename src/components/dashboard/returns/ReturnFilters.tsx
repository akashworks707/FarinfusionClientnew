"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ReturnFiltersState {
  searchTerm: string;
  returnStatus: string;
  refundStatus: string;
  dateFrom: string;
  dateTo: string;
}

interface ReturnFiltersProps {
  filters: ReturnFiltersState;
  onFiltersChange: (filters: ReturnFiltersState) => void;
  onReset: () => void;
}

export const ReturnFilters: React.FC<ReturnFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleReturnStatusChange = (value: string) => {
    onFiltersChange({ ...filters, returnStatus: value });
  };

  const handleRefundStatusChange = (value: string) => {
    onFiltersChange({ ...filters, refundStatus: value });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-gray-800/60 dark:bg-slate-900/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* Search */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by customer name, phone, order ID, return ID..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Return Status Filter */}
        <div className="w-full lg:w-48">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Return Status
          </label>
          <Select
            value={filters.returnStatus || "all"}
            onValueChange={(value) =>
              handleReturnStatusChange(value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refund Status Filter */}
        <div className="w-full lg:w-48">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Refund Status
          </label>
          <Select
            value={filters.refundStatus || "all"}
            onValueChange={(value) =>
              handleRefundStatusChange(value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSED">Processed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
              <SelectItem value="NOT_REQUIRED">Not Required</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};
