import { ReviewStatus } from "@/types/types.review";
import { Badge } from "@/components/ui/badge";

interface ReviewStatusBadgeProps {
  status: ReviewStatus;
}

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  const variants: Record<ReviewStatus, { bg: string; text: string; label: string }> = {
    [ReviewStatus.PENDING]: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-800 dark:text-amber-200",
      label: "Pending",
    },
    [ReviewStatus.APPROVED]: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-200",
      label: "Approved",
    },
    [ReviewStatus.REJECTED]: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-800 dark:text-red-200",
      label: "Rejected",
    },
  };

  const config = variants[status];

  return (
    <Badge className={`${config.bg} ${config.text} border-0 cursor-default`}>
      {config.label}
    </Badge>
  );
}
