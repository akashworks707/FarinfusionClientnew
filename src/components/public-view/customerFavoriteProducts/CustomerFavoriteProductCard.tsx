
"use client";

import { IProduct } from "@/types";
import {
  Search,
  ShoppingCart,
  Star,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import { addToWish, removeFromWish } from "@/redux/slices/wishSlice";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ← নতুন

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={label}
          onClick={onClick}
          className="size-8 bg-white rounded-md flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Quick View Modal ───
function QuickViewModal({
  product,
  open,
  onClose,
  onAddToCart,
}: {
  product: IProduct;
  open: boolean;
  onClose: () => void;
  onAddToCart: (qty: number) => void;
}) {
  const [qty, setQty] = useState(1);

  const displayImage = product.images?.[0] ?? "/placeholder.png";
  const hasDiscount =
    !!product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareLinks = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      bg: "bg-blue-600",
      icon: <Facebook size={13} className="text-white" />,
    },
    {
      label: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?url=${shareUrl}`,
      bg: "bg-black",
      icon: <Twitter size={13} className="text-white" />,
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${shareUrl}`,
      bg: "bg-red-600",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      bg: "bg-blue-700",
      icon: <Linkedin size={13} className="text-white" />,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${shareUrl}`,
      bg: "bg-sky-500",
      icon: <Send size={13} className="text-white" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl md:min-w-4xl p-0 overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">{product.title}</DialogTitle>

        <div className="flex flex-col md:flex-row">
          {/* Left — Image */}
          <div className="w-full md:w-[48%] bg-gray-50 p-4 sm:p-6 flex items-center justify-center min-h-55 sm:min-h-70 md:min-h-95">
            <Image
              src={displayImage}
              alt={product.title}
              height={400}
              width={350}
              className="w-full max-w-65 sm:max-w-[320px] md:max-w-full h-auto object-cover rounded-xl"
            />
          </div>

          {/* Right — Info */}
          <div className="w-full md:w-[52%] p-5 sm:p-6 md:p-8 flex flex-col justify-center gap-4 sm:gap-5">
            {/* Title */}
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h2>

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-[#F5A623]">
                ৳ {displayPrice?.toLocaleString()}.00
              </span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  ৳ {product.price.toLocaleString()}.00
                </span>
              )}
            </div>

            {/* Quantity + Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Qty Counter */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-8 sm:h-10 sm:w-9 rounded-none text-base sm:text-lg font-bold"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  -
                </Button>
                <span className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                  {qty}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-8 sm:h-10 sm:w-9 rounded-none text-base sm:text-lg font-bold"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </Button>
              </div>

              <Button
                onClick={() => onAddToCart(qty)}
                className="flex-1 min-w-30 bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 sm:h-10 gap-1.5 text-xs sm:text-sm"
              >
                <ShoppingCart size={14} />
                Add To Cart
              </Button>

              <Button className="flex-1 min-w-25 bg-green-600 hover:bg-green-700 text-white font-bold h-9 sm:h-10 text-xs sm:text-sm">
                Buy Now
              </Button>
            </div>

            <Separator />

            {/* Category */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-wrap">
              <span className="font-semibold text-gray-700">Category:</span>
              <Badge variant="secondary" className="text-xs font-medium">
                {product.category?.title}
              </Badge>
            </div>

            {/* Share */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                Share:
              </span>
              {shareLinks.map(({ label, href, bg, icon }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className={`size-7 sm:size-8 rounded-full ${bg} flex items-center justify-center hover:opacity-80 transition-opacity`}
                    >
                      {icon}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────
export function CustomerFavoriteProductCard({
  product,
}: {
  product: IProduct;
}) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter(); // ← নতুন

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wish.items);
  const wished = wishlistItems.some((item) => item._id === product._id);

  const displayImage = product.images?.[0] ?? "/placeholder.png";
  const hasDiscount =
    !!product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : null;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const originalPrice = hasDiscount ? product.price : null;

  const handleCardClick = () => {
    router.push(`/product/${product?.slug}`);
  };

  const handleAddToCart = (qty: number = 1) => {
    dispatch(
      addToCart({
        _id: product._id ?? "",
        slug: product?.slug ?? "",
        title: product.title ?? "",
        price: product.price ?? 0,
        discountPrice: product.discountPrice ?? 0,
        images: product.images ?? [],
        availableStock: product.availableStock ?? 0,
        quantity: qty,
      }),
    );
    toast.success(`${product.title} added to cart!`);
    setModalOpen(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // ← card click block
    if (wished) {
      dispatch(removeFromWish(product._id as string));
      toast.success("Removed from wishlist");
    } else {
      dispatch(
        addToWish({
          brand: {
            _id: product.brand?._id ?? "",
            slug: product.brand?.slug ?? "",
            title: product.brand?.title ?? "",
          },
          category: {
            _id: product.category?._id ?? "",
            image: product.category?.image ?? [],
            slug: product.category?.slug ?? "",
            title: product.category?.title ?? "",
          },
          description: product?.description ?? "",
          status: product?.status ?? "",
          _id: product._id ?? "",
          slug: product?.slug ?? "",
          title: product.title ?? "",
          price: product.price ?? 0,
          discountPrice: product.discountPrice ?? 0,
          images: product.images ?? [],
          ratings: product?.ratings ?? 0,
        }),
      );
      toast.success("Added to wishlist");
    }
  };

  return (
    <>  {/* ← Link সরিয়ে Fragment */}
      <div
        className="group bg-white h-full rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm cursor-pointer"
        onClick={handleCardClick} // ← card click এ navigate
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="bg-white p-3">
          {/* Image */}
          <div className="relative w-full overflow-hidden rounded-md">
            {discountPercent && (
              <Badge className="absolute top-3 left-3 z-10 text-white text-xs font-bold rounded-full px-2 bg-[#F5A623] hover:bg-[#F5A623]">
                -{discountPercent}%
              </Badge>
            )}

            <Image
              src={displayImage}
              alt={product.title}
              width={400}
              height={300}
              className="w-full rounded-md object-cover transition-transform duration-300"
              style={{
                aspectRatio: "4/3",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />

            {/* Icon Buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-20 transition-all duration-300 opacity-100 translate-x-0 md:opacity-0 md:translate-x-10 md:group-hover:opacity-100 md:group-hover:translate-x-0">
              <IconButton
                label="Quick View"
                onClick={(e) => {
                  e.stopPropagation(); // ← শুধু এটাই দরকার
                  setModalOpen(true);
                }}
              >
                <Search size={14} className="text-gray-600" />
              </IconButton>

              <IconButton
                label={wished ? "Remove from Wishlist" : "Add to Wishlist"}
                onClick={handleWishlist}
              >
                <Heart
                  size={14}
                  className={
                    wished
                      ? "fill-[#F5A623] stroke-[#F5A623]"
                      : "stroke-gray-500 fill-none"
                  }
                />
              </IconButton>
            </div>
          </div>

          {/* Info */}
          <div className="px-1 pt-3 pb-1 flex flex-col gap-1">
            {/* Title + Star */}
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-[13px] font-bold text-gray-900 leading-snug flex-1 line-clamp-2">
                {product.title}
              </h3>
              <button
                onClick={handleWishlist}
                className="shrink-0 mt-px"
                aria-label="Add to wishlist"
              >
                <Star
                  size={14}
                  className={
                    wished
                      ? "fill-yellow-400 stroke-yellow-400"
                      : "stroke-gray-300 fill-none"
                  }
                />
              </button>
            </div>

            {/* Category */}
            <p className="text-xs text-gray-400">{product.category?.title}</p>

            {/* Price ↔ Add to Cart swap */}
            <div
              className="relative mt-1 overflow-hidden"
              style={{ height: "32px" }}
            >
              <div
                className="absolute inset-0 flex items-center gap-2 flex-wrap transition-all duration-300"
                style={{
                  opacity: hovered ? 0 : 1,
                  transform: hovered ? "translateY(-100%)" : "translateY(0%)",
                }}
              >
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ৳ {originalPrice.toLocaleString()}.00
                  </span>
                )}
                <span className="text-sm font-bold text-[#F5A623]">
                  ৳ {displayPrice.toLocaleString()}.00
                </span>
              </div>

              <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                  opacity: hovered ? 1 : 0,
                  transform: hovered ? "translateY(0%)" : "translateY(100%)",
                }}
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // ← card click block
                    handleAddToCart(1);
                  }}
                  className="w-full h-full text-white text-xs font-bold gap-1 rounded-md bg-[#1a1a1a] hover:bg-[#333]"
                >
                  <ShoppingCart size={13} />
                  Add To Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal এখন Fragment-এর ভেতরে, Link-এর বাইরে */}
      <QuickViewModal
        product={product}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}