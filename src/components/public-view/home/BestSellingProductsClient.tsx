"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IProduct } from "@/types";

export function BestSellingProductsClient({
  products,
}: {
  products: IProduct[];
}) {
  const router = useRouter();

  const bestSellingProducts = products?.filter((item) => item.isBestSelling);

  if (!bestSellingProducts?.length) return null;

  return (
    <section className="py-16 max-w-352 mx-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-10">
          <h2 className="px-4 py-2 text-xl md:text-3xl font-black uppercase tracking-wide">
            Our Best Selling Products
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {bestSellingProducts.map((product) => (
              <CarouselItem
                key={product._id}
                className="basis-1/2 md:basis-1/3 xl:basis-1/4"
              >
                <div
                  onClick={() => router.push(`/product/${product.slug}`)}
                  className="cursor-pointer bg-white rounded-xl overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.images?.[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 font-semibold text-sm">
                      {product.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {product.category?.title}
                    </p>

                    <div className="mt-3">
                      {product.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-600">
                            ৳{product.discountPrice}
                          </span>

                          <span className="text-xs line-through text-gray-400">
                            ৳{product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-amber-600">
                          ৳{product.price}
                        </span>
                      )}
                    </div>

                    <button className="mt-4 w-full bg-slate-800 hover:bg-slate-900 text-white text-sm py-2 rounded-md">
                      Add To Cart
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="lg:-left-4 left-1" />
          <CarouselNext className="lg:-right-4 right-1" />
        </Carousel>
      </div>
    </section>
  );
}
