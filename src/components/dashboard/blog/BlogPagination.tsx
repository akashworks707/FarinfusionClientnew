"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPage: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}

export function BlogPagination({ page, totalPage, total, limit, onPage }: Props) {
  if (totalPage <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages: (number | "…")[] = [];
  if (totalPage <= 7) {
    for (let i = 1; i <= totalPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPage - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPage - 2) pages.push("…");
    pages.push(totalPage);
  }

  const btnCls = (active: boolean) =>
    `h-8 min-w-[2rem] px-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-amber-500 text-white shadow-sm"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{start}–{end}</span> of{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span> blogs
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={btnCls(p === page)}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPage}
          className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}