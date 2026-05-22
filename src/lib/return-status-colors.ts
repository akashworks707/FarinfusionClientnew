import { Badge } from "@/components/ui/badge";

export const getReturnStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800/50";
  }
};

export const getRefundStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50";
    case "PROCESSED":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50";
    case "REFUNDED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50";
    case "NOT_REQUIRED":
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/50";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800/50";
  }
};

export const getReturnStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return labels[status] || status;
};

export const getRefundStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    PROCESSED: "Processed",
    REFUNDED: "Refunded",
    NOT_REQUIRED: "Not Required",
  };
  return labels[status] || status;
};
