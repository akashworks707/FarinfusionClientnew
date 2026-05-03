"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, Gift, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { NavbarDropdown } from "@/components/modules/NavbarDropdown";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { title: "baby cream", slug: "baby-cream" },
  { title: "baby lotion", slug: "baby-lotion" },
  { title: "baby suncream", slug: "baby-suncream" },
  { title: "centella", slug: "centella" },
  { title: "combo", slug: "combo" },
  { title: "cream", slug: "cream" },
  { title: "eye cream", slug: "eye-cream" },
  { title: "face serum", slug: "face-serum" },
];

const NavbarMenu: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();
  const { user, logout } = useUser();

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = useSelector((state: RootState) => state.cart.items.length);
  const wishCount = useSelector((state: RootState) => state.wish.items.length);

  function closeAll() {
    setLoginOpen(false);
    setSignupOpen(false);
  }

  function openLogin() {
    setSignupOpen(false);
    setLoginOpen(true);
  }

  function openSignup() {
    setLoginOpen(false);
    setSignupOpen(true);
  }

  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  // ... rest of state

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Measure nav height once on mount
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      {isSticky && <div style={{ height: navHeight }} />}

      <nav
        ref={navRef}
        className={`bg-[#2D3436] py-3 shadow-md transition-all duration-500 ease-in-out
                    ${
                      isSticky
                        ? "fixed top-0 left-0 w-full z-50 shadow-lg animate-fadeIn"
                        : "relative"
                    }`}
      >
        <div className="flex items-center justify-between gap-12 container mx-auto px-5">
          {/* LEFT */}
          <div className="lg:hidden flex items-center gap-5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-neutral-300"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          {isSticky && (
            <Link href={"/"}>
              <Image
                src={"/assets/FRN-Logo-scaled.webp"}
                alt="Farin Fusion"
                width={140}
                height={48}
                className="h-12 w-40 sm:w-auto object-contain"
                priority
              />
            </Link>
          )}

          {/* CENTER */}
          <div className="hidden xl:block">
            <ul className="flex items-center gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={`/shop/category/${link.slug}`}
                    className={`text-gray-100 text-[14px] capitalize ${isSticky ? "text-[12px]" : "text-[14px]"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          {isSticky ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/wishlist")}
                className="cursor-pointer relative flex h-9 w-9 items-center justify-center text-white hover:text-[#c9a84c]"
              >
                <Heart className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                  {wishCount}
                </span>
              </button>

              <button
                onClick={() => router.push("/cart")}
                className="cursor-pointer relative flex h-9 w-9 items-center justify-center text-white hover:text-[#c9a84c]"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                  {cartCount}
                </span>
              </button>

              {user ? (
                <NavbarDropdown user={user} onLogout={logout} />
              ) : (
                <div className="hidden lg:block">
                  <div className="flex items-center text-sm font-semibold text-white">
                    <Button
                      variant="ghost"
                      onClick={openLogin}
                      className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                    >
                      Login
                    </Button>

                    <span className="text-[#96999A]">/</span>

                    <Button
                      variant="ghost"
                      onClick={openSignup}
                      className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                    >
                      Register
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="text-white">
              <div className="flex items-center gap-2.5 px-6 py-2 rounded-full fusion-offer">
                <Gift className="w-5 h-5" />
                <span className="text-[13px] font-bold">
                  SPECIAL BEAUTY DEAL
                </span>
              </div>
            </button>
          )}
        </div>

        {/* MOBILE SHEET */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent
            side="left"
            className="w-70 p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-4">Menu</h2>

              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.slug}>
                    <Link
                      href={`/shop/category/${link.slug}`}
                      className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t pt-4">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLogin();
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openSignup();
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* AUTH MODALS */}
        <LoginForm
          isOpen={loginOpen}
          onClose={closeAll}
          onSwitchToSignup={openSignup}
          onSwitchToForgot={closeAll}
        />

        <RegisterForm
          isOpen={signupOpen}
          onClose={closeAll}
          onSwitchToLogin={openLogin}
        />
      </nav>
    </>
  );
};

export default NavbarMenu;
