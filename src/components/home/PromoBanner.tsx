"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
    image: string;
    buttonText: string;
}

export default function PromoBanner({ image, buttonText }: Props) {
    return (
        <div className="relative overflow-hidden rounded-xl group">
            <Image
                src={image}
                alt="banner"
                width={800}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute bottom-6 left-6">
                <Button className="hover:cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white rounded-sm py-5 px-5">
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
