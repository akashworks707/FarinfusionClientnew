
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardManagementPageSkeleton() {
  return (
    <div className="p-4">
      <div className="h-8 w-48 bg-gray-100 rounded mb-6" />

      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-64" />

          <div className="h-10 w-24 bg-gray-100 rounded flex items-center justify-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
        <div className="h-10 w-28 bg-gray-100 rounded" />
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-50 p-4 text-sm font-medium text-gray-500">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>

        {[...Array(6)].map((_, index) => (
          <div key={index} className="grid grid-cols-4 p-4 border-t items-center">
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <div className="h-10 w-24 bg-gray-200 rounded" />
        <div className="h-10 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
