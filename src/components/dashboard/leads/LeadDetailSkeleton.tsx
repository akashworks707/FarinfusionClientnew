"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LeadDetailSkeleton() {
    return (
        <div className="pb-6 space-y-4">
            <Card className="border-0 shadow-sm bg-gray-50/70">
                <div className="p-5 space-y-5">

                    {/* Email */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-16 h-4" />
                        </div>
                        <Skeleton className="w-40 h-4" />
                    </div>

                    {/* Phone */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-16 h-4" />
                        </div>
                        <Skeleton className="w-32 h-4" />
                    </div>

                    {/* Address */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-20 h-4" />
                        </div>
                        <Skeleton className="w-44 h-4" />
                    </div>

                    {/* Joined */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-16 h-4" />
                        </div>
                        <Skeleton className="w-24 h-4" />
                    </div>
                    {/* notes */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-16 h-4" />
                        </div>
                        <Skeleton className="w-24 h-4" />
                    </div>

                </div>
            </Card>
        </div>
    );
}