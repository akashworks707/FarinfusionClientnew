import { Skeleton } from "@/components/ui/skeleton";

export default function SingleProductSkeleton() {
  return (
    <div className="w-full">
      {/* Breadcrumb Skeleton */}
      <div className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full bg-linear-to-r from-[#fce4d8] via-[#f2e9f7] to-[#e8f4fb]">
          <div className="container mx-auto py-10">
            <div className="flex flex-col lg:flex-row gap-6 p-4">
              {/* LEFT - Image Skeleton */}
              <div className="lg:w-[55%]">
                <Skeleton className="w-full aspect-square rounded-2xl" />
              </div>

              {/* RIGHT - Details Skeleton */}
              <div className="flex-1 flex flex-col gap-5 bg-white shadow rounded-2xl p-5">
                {/* Title Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full rounded" />
                </div>

                {/* Rating Skeleton */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-5 rounded" />
                  ))}
                  <Skeleton className="h-4 w-16 rounded" />
                </div>

                {/* Price Skeleton */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-32 rounded" />
                  <Skeleton className="h-6 w-24 rounded" />
                </div>

                {/* Stock Skeleton */}
                <Skeleton className="h-4 w-48 rounded" />

                {/* Quantity & Buttons Skeleton */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-40 rounded-md" />
                  <Skeleton className="h-10 flex-1 rounded-md" />
                  <Skeleton className="h-10 flex-1 rounded-md" />
                </div>

                {/* Watching Box Skeleton */}
                <Skeleton className="h-12 w-full rounded-lg" />

                {/* Payment Methods Skeleton */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-12 w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="container mx-auto px-5 py-10">
          <Skeleton className="h-6 w-40 rounded mb-5" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full rounded" />
            ))}
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="bg-gray-50 dark:bg-slate-900 py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 rounded" />
              <Skeleton className="h-4 w-96 rounded" />
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-4/3 rounded-xl" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-3 w-4/5 rounded" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}