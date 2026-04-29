/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Eye, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

import {
  useGetSingleProductQuery,
  useGetAllProductsQuery,
} from "@/redux/features/product/product.api";
import ProductImageGallery from "@/components/public-view/product/ProductImageGallery";
import ProductCard from "../common/ProductCard";
import Image from "next/image";
import paymentMethodImage from "../../../../public/payments.webp";
import placeholderImage from "../../../../public/product-placeholder.png";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart } from "@/redux/slices/CartSlice";
import SingleProductSkeleton from "./SingleProductSkeleton";

const SingleProductDetails = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const dispatch = useDispatch();
  const cartList = useSelector((state: RootState) => state.cart.items);

  const { data, isLoading, isError } = useGetSingleProductQuery(slug, {
    skip: !slug,
  });

  const { data: allProductsData } = useGetAllProductsQuery(
    {
      limit: 10,
      page: 1,
    },
    {
      skip: !slug,
    },
  );

  const product = data?.data;
  const recentProducts = useMemo(() => {
    return [...(allProductsData?.data || [])].sort(
      (a, b) =>
        new Date(b?.createdAt ?? "").getTime() -
        new Date(a?.createdAt ?? "").getTime(),
    );
  }, [allProductsData]);

  const [qty, setQty] = useState(1);

  const cartItem = cartList.find(
    (item) => item?.slug === product?.slug || item?._id === product?._id,
  );

  const availableStock = product?.availableStock || 0;

  if (isLoading) {
    return <SingleProductSkeleton />;
  }

  if (isError || !product) {
    return <p className="p-10 text-center">Product not found</p>;
  }

  const {
    title,
    images = [],
    price,
    discountPrice,
    ratings,
    reviews,
    description,
  }: any = product;

  const rating = ratings || 0;
  const reviewCount = reviews?.length || 0;
  const displayPrice = discountPrice || price;

  const discount =
    price && discountPrice && price > discountPrice
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const watchingCount = 12;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: qty,
      }),
    );

    toast.success(`${title} added to cart!`);
  };

  return (
    <div className="w-full">
      {/* BREADCRUMB */}
      <div className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />

            {product?.category && (
              <>
                <Link
                  href={`/shop/category/${product.category.slug}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  {product.category.title}
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              </>
            )}

            <span className="font-semibold text-gray-900 dark:text-white line-clamp-1">
              {title}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full bg-linear-to-r from-[#fce4d8] via-[#f2e9f7] to-[#e8f4fb]">
          <div className="container mx-auto py-10">
            <div className="flex flex-col lg:flex-row gap-6 p-4">
              {/* LEFT */}
              <div className="lg:w-[55%]">
                {images.length > 0 ? (
                  <ProductImageGallery images={images} title={title} />
                ) : (
                  <Image src={placeholderImage} alt={title} />
                )}
              </div>

              {/* RIGHT */}
              <div className="flex-1 flex flex-col gap-5 bg-white shadow rounded-2xl p-5">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

                {/* rating */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.round(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                  <span className="text-sm text-gray-500">
                    ({reviewCount} reviews)
                  </span>
                </div>

                {/* price */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-amber-500">
                    ৳ {displayPrice}
                  </span>

                  {discount > 0 && (
                    <>
                      <span className="line-through text-gray-400">
                        ৳ {price}
                      </span>
                      <Badge className="bg-red-500 text-white">
                        -{discount}%
                      </Badge>
                    </>
                  )}
                </div>

                {/* stock */}
                <p className="text-sm text-gray-600">
                  Stock:{" "}
                  <span className="font-semibold">
                    {availableStock > 0 ? availableStock : "Out of stock"}
                  </span>
                </p>

                {/* QTY */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={() => setQty((p) => Math.max(1, p - 1))}
                      disabled={qty <= 1}
                      className={`w-9 h-10 flex items-center justify-center border-r ${
                        qty <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      -
                    </button>

                    <span className="w-10 text-center">{qty}</span>

                    <button
                      onClick={() => {
                        const existingQty = cartItem?.quantity || 0;

                        if (existingQty + qty < availableStock) {
                          setQty((prev) => prev + 1);
                        } else {
                          toast.error("Stock limit reached");
                        }
                      }}
                      disabled={
                        !availableStock ||
                        (cartItem?.quantity || 0) + qty >= availableStock
                      }
                      className={`w-9 h-10 flex items-center justify-center border-l ${
                        (cartItem?.quantity || 0) + qty >= availableStock
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      +
                    </button>
                  </div>

                  {/* ADD */}
                  <button
                    onClick={handleAddToCart}
                    className="cursor-pointer flex-1 min-w-40 h-10 bg-[#c9a227] font-bold rounded-md"
                  >
                    Add To Cart
                  </button>
                  <button
                    onClick={() => router.push("/checkout")}
                    className="cursor-pointer flex-1 min-w-40 h-10 bg-[#c9a227] font-bold rounded-md"
                  >
                    Buy Now
                  </button>
                </div>

                {/* watching */}
                <div className="flex items-center gap-2 bg-[#fdf4ec] px-4 py-3 rounded-lg">
                  <Eye className="text-[#c9a227]" size={18} />
                  <span className="text-sm text-gray-500">
                    <b className="text-[#c9a227]">{watchingCount}</b> watching
                    now
                  </span>
                </div>

                {/* payment */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium">Payment Methods:</span>
                  <Image
                    src={paymentMethodImage}
                    alt="payment"
                    width={400}
                    height={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* description */}
        <div className="container mx-auto px-5 py-10">
          <h2 className="text-xl font-semibold mb-5">Description</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* RECENT PRODUCTS CAROUSEL */}
        {recentProducts.length > 0 && (
          <div className="bg-gray-50 dark:bg-slate-900 py-12 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Recently Viewed Products
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore more products from our collection
                </p>
              </div>

              {/* Carousel */}
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {recentProducts.map((product: any) => (
                    <CarouselItem
                      key={product._id}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4 xl:basis-1/5"
                    >
                      <div className="h-full">
                        <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Buttons */}
                <CarouselPrevious className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-100 dark:border-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-lg hidden md:flex" />
                <CarouselNext className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-100 dark:border-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-lg hidden md:flex" />
              </Carousel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProductDetails;
