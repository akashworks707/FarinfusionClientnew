import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Eye, Edit2, Trash2, Star } from "lucide-react";
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

interface ProductVerificationCardProps {
  data: IProductVerification;
  onView: (item: IProductVerification) => void;
  onEdit: (item: IProductVerification) => void;
  onDelete: (item: IProductVerification) => void;
}

export function ProductVerificationCard({
  data,
  onView,
  onEdit,
  onDelete,
}: ProductVerificationCardProps) {
  return (
    <div className="lg:hidden bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-800/50 transition-shadow duration-200">
      {/* Image */}
      {data.thumbnail && (
        <div className="relative w-full h-40 bg-gray-100 dark:bg-slate-800">
          <Image
            src={data.thumbnail}
            alt={data.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
              {data.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {MEDIA_TYPE_DISPLAY[data.mediaType]}
            </p>
          </div>
          {data.featured && (
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {data.shortDescription}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs">
          <ProductVerificationStatusBadge status={data.status} />
          <span className="text-gray-600 dark:text-gray-400">
            {data.views.toLocaleString()} views
          </span>
        </div>

        {/* Date */}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-slate-700">
          <Button
            onClick={() => onView(data)}
            size="sm"
            variant="ghost"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            onClick={() => onEdit(data)}
            size="sm"
            variant="ghost"
            className="flex-1"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete(data)} className="text-red-600 dark:text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
