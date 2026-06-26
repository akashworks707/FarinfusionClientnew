export function ProductVerificationTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse">
          <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
          </div>
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

export function ProductVerificationStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export function ProductVerificationFormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
      ))}
    </div>
  );
}

export function ProductVerificationCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-4 animate-pulse">
      <div className="w-full h-40 bg-gray-200 dark:bg-slate-800 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
    </div>
  );
}
