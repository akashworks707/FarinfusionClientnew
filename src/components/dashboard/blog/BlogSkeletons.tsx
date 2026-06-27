"use client";

import { BookOpen, Plus } from "lucide-react";

export function BlogTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
              {["Blog", "Category", "Type", "Status", "Views", "Date", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800 rounded" />
                    </div>
                  </div>
                </td>
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-3.5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <div className="flex gap-3">
              <div className="h-16 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
        <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        No blogs found
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
        No blog posts match your current filters. Try adjusting your search or create a new blog.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
      >
        <Plus className="h-4 w-4" />
        Create Blog
      </button>
    </div>
  );
}