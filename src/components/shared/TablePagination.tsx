

"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
}

const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isPending = false,
}: TablePaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
          let pageNumber;

          if (totalPages <= 5) pageNumber = index + 1;
          else if (currentPage <= 3) pageNumber = index + 1;
          else if (currentPage >= totalPages - 2)
            pageNumber = totalPages - 4 + index;
          else pageNumber = currentPage - 2 + index;

          return (
            <Button
              key={pageNumber}
              size="sm"
              className="w-10"
              variant={pageNumber === currentPage ? "default" : "outline"}
              onClick={() => onPageChange(pageNumber)}
              disabled={isPending}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>

      <span className="text-sm text-muted-foreground ml-2">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default TablePagination;
