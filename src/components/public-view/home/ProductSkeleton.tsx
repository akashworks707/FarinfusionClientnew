import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden p-2 flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>

      {/* Info Skeleton */}
      <div className="px-1 pt-2 pb-1 flex flex-col gap-2 flex-1">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>

        {/* Category Skeleton */}
        <Skeleton className="h-3 w-3/5 rounded" />

        {/* Stars Skeleton */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-3.5 rounded-full" />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-2">
          {/* Price Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
