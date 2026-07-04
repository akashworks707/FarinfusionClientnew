"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { IReview } from "@/types/types.review";

interface Props {
  review: IReview;
}

export function ReviewCard({ review }: Props) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100">
      <div className="relative h-52 bg-linear-to-b from-amber-200 to-amber-100">
        <Image
          src={review.product?.images?.[0] || "/placeholder-product.jpg"}
          alt={review.product?.title || ""}
          fill
          className="object-contain p-4"
        />

        {review.reviewImage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[75%] rounded-lg overflow-hidden shadow-xl border bg-white">
            <Image
              src={review.reviewImage}
              alt={review.customerName}
              width={400}
              height={300}
              className="w-full h-40 object-cover"
            />
          </div>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-md flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? "fill-amber-500 text-amber-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        <Link
          href={`/product/${review.product?.slug}`}
          className="font-bold text-base hover:text-amber-600 transition-colors line-clamp-2 uppercase"
        >
          {review.product?.title}
        </Link>

        <p className="mt-3 text-sm text-gray-600 line-clamp-5">
          {review.reviewText}
        </p>

        <div className="mt-4">
          <p className="text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>

          <p className="text-sm font-medium mt-1">By {review.customerName}</p>
        </div>
      </div>
    </div>
  );
}
