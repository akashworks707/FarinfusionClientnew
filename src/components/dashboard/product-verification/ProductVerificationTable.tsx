"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProductVerification } from "@/types/productVerification";
import { ProductVerificationStatusBadge } from "./ProductVerificationStatusBadge";
import { MEDIA_TYPE_DISPLAY } from "@/lib/constants/productVerification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductVerificationTableProps {
  data: IProductVerification[];
  onView: (item: IProductVerification) => void;
  onEdit: (item: IProductVerification) => void;
  onDelete: (item: IProductVerification) => void;
  isLoading?: boolean;
}

export function ProductVerificationTable({
  data,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
}: ProductVerificationTableProps) {
  if (isLoading || !data.length) {
    return null;
  }

  return (
    <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                Thumbnail
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                Media Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900 dark:text-white">
                Featured
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
                Views
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {data.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  {item.thumbnail ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-slate-700" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {item.slug}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {MEDIA_TYPE_DISPLAY[item.mediaType]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ProductVerificationStatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: item.featured ? "#10b981" : "#d1d5db",
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700 dark:text-gray-300">
                  {item.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700 dark:text-gray-300">
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(item)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(item)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
