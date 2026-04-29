"use client";

import HeroSlider from "./HeroSlider";
import PromoBanner from "./PromoBanner";

export default function HeroSection() {
    return (
        <div className={"heroBannerCover"}>
            <section className=" container mx-auto px-5 py-8 md:py-15">
                {/*<div className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10" />*/}

                {/*<div className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10" />*/}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-20 ">
                    <div>
                        <HeroSlider />
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* TOP BANNER */}
                        <PromoBanner
                            image="https://farinfusion.dotskillsbd.com/wp-content/uploads/2026/02/7.webp"
                            buttonText="Buy Now"
                        />

                        {/* BOTTOM 2 */}
                        <div className="grid grid-cols-2 gap-4">
                            <PromoBanner
                                image="https://farinfusion.dotskillsbd.com/wp-content/uploads/2026/02/5-scaled.webp"
                                buttonText="View Details"
                            />
                            <PromoBanner
                                image="https://farinfusion.dotskillsbd.com/wp-content/uploads/2026/02/6.webp"
                                buttonText="View Details"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
