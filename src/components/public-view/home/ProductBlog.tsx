import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const blogItems = [
  {
    id: 1,
    title: "Professional Haircare Routine for Strong and Healthy Hair",
    description:
      "Discover trusted haircare routines designed to strengthen hair roots, improve…",
    image:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2025/12/Cetaphil-Baby-Daily-Lotion-399-ml-35.webp",
    href: "#",
  },
  {
    id: 2,
    title: "Safe and Gentle Skincare and Haircare for Babies",
    description:
      "Learn how to protect and care for your baby’s delicate…",
    image:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2025/12/Cetaphil-Baby-Daily-Lotion-399-ml-32.webp",
    href: "#",
  },
  {
    id: 3,
    title: "Brightening Skincare Solutions for Clear and Even Skin Tone",
    description:
      "Explore trusted solutions for reducing dark spots, pigmentation, and uneven…",
    image:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2025/12/The-Face-Shop-Rice-Water-Bright-Facial-Foaming-Cleanser.webp",
    href: "#",
  },
  {
    id: 4,
    title: "Essential Skincare Routine for Healthy and Glowing Skin",
    description:
      "Discover trusted skincare routines designed to cleanse, nourish, and protect…",
    image:
      "https://farinfusion.dotskillsbd.com/wp-content/uploads/2025/12/Fino-Premium-touch-shampoo-Fino-premium-touch-hair-mask-2-2.webp",
    href: "#",
  },
];

const ProductBlog = () => {
  return (
    <section className="w-full  py-10 md:py-14">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl heading-animate">
          Glow Better with Our Beauty Tips
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden rounded-2xl  bg-white py-0 shadow-sm"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={500}
                className="h-[350px] w-full object-cover cursor-pointer"
              />

              <CardContent className="px-4 py-4 text-center">
                <h3 className="line-clamp-2 cursor-pointer text-xl font-semibold leading-tight  cursor-pointertext-slate-800 hover:text-yellow-500 transition-all duration-200">
                  {item.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-md leading-relaxed text-slate-500">
                  {item.description}
                </p>

                <Link
                  href={item.href}
                  className="mt-4 inline-block text-md font-medium text-slate-800 underline underline-offset-4 hover:text-yellow-500 transition-all duration-200"
                >
                  Read More
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductBlog;
