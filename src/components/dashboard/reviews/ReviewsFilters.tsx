"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewsFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sourceFilter: string;
  onSourceChange: (source: string) => void;
  onReset: () => void;
}

export function ReviewsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  onReset,
}: ReviewsFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search reviews by customer name or text..."
          className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Source Filter */}
        <Select value={sourceFilter} onValueChange={onSourceChange}>
          <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Filter by Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FACEBOOK">Facebook</SelectItem>
            <SelectItem value="WEBSITE">Website</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          className="border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/20"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
