"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Share2, Copy, ExternalLink } from "lucide-react";
import { IProductVerification } from "@/types/productVerification";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface VerificationViewerModalProps {
  verification: IProductVerification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerificationViewerModal({
  verification,
  open,
  onOpenChange,
}: VerificationViewerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!verification) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/product-verification?id=${verification._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  function getYouTubeEmbedUrl(url: string) {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtube\.com\/live\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return url;
}

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: verification.title,
        text: verification.shortDescription,
        url: `${window.location.origin}/product-verification?id=${verification._id}`,
      });
    } else {
      handleCopyLink();
    }
  };

   const embedUrl = getYouTubeEmbedUrl(verification.mediaUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            {verification.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Media Content */}
          <div className="space-y-3">
            {verification.mediaType === "VIDEO" && (
              <div className="aspect-video rounded-lg overflow-hidden">
                {verification.mediaUrl?.includes("youtube") ? (
                  <iframe
              className="absolute inset-0 h-full w-full"
              src={`${embedUrl}?rel=0&modestbranding=1`}
              title={verification.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
                ) : (
                  <video
                    src={verification.mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            {(verification.mediaType as string) === "IMAGE" && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={verification.mediaUrl || ""}
                  alt={verification.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {(verification?.mediaType as string) === "PDF" && (
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  PDF Document
                </p>
                <Button
                  asChild
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <a href={verification.mediaUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View PDF
                  </a>
                </Button>
              </div>
            )}

            {verification.mediaType === "EXTERNAL_LINK" && (
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  External Resource
                </p>
                <Button
                  asChild
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <a href={verification.mediaUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Link
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="space-y-4">
            {/* Title & Description */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {verification.description || verification.shortDescription}
              </p>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Views
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {verification.views || 0}
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Category
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                  {verification.category}
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Type
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {verification.mediaType}
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Created
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {new Date(verification.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Tags */}
            {verification.tags && verification.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {verification.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              onClick={handleShareLink}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied" : "Copy Link"}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : "";
}