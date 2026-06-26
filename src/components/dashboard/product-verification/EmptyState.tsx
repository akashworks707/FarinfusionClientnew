import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No product verification resources found",
  description = "Start by creating your first verification guide, video, or tutorial to help customers identify authentic products.",
  onAction,
  actionLabel = "Create Resource",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 text-gray-400 dark:text-gray-500">
        {icon || <Inbox className="w-16 h-16 mx-auto" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">{description}</p>
      {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
