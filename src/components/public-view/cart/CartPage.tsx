"use client";

import React from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ReturnPolicy from "../common/ReturnPolicy";
import { CartBreadcrumb } from "../common/CartBreadCrumb";
import CartProduct from "@/components/public-view/cart/CartProduct";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "@/redux/slices/CartSlice";
import { Separator } from "@/components/ui/separator";
import EmptyCartList from "@/components/public-view/cart/EmptyCart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // 🟡 Subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const unitPrice =
      item?.discountPrice && item.discountPrice > 0
        ? item.discountPrice
        : item.price;

    return total + unitPrice * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return <EmptyCartList />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <CartBreadcrumb />

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* CART ITEM CARD */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <Button
                onClick={() => dispatch(clearCart())}
                variant={"outline"}
                className={
                  "cursor-pointer hover:text-red-400 transition-all duration-200"
                }
              >
                <ShoppingBag /> Clear All
              </Button>
              <Separator className={"my-5"} />
              {cartItems.map((cartItem) => {
                const isMaxQtyReached = cartItem.quantity > cartItem.availableStock;

                return (
                  <div key={cartItem._id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg">
                      {/* LEFT */}
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => dispatch(removeFromCart(cartItem._id))}
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Link href={`/product/${cartItem.slug}`}>
                            <Image
                              src={cartItem.images?.[0]}
                              alt={cartItem.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm font-medium line-clamp-2">
                            <Link href={`/product/${cartItem.slug}`}>
                              {cartItem.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2">
                            {cartItem?.discountPrice ? (
                              <>
                                <p className="text-yellow-700 font-semibold mt-1">
                                  ৳ {cartItem.discountPrice}
                                </p>
                                <p className="text-rose-500 line-through font-semibold mt-1">
                                  ৳ {cartItem.price}
                                </p>
                              </>
                            ) : (
                              <p className="text-yellow-700 font-semibold mt-1">
                                ৳ {cartItem.price}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* MIDDLE: QUANTITY */}
                      <div>
                        {isMaxQtyReached && (
                          <p className="text-xs text-red-500 mb-2 font-semibold text-center">
                            only {cartItem.availableStock - cartItem.quantity} left
                          </p>
                        )}
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              if (cartItem && cartItem.quantity > 1) {
                                dispatch(decreaseQty(cartItem._id));
                              }
                            }}
                            disabled={!cartItem || cartItem.quantity <= 1}
                            className={`w-8 h-8 border rounded flex items-center justify-center 
                                      ${
                                        !cartItem || cartItem.quantity <= 1
                                          ? "cursor-not-allowed opacity-50"
                                          : "hover:bg-gray-100 cursor-pointer"
                                      }`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            value={cartItem.quantity}
                            readOnly
                            className="w-10 h-8 text-center border rounded text-sm"
                          />

                          <button
                            onClick={() => {
                              if (
                                cartItem &&
                                cartItem.quantity < cartItem.availableStock
                              ) {
                                dispatch(increaseQty(cartItem._id));
                              }
                            }}
                            disabled={
                              !cartItem ||
                              cartItem.quantity >= cartItem.availableStock
                            }
                            className={`w-8 h-8 border rounded flex items-center justify-center 
                                    ${
                                      !cartItem ||
                                      cartItem.quantity >=
                                        cartItem.availableStock
                                        ? "cursor-not-allowed opacity-50"
                                        : "hover:bg-gray-100 cursor-pointer"
                                    }`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* RIGHT: SUBTOTAL */}
                      <div className="text-right min-w-25">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-bold text-yellow-700">
                          ৳{" "}
                          {(
                            (cartItem?.discountPrice &&
                            cartItem.discountPrice > 0
                              ? cartItem.discountPrice
                              : cartItem.price) * cartItem.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUGGESTION */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                You May Be Interested In...
              </h2>
              <CartProduct />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* SUMMARY */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Cart Totals</h2>

              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold pt-4">
                <span>Total</span>
                <span className="text-yellow-700">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>

              <Button
                onClick={() => {
                  const hasInvalidQty = cartItems.some((item) => item.quantity > item.availableStock);
                  if(hasInvalidQty){
                    toast.error("Please fix quantity before checkout");
                    return;
                  }
                  router.push("/checkout")
                }}
                className="cursor-pointer w-full mt-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-6"
              >
                Proceed To Checkout
              </Button>
            </div>

            <ReturnPolicy />
          </div>
        </div>
      </div>
    </div>
  );
}
