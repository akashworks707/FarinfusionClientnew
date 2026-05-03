"use client";

import Link from "next/link";
import Image from "next/image";
import payments from "../../../../public/payments.webp";
import FooterServiceStrip from "@/components/public-view/common/FooterServiceStrip";
import { Facebook, Instagram, Music } from "lucide-react";

/* DATA */
const categories = [
  "Baby Cream",
  "Baby Lotion",
  "Baby Suncream",
  "Cream",
  "Face Serum",
];

const usefulLinks = [
  { title: "Promotions", link: "/promotions" },
  { title: "Stores", link: "/stores" },
  { title: "Our contacts", link: "/our-contacts" },
  { title: "Delivery & Return", link: "/delivery-return" },
  { title: "Outlet", link: "/outlet" },
];

const footerMenu = [
  { title: "Blog", link: "/blog" },
  { title: "Our contacts", link: "/our-contacts" },
  { title: "Promotions", link: "/promotions" },
  { title: "Stores", link: "/stores" },
  { title: "Delivery & Return", link: "/delivery-return" },
];

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/farinfusion" },
  {
    icon: Instagram,
    href: "https://www.instagram.com/reel/DQxO68fkbjd/?igsh=MXBzaTNmamZ1bmtqbA",
  },
  {
    icon: Music,
    href: "https://www.tiktok.com/@farinfusion?_r=1&_t=ZS-91GQBOoLAFE",
  },
];

export default function FarinFusionFooter() {
  return (
    <footer className="primaryDark text-white">
      <div className="container mx-auto border-b px-4 border-white/10">
        <FooterServiceStrip />
      </div>

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/">
              <Image
                src="/assets/FRN-Logo-scaled.webp"
                alt="Farin Fusion"
                width={180}
                height={50}
                className="mb-4"
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
              {categories.map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-[#e8c97e]">
                    {item}
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
