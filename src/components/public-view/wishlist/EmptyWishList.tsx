'use client'
import React from 'react';
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmptyWishList = () => {
    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="flex flex-col items-center text-center max-w-md">

                {/* Icon */}
                <div className="pb-5">
                    <Heart className="w-20 h-20 text-gray-400" />
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
                    Your wishlist is empty
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-sm sm:text-base mb-6 leading-relaxed">
                    Looks like you haven’t added anything yet.
                    Explore our shop and save your favorite products here.
                </p>

                {/* CTA Button */}
                <Link href="/shop">
                    <Button className=" cursor-pointer bg-blue-400 text-white font-semibold hover:text-gray-100 px-6 py-6 rounded-xl">
                        Continue Shopping
                    </Button>
                </Link>

            </div>
        </div>
    );
};

export default EmptyWishList;