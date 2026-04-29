"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function ProductNotFound() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-5">

            {/* ICON */}
            <div className="bg-gray-100 p-6 rounded-full mb-6">
                <SearchX className="w-12 h-12 text-gray-500" />
            </div>

            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Product Not Found
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-500 max-w-md mb-6">
                Sorry, we couldn’t find the product you’re looking for. It may have been removed or is temporarily unavailable.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
                <Button asChild>
                    <Link href="/">Go to Home</Link>
                </Button>

                <Button variant="outline" asChild>
                    <Link href="/shop">Browse Products</Link>
                </Button>
            </div>
        </div>
    );
}