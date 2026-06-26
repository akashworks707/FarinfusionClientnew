"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductVerificationHeaderProps {
  onCreate: () => void;
  isLoading?: boolean;
}

export function ProductVerificationHeader({
  onCreate,
  isLoading = false,
}: ProductVerificationHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Product Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage original/fake identification tutorials and educational
            resources
          </p>
        </div>
        <Button
          onClick={onCreate}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 scale-hover"
        >
          <Plus className="w-5 h-5" />
          Add Verification
        </Button>
      </div>
    </div>
  );
}
