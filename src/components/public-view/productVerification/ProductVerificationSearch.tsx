"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface ProductVerificationSearchProps {
  onSearch: (term: string) => void;
  onMediaTypeChange: (type: string) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  searchValue?: string;
  mediaType?: string;
  sort?: string;
}

export function ProductVerificationSearch({
  onSearch,
  onMediaTypeChange,
  onSortChange,
  onReset,
  searchValue = "",
  mediaType = "",
  sort = "newest",
}: ProductVerificationSearchProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearch]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search guides, videos, tutorials..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select value={mediaType} onValueChange={onMediaTypeChange}>
          <SelectTrigger className="md:w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <SelectValue placeholder="Media Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="VIDEO">Video</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="IMAGE">Image</SelectItem>
            <SelectItem value="EXTERNAL_LINK">External Link</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="md:w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="views">Most Viewed</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={onReset}
          variant="outline"
          className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}