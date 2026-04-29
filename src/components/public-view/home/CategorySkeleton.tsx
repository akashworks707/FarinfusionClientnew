import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySkeleton() {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#2d3748] cursor-pointer">
      {/* Image Skeleton */}
      <div className="bg-[#f5dfc8] aspect-[3/2.8] relative flex items-center justify-center overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Title Skeleton */}
      <div className="bg-[#2d3748] py-3 px-2 text-center">
        <Skeleton className="h-4 w-3/4 mx-auto rounded" />
      </div>
    </div>
  );
}
