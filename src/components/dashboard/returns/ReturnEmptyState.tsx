"use client"

import { Package } from "lucide-react";

export const ReturnEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200/60 bg-white py-16 shadow-sm dark:border-gray-800/60 dark:bg-slate-900/50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800">
        <Package className="h-8 w-8 text-gray-400 dark:text-gray-600" />
      </div>

      <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        No Returns Yet
      </p>

      <p className="mt-2 max-w-md text-center text-sm text-gray-600 dark:text-gray-400">
        When customers return parcels, they will appear here. Start by creating your first return.
      </p>
    </div>
  );
};
