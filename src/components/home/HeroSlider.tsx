"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Parallax } from "swiper/modules";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
    {
        id: 1,
        image: "https://farinfusion.dotskillsbd.com/wp-content/uploads/2022/12/4-scaled.webp",
        bg: "bg-purple-500",
    },
    {
        id: 2,
        image: "https://farinfusion.dotskillsbd.com/wp-content/uploads/2022/12/2-scaled.webp",
        bg: "bg-neutral-800",
    },
    {
        id: 3,
        image: "https://farinfusion.dotskillsbd.com/wp-content/uploads/2022/12/3-scaled.webp",
        bg: "bg-slate-700",
    },
];

export default function HeroSlider() {
    return (
        <div className="relative h-full rounded-xl overflow-hidden">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, Parallax]}
                navigation={{
                    nextEl: ".hero-next",
                    prevEl: ".hero-prev",
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop
                effect="fade"
                className="h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className={`relative h-full ${slide.bg}`}>
                            <Image
                                src={slide.image}
                                alt="hero"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation */}
            <button className="hover:cursor-pointer hover:scale-105 transition-transform transform duration-500 ease-in-out hero-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow">
                <ChevronLeft />
            </button>
            <button className="hover:cursor-pointer hover:scale-105 transition-transform transform duration-500 ease-in-out hero-next absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow">
                <ChevronRight />
            </button>
        </div>
    );
}