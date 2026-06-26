"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Eye, Calendar, Tag, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IProductVerification } from "@/types/productVerification";
import { ProductVerificationStatusBadge } from "./ProductVerificationStatusBadge";
import {
  MEDIA_TYPE_DISPLAY,
  CATEGORY_DISPLAY,
} from "@/lib/constants/productVerification";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductVerificationDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: IProductVerification;
}

export function ProductVerificationDetailsModal({
  open,
  onOpenChange,
  data,
}: ProductVerificationDetailsModalProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Verification Details</DialogTitle>
          <DialogDescription>
            View complete information about this verification resource
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-150px)] pr-4">
          <div className="space-y-6">
            {/* Thumbnail */}
            {data.thumbnail && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800">
                <Image
                  src={data.thumbnail}
                  alt={data.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Title & Status */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.title}
                </h2>
                <ProductVerificationStatusBadge status={data.status} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Slug:{" "}
                <code className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {data.slug}
                </code>
              </p>
            </div>

            {/* Descriptions */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Short Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {data.shortDescription}
              </p>
            </div>

            {data.description && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Full Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {data.description}
                </p>
              </div>
            )}

            {/* Media Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Media Type
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {MEDIA_TYPE_DISPLAY[data.mediaType]}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Category
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {CATEGORY_DISPLAY[data.category]}
                </p>
              </div>
            </div>

            {/* Media URL */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Media URL
              </label>
              <a
                href={data.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 mt-1"
              >
                <Link2 className="w-4 h-4" />
                <span className="truncate">{data.mediaUrl}</span>
              </a>
            </div>

            {/* Tags */}
            {data.tags && data.tags.length > 0 && (
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200 dark:border-slate-700">
              <div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Total Views</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.views.toLocaleString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">Featured</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data.featured ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Creator & Dates */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200 dark:border-slate-700">
              {/* <div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Created By</span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {data.createdBy?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">{data.createdBy?.email}</p>
              </div> */}
              <div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Created At</span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(data.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(data.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {data.updatedAt && data.updatedAt !== data.createdAt && (
              <div className="text-xs text-gray-500 dark:text-gray-400 py-2 border-t border-gray-200 dark:border-slate-700">
                Last updated{" "}
                {formatDistanceToNow(new Date(data.updatedAt), {
                  addSuffix: true,
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
