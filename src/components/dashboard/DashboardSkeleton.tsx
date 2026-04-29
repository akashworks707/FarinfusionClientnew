"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-gray-50 p-4 flex flex-col gap-4">
        <Skeleton className="h-8 w-40 mx-auto" /> 
        <div className="flex flex-col gap-3 mt-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="mt-auto">
          <Skeleton className="h-10 w-10 rounded-full mx-auto" /> 
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center gap-3 px-4">
          <Skeleton className="h-6 w-6 rounded" /> 
          <Skeleton className="h-6 w-screen" />
        </header>

       <main className="flex-1 p-6">
        <Skeleton className="h-full w-screen rounded-xl" />
      </main>
      </div>
    </div>
  );
}
