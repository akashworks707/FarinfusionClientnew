"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => {
    return (
        <div className="w-full bg-white rounded-2xl shadow-md p-2 flex flex-col">
            {/* Image */}
            <Skeleton className="w-full aspect-[4/3] rounded-xl" />

            {/* Info */}
            <div className="px-1 pt-3 pb-1 flex flex-col gap-2">
                {/* Title */}
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <Skeleton className="h-3 w-2/5 rounded-md" />

                {/* Stars */}
                <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-3 rounded-full" />
                    ))}
                </div>

                {/* Price */}
                <Skeleton className="h-4 w-1/3 rounded-md" />

                {/* Button */}
                <Skeleton className="h-11 w-full rounded-xl mt-1" />
            </div>
        </div>
    );
};

export default ProductSkeleton;