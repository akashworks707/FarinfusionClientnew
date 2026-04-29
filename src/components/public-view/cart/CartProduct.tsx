"use client";

import React, { useEffect, useState } from "react";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { IProduct } from "@/types";
import ProductCard from "@/components/public-view/common/ProductCard";

const CartProduct = () => {
    const [api, setApi] = useState<CarouselApi>();
    const { data, isLoading, isError } = useGetAllProductsQuery({});

    const products: IProduct[] = data?.data || [];

    // Auto-scroll with pause on hover
    useEffect(() => {
        if (!api) return;

        let interval: NodeJS.Timeout;
        let isHovering = false;

        const startAutoScroll = () => {
            interval = setInterval(() => {
                if (!isHovering) {
                    api.scrollNext();
                }
            }, 2500);
        };

        const carouselRoot = api.rootNode();

        const handleMouseEnter = () => {
            isHovering = true;
        };

        const handleMouseLeave = () => {
            isHovering = false;
        };

        carouselRoot?.addEventListener("mouseenter", handleMouseEnter);
        carouselRoot?.addEventListener("mouseleave", handleMouseLeave);

        startAutoScroll();

        return () => {
            clearInterval(interval);
            carouselRoot?.removeEventListener("mouseenter", handleMouseEnter);
            carouselRoot?.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [api]);

    if (isLoading) {
        return (
            <div className="w-full py-10 text-center text-gray-500">
                Loading products...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full py-10 text-center text-red-500">
                Failed to load products. Please try again.
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="w-full py-10 text-center text-gray-500">
                No products available
            </div>
        );
    }

    return (
        <div className="w-[350] sm:w-full md:w-full mx-auto py-5">

            {/* Carousel Wrapper (IMPORTANT FIX) */}
            <div className="relative px-2 overflow-hidden">

                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                        slidesToScroll: 1,
                    }}
                    className="w-full"
                >

                    {/* Content */}
                    <CarouselContent className="-ml-2">
                        {products.map((product: IProduct) => (
                            <CarouselItem
                                key={product._id}
                                className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                            >
                                <div className="h-full">
                                    <ProductCard product={product} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Buttons */}
                    <CarouselPrevious className="flex w-10 h-10 md:w-12 md:h-12 -left-2 md:-left-4 bg-gray-900 text-white hover:bg-amber-400 transition rounded-full" />
                    <CarouselNext className="flex w-10 h-10 md:w-12 md:h-12 -right-2 md:-right-4 bg-gray-900 text-white hover:bg-amber-400 transition rounded-full" />

                </Carousel>

            </div>
        </div>
    );
};

export default CartProduct;