/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import payments from "../../../../public/payments.webp";
import FooterServiceStrip from "@/components/public-view/common/FooterServiceStrip";
import { Facebook, Instagram } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";

const usefulLinks = [
  { title: "Blog", link: "/blog" },
  { title: "Stores", link: "/stores" },
  { title: "Our contacts", link: "/our-contacts" },
];

const footerMenu = [
  { title: "Blog", link: "/blog" },
  { title: "Our contacts", link: "/our-contacts" },
  { title: "Stores", link: "/stores" },
  { title: "Delivery & Return", link: "/delivery-return" },
];

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
);

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/farinfusion" },
  {
    icon: Instagram,
    href: "https://www.instagram.com/reel/DQxO68fkbjd/?igsh=MXBzaTNmamZ1bmtqbA",
  },
  {
    icon: TikTokIcon,
    href: "https://www.tiktok.com/@farinfusion?_r=1&_t=ZS-91GQBOoLAFE",
  },
];

export default function FarinFusionFooter() {
  const { data: categories } = useGetAllCategoriesQuery({});
  return (
    <footer className="primaryDark text-white">
      <div className="container max-w-352 mx-auto border-b px-4 border-white/10">
        <FooterServiceStrip />
      </div>

      <div className="container max-w-352 mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/">
              <Image
                src="/assets/FRN-Logo-scaled.webp"
                alt="Farin Fusion"
                width={180}
                height={50}
                className="mb-4 w-80"
              />
            </Link>

            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              At FarinFusion, we don’t just sell products — we deliver skincare
              solutions. Explore authentic, high-quality beauty essentials with
              fast delivery and trusted service across Bangladesh.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {categories?.data?.slice(0, 5).map((category: any) => (
                <li key={category._id}>
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="hover:text-[#e8c97e] transition-colors"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {usefulLinks.map((item) => (
                <li key={item.title}>
                  <Link href={item.link} className="hover:text-[#e8c97e]">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Footer Menu</h4>
            <ul className="space-y-2 text-sm text-white/60 mb-6">
              {footerMenu.map((item) => (
                <li key={item.title}>
                  <Link href={item.link} className="hover:text-[#e8c97e]">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-3">Subscribe us</h4>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href }, i) => (
                <Link
                  href={href}
                  target={"_blank"}
                  key={i}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#e8c97e]/20 hover:text-[#e8c97e] transition"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50 text-center md:text-left">
            © {new Date().getFullYear()} FarinFusion | All Rights Reserved.
            Developed by{" "}
            <Link href={"https://dotskillsbd.com"} target="_blank">
              <span className="text-[#e8c97e] font-medium">DotSkillsBD</span>
            </Link>
          </p>

          <Image
            src={payments}
            alt="payments"
            width={220}
            height={220}
            priority
            quality={90}
          />
        </div>
      </div>
    </footer>
  );
}
