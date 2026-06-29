"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPage: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}

export function BlogPagination({
  page,
  totalPage,
  total,
  limit,
  onPage,
}: Props) {
  if (totalPage <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages: (number | "…")[] = [];
  if (totalPage <= 7) {
    for (let i = 1; i <= totalPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPage - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPage - 2) pages.push("…");
    pages.push(totalPage);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {total}
        </span>{" "}
        articles
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`dot-${i}`} className="px-1 text-sm text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={`h-9 min-w-9 px-2 rounded-xl text-sm font-medium transition-all border ${
                p === page
                  ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPage}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
