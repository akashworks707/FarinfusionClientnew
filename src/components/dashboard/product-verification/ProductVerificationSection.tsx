"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetAllProductVerificationsQuery,
  useIncreaseVerificationViewMutation,
} from "@/redux/features/productVerification/productVerification.api";
import { IProductVerification } from "@/types/productVerification";
import { ProductVerificationCardSkeleton } from "./ProductVerificationSkeleton";
import { cn } from "@/lib/utils";
import PublicVerificationViewerModal from "./PublicProductVerificationViewerModal";

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; badge: string }
> = {
  Cosmetics: {
    bg: "bg-pink-50 dark:bg-pink-950/20",
    text: "text-pink-700 dark:text-pink-300",
    badge: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300",
  },
  Electronics: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  },
  Health: {
    bg: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-700 dark:text-green-300",
    badge:
      "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  },
  Medicine: {
    bg: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-700 dark:text-red-300",
    badge: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
  },
  Fashion: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-700 dark:text-purple-300",
    badge:
      "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  },
  Accessories: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-300",
    badge:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  },
};

const MEDIA_TYPE_ICON: Record<string, React.ReactNode> = {
  VIDEO: <Play className="w-5 h-5" />,
  PDF: <FileText className="w-5 h-5" />,
  IMAGE: <ImageIcon className="w-5 h-5" />,
  EXTERNAL_LINK: <ExternalLink className="w-5 h-5" />,
};

interface VerificationCardProps {
  verification: IProductVerification;
  onWatch: (verification: IProductVerification) => void;
}

function VerificationCard({ verification, onWatch }: VerificationCardProps) {
  const categoryColor =
    CATEGORY_COLORS[verification.category] || CATEGORY_COLORS.Cosmetics;
  const mediaIcon =
    MEDIA_TYPE_ICON[verification.mediaType] || MEDIA_TYPE_ICON.VIDEO;

  return (
    <div className="group h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-lg/20 transition-all duration-300">
      {/* Thumbnail Container */}
      <div className="relative h-40 sm:h-48 bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
        {verification.thumbnail ? (
          <Image
            src={verification.thumbnail}
            alt={verification.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-amber-100 dark:from-amber-900/30 to-orange-100 dark:to-orange-900/30 flex items-center justify-center">
            <div className="text-slate-400 dark:text-slate-500">
              {mediaIcon}
            </div>
          </div>
        )}

        {/* Overlay with play/media icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <div className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {mediaIcon}
          </div>
        </div>

        {/* Featured Badge */}
        {verification.featured && (
          <div className="absolute top-3 right-3 bg-amber-500 dark:bg-amber-600 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-semibold">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )}

        {/* Media Type Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-200">
          {mediaIcon}
          {verification.mediaType}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Category Badge */}
        <div className="mb-3">
          <span
            className={cn(
              "inline-block px-2.5 py-1 rounded-full text-xs font-semibold",
              categoryColor.badge,
            )}
          >
            {verification.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2">
          {verification.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
          {verification.shortDescription}
        </p>

        {/* Views */}
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <Eye className="w-4 h-4" />
          <span>{(verification.views || 0).toLocaleString()} views</span>
        </div>

        {/* Watch Button */}
        <button
          onClick={() => onWatch(verification)}
          className="hover:cursor-pointer w-full py-2 px-4 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 dark:from-amber-700 dark:to-orange-700 dark:hover:from-amber-800 dark:hover:to-orange-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Watch Guide
        </button>
      </div>
    </div>
  );
}

export default function ProductVerificationSection() {
  const [selectedVerification, setSelectedVerification] =
    useState<IProductVerification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetAllProductVerificationsQuery({});

  const [increaseView] = useIncreaseVerificationViewMutation();
  const verifications = useMemo(
    () => data?.data?.data || [],
    [data?.data?.data],
  );

  const handleWatch = async (verification: IProductVerification) => {
    setSelectedVerification(verification);
    setIsModalOpen(true);

    try {
      await increaseView(verification._id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVerification(null), 300);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-352 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            How to Identify Original Products
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Watch our official guides and learn how to identify genuine products
            before purchasing.
          </p>

          {/* CTA Button */}
          <Link href="/product-verification">
            <Button className="hover:cursor-pointer bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105">
              View All Guides
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductVerificationCardSkeleton key={idx} />
            ))}
          </div>
        ) : verifications.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No verification resources available yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Check back soon for our latest product verification guides.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifications.map((verification: IProductVerification) => (
              <VerificationCard
                key={verification._id}
                verification={verification}
                onWatch={handleWatch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedVerification && (
        <PublicVerificationViewerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          verification={selectedVerification}
        />
      )}
    </section>
  );
}
