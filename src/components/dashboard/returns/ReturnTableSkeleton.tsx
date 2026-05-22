"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ReturnTableSkeleton = () => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800/60 dark:bg-slate-900/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200/60 bg-gray-50/80 dark:border-gray-800/60 dark:bg-slate-900/80">
            {[...Array(11)].map((_, i) => (
              <th key={i} className="px-6 py-4">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-200/60 dark:border-gray-800/60"
            >
              {[...Array(11)].map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton
                    className={`h-4 ${
                      colIndex === 0 ? "w-16" : colIndex === 1 ? "w-12" : "w-20"
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
