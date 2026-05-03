"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import NavSheet from "./NavSheet";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/SignupForm";
import type { FC } from "react";
import { NavbarDropdown } from "./NavbarDropdown";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";
import { SearchDropdown } from "./SearchDropdown";

const Navbar: FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const wishlistCount = useSelector(
    (state: RootState) => state.wish.items.length,
  );
  const cartCount = useSelector((state: RootState) => state.cart.items.length);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setSearchOpen(false);
      setSearchQuery("");
    }, 100);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCloseAuth = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setSearchOpen(val.trim().length >= 2);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
    if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
  };

  return (
    <>
      {/* Header Bar */}
      <header className="w-full primaryDark dark:bg-slate-950 border-b border-slate-700 z-40 transition-colors duration-300">
        {/* ── Mobile header ── */}
        <div className="flex lg:hidden items-center justify-between h-16 px-4 gap-2">
          <Link href="/" aria-label="Farin Fusion home">
            <Image
              src="/assets/FRN-Logo-scaled.webp"
              alt="Farin Fusion"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/wishlist")}
              className="cursor-pointer relative flex h-9 w-9 items-center justify-center text-white hover:text-[#c9a84c]"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                {wishlistCount}
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
            {user && <NavbarDropdown user={user} onLogout={logout} />}
          </div>
        </div>

        {/* ── Desktop header ── */}
        <div className="container hidden mx-auto px-5 lg:flex items-center justify-between h-20 gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 flex gap-4 items-center"
            aria-label="Farin Fusion home"
          >
            <Image
              src="/assets/FRN-Logo-scaled.webp"
              alt="Farin Fusion"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search Bar — with dropdown */}
          <div
            ref={searchContainerRef}
            className="relative flex-1 max-w-md mx-6 lg:mx-10"
          >
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() =>
                  searchQuery.trim().length >= 2 && setSearchOpen(true)
                }
                placeholder="Search for products"
                autoComplete="off"
                className="w-full rounded-full py-5 pl-5 pr-24 text-sm text-white placeholder:text-slate-400 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500 transition-all duration-200"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Divider + Search icon */}
              <span className="absolute right-11 top-1/2 -translate-y-1/2 h-5 w-px bg-slate-600" />
              <button
                type="button"
                onClick={() =>
                  searchQuery.trim() &&
                  router.push(
                    `/shop?search=${encodeURIComponent(searchQuery.trim())}`,
                  )
                }
                aria-label="Search"
                className="absolute right-0 top-0 bottom-0 flex w-11 items-center justify-center rounded-r-full text-slate-400 hover:text-yellow-500 transition-colors duration-200"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {/* Search dropdown */}
            {searchOpen && (
              <SearchDropdown
                query={searchQuery}
                onClose={() => setSearchOpen(false)}
                // containerRef={searchContainerRef}
              />
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <button
              onClick={() => router.push("/wishlist")}
              className="cursor-pointer relative flex h-9 w-9 items-center justify-center text-white hover:text-[#c9a84c]"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                {wishlistCount}
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

            {/* Auth */}
            {user ? (
              <NavbarDropdown user={user} onLogout={logout} />
            ) : (
              <div className="flex items-center text-sm font-semibold text-white whitespace-nowrap">
                <Button
                  variant="ghost"
                  onClick={
                    loginOpen ? handleCloseAuth : () => setLoginOpen(true)
                  }
                  className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                >
                  Login
                </Button>
                <span className="text-[#96999A] font-normal">/</span>
                <Button
                  variant="ghost"
                  onClick={
                    signupOpen ? handleCloseAuth : () => setSignupOpen(true)
                  }
                  className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sheet */}
      <NavSheet
        isOpen={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onLoginClick={() => setLoginOpen(true)}
        onRegisterClick={() => setSignupOpen(true)}
      />

      {/* Auth Modals */}
      <LoginForm
        isOpen={loginOpen}
        onClose={handleCloseAuth}
        onSwitchToSignup={() => setSignupOpen(true)}
        onSwitchToForgot={handleCloseAuth}
      />
      <RegisterForm
        isOpen={signupOpen}
        onClose={handleCloseAuth}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </>
  );
};

export default Navbar;
