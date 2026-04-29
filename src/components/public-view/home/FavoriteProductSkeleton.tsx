import { Skeleton } from "@/components/ui/skeleton";

export default function FavoriteProductSkeleton() {
  return (
    <div className="group bg-white h-full rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
      <div className="bg-white p-3">
        {/* Image Skeleton */}
        <div className="relative w-full overflow-hidden rounded-md aspect-4/3">
          <Skeleton className="w-full h-full rounded-md" />
        </div>

        {/* Info Skeleton */}
        <div className="px-1 pt-3 pb-1 flex flex-col gap-1">
          {/* Title and Star */}
          <div className="flex items-start justify-between gap-1">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-4/5 rounded" />
            </div>
            <Skeleton className="h-4 w-4 rounded-full shrink-0" />
          </div>

          {/* Category Skeleton */}
          <Skeleton className="h-3 w-2/5 rounded" />

          {/* Price and Button Area */}
          <div className="relative mt-2 overflow-hidden" style={{ height: "32px" }}>
            <div className="absolute inset-0 flex items-center gap-2 flex-wrap">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
