/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, RefreshCw, Trash2 } from "lucide-react";

interface ReturnRowActionsProps {
  onView: () => void;
  onStatusChange: () => void;
  onDelete: () => void;
  returnItem: () => void;
}

export const ReturnRowActions: React.FC<ReturnRowActionsProps> = ({
  onView,
  onStatusChange,
  returnItem,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onView} className="gap-2 cursor-pointer">
          <Eye className="h-4 w-4 text-blue-600" />
          <span>View Details</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onStatusChange}
          className="gap-2 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 text-amber-600" />
          <span>Update Status</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
