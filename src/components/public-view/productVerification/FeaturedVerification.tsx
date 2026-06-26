"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, Play, Flame } from "lucide-react";
import { IProductVerification } from "@/types/productVerification";

interface FeaturedVerificationProps {
  verification: IProductVerification;
  onWatch: (verification: IProductVerification) => void;
}

export function FeaturedVerification({
  verification,
  onWatch,
}: FeaturedVerificationProps) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-2xl mb-8">
      {/* Featured badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-full">
        <Flame className="h-4 w-4" />
        <span className="font-semibold text-sm">Featured</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
        {/* Image */}
        <div className="relative aspect-square md:aspect-auto rounded-lg overflow-hidden group">
          {verification.thumbnail ? (
            <Image
              src={verification.thumbnail}
              alt={verification.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <Play className="h-16 w-16 text-slate-400" />
            </div>
          )}

          {/* Play button */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={() => onWatch(verification)}
              className="bg-white/20 backdrop-blur-sm text-white p-6 rounded-full hover:bg-white/30 transform scale-0 group-hover:scale-100 transition-transform"
            >
              <Play className="h-12 w-12" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <div className="inline-block">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-600/20 text-amber-300">
                {verification.category?.toUpperCase()}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              {verification.title}
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              {verification.shortDescription}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{verification.views || 0} views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">{verification.mediaType}</span>
            </div>
          </div>

          {/* Watch button */}
          <Button
            onClick={() => onWatch(verification)}
            className="self-start bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            <Play className="h-5 w-5 mr-2" />
            Watch Guide
          </Button>
        </div>
      </div>
    </div>
  );
}
