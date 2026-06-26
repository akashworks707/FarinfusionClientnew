"use client";

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 animate-pulse">
      <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg mt-4" />
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="h-96 bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-2xl animate-pulse" />
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-32 animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}