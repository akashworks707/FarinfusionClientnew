/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {useParams, useRouter} from "next/navigation";
import { Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useGetSingleProductQuery } from "@/redux/features/product/product.api";
import ProductImageGallery from "@/components/public-view/product/ProductImageGallery";
import Image from "next/image";
import paymentMethodImage from "../../../../public/payments.webp";
import placeholderImage from "../../../../public/product-placeholder.png";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart } from "@/redux/slices/CartSlice";
import {Dialog, DialogContent} from "@/components/ui/dialog";

interface Props {
    slugID: string;
    open: boolean;
    onClose: () => void;
}

const ProductSingleModal = ({ slugID, open, onClose }: Props) => {
    const router = useRouter();
    const slug = slugID as string;

    const dispatch = useDispatch();
    const cartList = useSelector((state: RootState) => state.cart.items);

    const { data, isLoading, isError } = useGetSingleProductQuery(slug, {
        skip: !slug,
    });

    const product = data?.data;

    // ================= ALL HOOKS FIRST (IMPORTANT FIX) =================
    const [qty, setQty] = useState(1);
    // const [wished, setWished] = useState(false);

    const cartItem = cartList.find(
        (item) => item?.slug === product?.slug || item?._id === product?._id
    );

    const availableStock = product?.availableStock || 0;


    // ================= EARLY RETURNS AFTER HOOKS =================
    if (isLoading) {
        return <p className="p-10 text-center">Loading product...</p>;
    }

    if (isError || !product) {
        return <p className="p-10 text-center">Product not found</p>;
    }

    // ================= PRODUCT DATA =================
    const {
        title,
        images = [],
        price,
        discountPrice,
        ratings,
        reviews,
    }: any = product;

    const rating = ratings || 0;
    const reviewCount = reviews?.length || 0;
    const displayPrice = discountPrice || price;

    const discount =
        price && discountPrice && price > discountPrice
            ? Math.round(((price - discountPrice) / price) * 100)
            : 0;

    const watchingCount = 12;

    // ================= ACTION =================
    const handleAddToCart = () => {
        dispatch(
            addToCart({
                ...product,
                quantity: qty,
            })
        );

        toast.success(`${title} added to cart!`);
    };

    // ================= UI =================
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[95%] md:max-w-[500px] lg:max-w-[900px] mx-auto h-[90vh] lg:h-[70vh] overflow-y-auto">

                {/* ===== YOUR OLD UI (UNCHANGED) ===== */}
                <div className="w-full overflow-y-auto">
                    <div className="w-full ">
                        <div className="container mx-auto py-6">
                            <div className="flex flex-col lg:flex-row gap-6 p-4">

                                {/* LEFT */}
                                <div className="lg:w-[45%]">
                                    <Image src={images[0] ?? placeholderImage} alt={title} width={500} height={500} className="w-full" />
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
                                                        : "text-gray-300"
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
                                                disabled={!availableStock || (cartItem?.quantity || 0) + qty >= availableStock}
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
                    <b className="text-[#c9a227]">{watchingCount}</b> watching now
                  </span>
                                    </div>

                                    {/* payment */}
                                    <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium">
                    Payment Methods:
                  </span>
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
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default ProductSingleModal;