export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-3.5 w-16 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-3 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-3">
            <div className="h-3.5 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3.5 w-14 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-3.5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

export function BlogListSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BlogDetailSkeleton() {
  return (
    <div className="animate-pulse max-w-3xl mx-auto">
      {/* Banner */}
      <div className="h-64 sm:h-80 rounded-2xl bg-gray-200 dark:bg-gray-800 mb-8" />
      {/* Meta */}
      <div className="flex gap-3 mb-4">
        <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      {/* Title */}
      <div className="space-y-2 mb-6">
        <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      {/* Content */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-4 rounded bg-gray-100 dark:bg-gray-800 ${i % 5 === 4 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}