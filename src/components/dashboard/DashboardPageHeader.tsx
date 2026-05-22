"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subTitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const DashboardPageHeader: React.FC<PageHeaderProps> = ({
  title,
  subTitle,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="my-8 animate-fadeIn">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Title and Subtitle */}
        <div className="space-y-2 flex-1">
          {/* Title with gradient accent */}
          <div className="flex items-end gap-3">
            <div className="h-1 w-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>

          {/* Subtitle */}
          {subTitle && (
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed pl-4">
              {subTitle}
            </p>
          )}
        </div>

        {/* Action Button */}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="hover:cursor-pointer shrink-0 gap-2 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardPageHeader;
