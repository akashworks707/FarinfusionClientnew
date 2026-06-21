"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllReviewsQuery } from "@/redux/features/review/review.api";
import { IReview } from "@/types/types.review";
import { ReviewCard } from "./ReviewCard";

export function ReviewsCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const { data } = useGetAllReviewsQuery({
    page: 1,
    limit: 100,
    status: "APPROVED",
  });

  const reviews = useMemo(
    () => (data?.data || []) as IReview[],
    [data?.data]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(8);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pages = useMemo(() => {
    const chunks = [];

    for (let i = 0; i < reviews.length; i += itemsPerPage) {
      chunks.push(reviews.slice(i, i + itemsPerPage));
    }

    return chunks;
  }, [reviews, itemsPerPage]);

  if (!reviews.length) return null;

  const currentReviews = pages[currentPage] || [];

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-352 px-5 container mx-auto">

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold">
            HEAR FROM OUR CUSTOMERS
          </h2>

          <p className="text-muted-foreground mt-3">
            Real customer experiences with our products
          </p>
        </div>

        <div className="relative">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {currentReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
              />
            ))}
          </div>

          {pages.length > 1 && (
            <>
              <Button
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev === 0 ? pages.length - 1 : prev - 1
                  )
                }
                className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 rounded-full bg-amber-500 hover:bg-amber-600"
              >
                <ChevronLeft />
              </Button>

              <Button
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev === pages.length - 1 ? 0 : prev + 1
                  )
                }
                className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 rounded-full bg-amber-500 hover:bg-amber-600"
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all ${
                currentPage === idx
                  ? "bg-amber-500 w-8"
                  : "bg-amber-200 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}