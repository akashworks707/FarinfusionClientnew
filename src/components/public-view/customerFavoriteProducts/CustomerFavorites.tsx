"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomerFavoriteProductCard } from "./CustomerFavoriteProductCard";
import { IProduct } from "@/types";
import FavoriteProductSkeleton from "../home/FavoriteProductSkeleton";

export default function CustomerFavorites() {
  const [productsData, setProductsData] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: false,
      skipSnaps: false,
      containScroll: "trimSnaps",
    },
    [autoplay.current],
  );

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/all-products?isCusFavorite=true`,
        );

        const data = await res.json();

        setProductsData(data?.data || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        setProductsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.reInit();

    autoplay.current.play();
  }, [emblaApi, productsData]);

  return (
    <section className="bg-[#EEEE]">
      <div className="container mx-auto max-w-352 py-5 sm:py-10">
        {/* Heading */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold heading-animate">
            OUR CUSTOMER FAVORITE PRODUCT
          </h3>

          <p className="text-sm sm:text-[15px] font-bold text-gray-900">
            Top-rated skincare essentials loved by our customers.
          </p>
        </div>

        {/* Wrapper */}
        <div
          className="rounded-2xl p-4 sm:p-6 relative"
          style={{ border: "2px solid #F5A623" }}
        >
          {/* Prev */}
          <button
            onClick={scrollPrev}
            disabled={isLoading}
            className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-30
              w-9 h-9 rounded-full bg-white shadow-md border border-gray-200
              flex items-center justify-center
              hover:bg-[#F5A623] hover:border-[#F5A623] hover:text-white
              transition-all duration-200"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Next */}
          <button
            onClick={scrollNext}
            disabled={isLoading}
            className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-30
              w-9 h-9 rounded-full bg-white shadow-md border border-gray-200
              flex items-center justify-center
              hover:bg-[#F5A623] hover:border-[#F5A623] hover:text-white
              transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%]"
                  >
                    <FavoriteProductSkeleton />
                  </div>
                ))
              ) : productsData.length > 0 ? (
                productsData.map((product) => (
                  <div
                    key={product._id}
                    className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%]"
                  >
                    <CustomerFavoriteProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full py-10 text-center text-gray-500">
                  No favorite products available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}