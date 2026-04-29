/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CustomerFavoriteProductCard } from "./CustomerFavoriteProductCard";
import { IProduct } from "@/types";
import FavoriteProductSkeleton from "../home/FavoriteProductSkeleton";

export default function CustomerFavorites() {
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));
  const [productsData, setProductsData] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [autoplay.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/all-products?isCusFavorite=true`,
        );
        const data = await res.json();
        setProductsData(data.data || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        setProductsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className=" bg-[#EEEE]">
      <div className="container mx-auto px-5 py-5 sm:py-10">
        {/* Heading */}
        <div className="text-center mb-8">
          <h3 className={"text-2xl font-bold heading-animate "}>
            OUR CUSTOMER FAVORITE PRODUCT
          </h3>
          <p className="text-sm sm:text-[15px] font-bold text-gray-900">
            Top-rated skincare essentials loved by our customers.
          </p>
        </div>

        {/* Orange-bordered wrapper */}
        <div
          className="rounded-2xl p-4 sm:p-6 relative"
          style={{ border: "2px solid #F5A623" }}
        >
          {/* Prev Arrow */}
          <button
            onClick={scrollPrev}
            disabled={isLoading}
            className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-8 z-30
                               w-9 h-9 rounded-full bg-white shadow-md border border-gray-200
                               flex items-center justify-center
                               hover:bg-[#F5A623] hover:border-[#F5A623] hover:text-white
                               transition-all duration-200"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Next Arrow */}
          <button
            onClick={scrollNext}
            disabled={isLoading}
            className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-8 z-30
                               w-9 h-9 rounded-full bg-white shadow-md border border-gray-200
                               flex items-center justify-center
                               hover:bg-[#F5A623] hover:border-[#F5A623] hover:text-white
                               transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex" style={{ gap: "12px" }}>
              {isLoading ? (
                // Loading Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-none
                                            w-[calc(50%-6px)]
                                            sm:w-[calc(33.333%-8px)]
                                            md:w-[calc(25%-9px)]
                                            lg:w-[calc(20%-10px)]
                                        "
                  >
                    <FavoriteProductSkeleton />
                  </div>
                ))
              ) : productsData.length > 0 ? (
                // Loaded Products
                productsData.map((product) => (
                  <div
                    key={product._id}
                    className="flex-none
                                            w-[calc(50%-6px)]
                                            sm:w-[calc(33.333%-8px)]
                                            md:w-[calc(25%-9px)]
                                            lg:w-[calc(20%-10px)]
                                        "
                  >
                    <CustomerFavoriteProductCard product={product} />
                  </div>
                ))
              ) : (
                // No Products
                <div className="w-full py-10 text-center text-gray-500">
                  <p>No favorite products available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
