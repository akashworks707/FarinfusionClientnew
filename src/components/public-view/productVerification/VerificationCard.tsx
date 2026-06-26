"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, Play, FileText, Link2, Image as ImageIcon } from "lucide-react";
import { IProductVerification } from "@/types/productVerification";
import { formatDistanceToNow } from "date-fns";

interface VerificationCardProps {
  verification: IProductVerification;
  onWatch: (verification: IProductVerification) => void;
}

export function VerificationCard({
  verification,
  onWatch,
}: VerificationCardProps) {
  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "VIDEO":
        return <Play className="h-8 w-8" />;
      case "PDF":
        return <FileText className="h-8 w-8" />;
      case "IMAGE":
        return <ImageIcon className="h-8 w-8" />;
      case "EXTERNAL_LINK":
        return <Link2 className="h-8 w-8" />;
      default:
        return <Play className="h-8 w-8" />;
    }
  };

  const getMediaTypeLabel = (mediaType: string) => {
    return mediaType.replace("_", " ");
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cosmetics: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
      electronics: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      health: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      medicine: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      fashion: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      accessories:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    };
    return colors[category] || "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  };

  return (
    <div className="group rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
        {verification.thumbnail ? (
          <Image
            src={verification.thumbnail}
            alt={verification.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800">
            <span className="text-slate-500 dark:text-slate-400">
              {getMediaIcon(verification.mediaType)}
            </span>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onWatch(verification)}
            className="bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transform scale-0 group-hover:scale-100 transition-transform"
          >
            {getMediaIcon(verification.mediaType)}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(
              verification.category
            )}`}
          >
            {verification.category?.charAt(0).toUpperCase() +
              verification.category?.slice(1)}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {getMediaTypeLabel(verification.mediaType)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 text-sm">
          {verification.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {verification.shortDescription}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{verification.views || 0}</span>
          </div>
          <span>
            {formatDistanceToNow(new Date(verification.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Watch button */}
        <Button
          onClick={() => onWatch(verification)}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-2 rounded-lg"
        >
          Watch
        </Button>
      </div>
    </div>
  );
}