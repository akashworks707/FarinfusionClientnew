"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface VerificationEmptyProps {
  onReset?: () => void;
}

export function VerificationEmpty({ onReset }: VerificationEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="rounded-full bg-amber-100 dark:bg-amber-950 p-4 mb-4">
        <Search className="h-8 w-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        No Verification Resources Found
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
        We couldn&apos;t find any resources matching your criteria. Try adjusting your
        filters or search terms.
      </p>
      {onReset && (
        <Button
          onClick={onReset}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
}