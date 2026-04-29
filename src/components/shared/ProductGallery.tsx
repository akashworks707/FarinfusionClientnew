"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {IProduct} from "@/types";

// Replace with your placeholder image
const PImage = "/placeholder.png";

interface Product {
    title: string;
    images: string[];
}

interface ProductGalleryProps {
    product: IProduct;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <Card className="p-4 space-y-4">
            {/* Main Image */}
            <div className="rounded-xl overflow-hidden border bg-muted">
                <Image
                    width={500}
                    height={500}
                    src={product?.images[selectedImage] ?? PImage}
                    alt={product?.title ?? "Product Image"}
                    className="w-full h-[300px] object-cover"
                />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
                {product?.images.map((img: string, i: number) => (
                    <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-15 h-15 rounded-lg border overflow-hidden transition cursor-pointer ${
                            selectedImage === i
                                ? "ring-2 ring-primary"
                                : "opacity-70 hover:opacity-100"
                        }`}
                    >
                        <Image
                            width={30}
                            height={30}
                            src={img}
                            alt={product?.title ?? ""}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </Card>
    );
};

export default ProductGallery;