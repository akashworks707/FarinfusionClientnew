"use client";

import { useState, useCallback } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VERIFICATION_STATUS_OPTIONS,
  VERIFICATION_CONTENT_TYPE_OPTIONS,
  SEARCH_PLACEHOLDER,
} from "@/lib/constants/productVerification";

interface ProductVerificationFiltersProps {
  onSearchChange: (term: string) => void;
  onStatusChange: (status: string) => void;
  onMediaTypeChange: (mediaType: string) => void;
  onFeaturedChange: (featured: boolean | "") => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function ProductVerificationFilters({
  onSearchChange,
  onStatusChange,
  onMediaTypeChange,
  onFeaturedChange,
  onReset,
  isLoading = false,
}: ProductVerificationFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      onSearchChange(value);
    },
    [onSearchChange],
  );

  const handleReset = useCallback(() => {
    setSearchTerm("");
    onReset();
  }, [onReset]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
          disabled={isLoading}
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Status Filter */}
        <Select onValueChange={onStatusChange} disabled={isLoading}>
          <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {VERIFICATION_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Media Type Filter */}
        <Select onValueChange={onMediaTypeChange} disabled={isLoading}>
          <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <SelectValue placeholder="Media Type" />
          </SelectTrigger>
          <SelectContent>
            {VERIFICATION_CONTENT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Featured Filter */}
        <Select
          onValueChange={(value) =>
            onFeaturedChange(value === "" ? "" : value === "true")
          }
          disabled={isLoading}
        >
          <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Not Featured</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select disabled={isLoading}>
          <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-createdAt">Newest First</SelectItem>
            <SelectItem value="createdAt">Oldest First</SelectItem>
            <SelectItem value="-views">Most Views</SelectItem>
            <SelectItem value="title">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
          disabled={isLoading}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
