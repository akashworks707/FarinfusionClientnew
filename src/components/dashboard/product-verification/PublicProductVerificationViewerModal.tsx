'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { IProductVerification } from '@/types/productVerification';

interface VerificationViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: IProductVerification;
}

function getYouTubeEmbedUrl(url: string) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
    /(?:youtube\.com\/live\/)([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
  }

  return "";
}

export default function PublicVerificationViewerModal({
  isOpen,
  onClose,
  verification,
}: VerificationViewerModalProps) {
  // const [copied, setCopied] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(verification.mediaUrl);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // const handleCopyLink = async () => {
  //   try {
  //     const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/product-verification`;
  //     await navigator.clipboard.writeText(url);
  //     setCopied(true);
  //     toast.success('Link copied to clipboard');
  //     setTimeout(() => setCopied(false), 2000);
  //   } catch {
  //     toast.error('Failed to copy link');
  //   }
  // };

  // const handleShare = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: verification.title,
  //         text: verification.shortDescription,
  //         url: '/product-verification',
  //       });
  //     } catch (err) {
  //       if (err instanceof Error && err.message !== 'AbortError') {
  //         toast.error('Failed to share');
  //       }
  //     }
  //   } else {
  //     handleCopyLink();
  //   }
  // };

  const renderMediaContent = () => {
    switch (verification.mediaType) {
      case 'VIDEO':
        return (
          <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedUrl}
              title={verification.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      case 'PDF':
        return (
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(verification.mediaUrl)}&embedded=true`}
              className="w-full h-96 border-none"
              title={verification.title}
            />
            <div className="p-4 text-center">
              <a
                href={verification.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Open Full Document
              </a>
            </div>
          </div>
        );

      case 'IMAGE':
        return (
          <div className="relative w-full h-96 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
            <Image
              src={verification.mediaUrl}
              alt={verification.title}
              fill
              className="object-cover"
            />
          </div>
        );

      case 'EXTERNAL_LINK':
        return (
          <div className="w-full p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              This resource is available at an external link
            </p>
            <a
              href={verification.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white rounded-lg font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Resource
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Close */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full">
                {verification.category}
              </span>
              {verification?.featured && (
                <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full">
                  ★ Featured
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {verification.title}
            </h2>
          </div>
          {/* <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button> */}
        </div>

        {/* Media Content */}
        <div className="mb-2">
          {renderMediaContent()}
        </div>

        {/* Description */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Description
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {verification.description}
          </p>
        </div> */}

        {/* Metadata */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
              Views
            </p>
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-white">
              <Eye className="w-4 h-4" />
              {(verification.views || 0).toLocaleString()}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
              Category
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {verification.category}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
              Type
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {verification.mediaType}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
              Posted
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {formatDistanceToNow(new Date(verification.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div> */}

        {/* Tags
        {verification.tags && verification.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {verification.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {/* <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            Share
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>  */}
      </DialogContent>
    </Dialog>
  );
}