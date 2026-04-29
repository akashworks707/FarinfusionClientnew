/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUpdateOrderMutation } from "@/redux/features/orders/ordersApi";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { toast } from "sonner";
import {
  FilePenLine,
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  StickyNote,
  Package,
  Search,
  X,
  Plus,
  Minus,
  ShoppingCart,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/orders";
import type { IProduct } from "@/types";
import Image from "next/image";

interface CartProduct {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  availableStock?: number;
}

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone"),
  address: z.string().min(3, "Address is required"),
  shippingCost: z.coerce.number().min(0, "Must be 0 or more"),
  note: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function FormField({
  icon: Icon,
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  icon: React.ElementType;
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
      >
        <Icon className="h-3 w-3 text-amber-500 dark:text-amber-400" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 dark:text-red-400">
          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "h-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:placeholder:text-gray-600 dark:focus:border-amber-500 dark:focus:bg-gray-800";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
      {children}
    </p>
  );
}

interface MyOrderEditModalProps {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MyOrderEditModal({
  open,
  order,
  onOpenChange,
  onSuccess,
}: MyOrderEditModalProps) {
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const isCourierAssigned = !!order?.courierName;

  const [productSearch, setProductSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: productsData, isFetching: isSearching } =
    useGetAllProductsQuery(
      {
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        limit: 20,
        page: 1,
      },
      { skip: !dropdownOpen },
    );

  const availableProducts: IProduct[] = productsData?.data || [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      shippingCost: 0,
      note: "",
    },
  });

  useEffect(() => {
    if (order && open) {
      reset({
        fullName: order.billingDetails?.fullName || "",
        email: order.billingDetails?.email || "",
        phone: String(order.billingDetails?.phone || ""),
        address: order.billingDetails?.address || "",
        shippingCost: (order as any).shippingCost ?? 0,
        note: (order as any).note || "",
      });

      // Map existing order products to cart
      const existing: CartProduct[] = ((order as any).products || []).map(
        (item: any) => {
          const prod = item.product;
          return {
            productId: typeof prod === "object" ? prod._id : prod,
            title: item.title || prod?.title || "Product",
            price: item.price ?? prod?.price ?? 0,
            quantity: item.quantity ?? 1,
            image: typeof prod === "object" ? prod.images?.[0] : undefined,
            availableStock:
              typeof prod === "object" ? prod.availableStock : undefined,
          };
        },
      );
      setTimeout(() => {
        setCartProducts(existing);
      }, 100);
    }
  }, [order, open, reset]);

  const handleSearchChange = (val: string) => {
    setProductSearch(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  };

  const addProduct = (product: IProduct) => {
    setCartProducts((prev) => {
      const existing = prev.find((p) => p.productId === product._id);
      if (existing) {
        return prev.map((p) =>
          p.productId === product._id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }
      return [
        ...prev,
        {
          productId: product._id!,
          title: product.title,
          price: product.discountPrice ?? product.price,
          quantity: 1,
          image: product.images?.[0],
          availableStock: product.availableStock,
        },
      ];
    });
    setProductSearch("");
    setDebouncedSearch("");
    setDropdownOpen(false);
  };

  const updateQty = (productId: string, delta: number) => {
    setCartProducts((prev) =>
      prev
        .map((p) =>
          p.productId === productId
            ? { ...p, quantity: Math.max(0, p.quantity + delta) }
            : p,
        )
        .filter((p) => p.quantity > 0),
    );
  };

  const setQty = (productId: string, val: number) => {
    if (val <= 0) {
      removeProduct(productId);
      return;
    }
    setCartProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, quantity: val } : p,
      ),
    );
  };

  const removeProduct = (productId: string) => {
    setCartProducts((prev) => prev.filter((p) => p.productId !== productId));
  };

  const subtotal = cartProducts.reduce((s, p) => s + p.price * p.quantity, 0);
  const alreadyInCart = (id: string) =>
    cartProducts.some((p) => p.productId === id);

  const onSubmit = async (formData: FormData) => {
    if (!order) return;
    if (cartProducts.length === 0) {
      toast.error("Order must have at least one product");
      return;
    }
    try {
      await updateOrder({
        _id: (order as any)._id,
        data: {
          billingDetails: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          },
          shippingCost: formData.shippingCost,
          note: formData.note,
          // Send updated products array to backend
          products: cartProducts.map((p) => ({
            product: p.productId,
            title: p.title,
            quantity: p.quantity,
            price: p.price,
          })),
        },
      }).unwrap();

      toast.success("Order updated", {
        description: (order as any)?.customOrderId
          ? `Order #${(order as any).customOrderId} has been updated.`
          : "Order details saved.",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update order");
    }
  };

  const hasChanges = isDirty || cartProducts.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-160 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-800">
        {/* Amber accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-400 to-yellow-400" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <FilePenLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
              Edit Order
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
              {(order as any)?.customOrderId
                ? `#${(order as any).customOrderId} — billing, products & delivery`
                : "Update billing, products and delivery information"}
            </DialogDescription>
          </div>
          {/* Subtotal pill */}
          {cartProducts.length > 0 && (
            <div className="shrink-0 rounded-full bg-amber-50 px-3 py-1 dark:bg-amber-900/20">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                ৳{subtotal.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Status notice */}
        <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50/60 px-6 py-2 dark:border-amber-900/20 dark:bg-amber-900/10">
          <Package className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
            Order status can only be changed by an administrator.
          </p>
        </div>

        {/* Courier lock warning */}
        {isCourierAssigned && (
          <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-6 py-2.5 dark:border-red-900/30 dark:bg-red-900/10">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
            <p className="text-[11px] font-medium text-red-600 dark:text-red-400">
              A courier is already assigned — editing is locked.
            </p>
          </div>
        )}

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          {!order ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <form
              id="my-order-edit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div>
                <SectionLabel>
                  <ShoppingCart className="h-3 w-3 text-amber-500" />
                  Products ({cartProducts.length})
                </SectionLabel>

                {/* Search dropdown */}
                {!isCourierAssigned && (
                  <div ref={dropdownRef} className="relative mb-3">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search and add products…"
                      value={productSearch}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => setDropdownOpen(true)}
                      className={cn(
                        inputCls,
                        "pl-9 pr-8 focus:border-amber-400 dark:focus:border-amber-500",
                      )}
                      disabled={isCourierAssigned}
                    />
                    {productSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setProductSearch("");
                          setDebouncedSearch("");
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-gray-200/80 bg-white shadow-lg dark:border-gray-700/60 dark:bg-gray-900">
                        {isSearching ? (
                          <div className="flex items-center gap-2 px-3 py-3 text-xs text-gray-400">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-amber-600" />
                            Searching…
                          </div>
                        ) : availableProducts.length === 0 ? (
                          <p className="px-3 py-3 text-xs text-gray-400">
                            No products found
                          </p>
                        ) : (
                          availableProducts.map((product) => {
                            const inCart = alreadyInCart(product._id!);
                            return (
                              <button
                                key={product._id}
                                type="button"
                                onClick={() => !inCart && addProduct(product)}
                                disabled={
                                  inCart || (product.availableStock ?? 0) === 0
                                }
                                className={cn(
                                  "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                                  inCart
                                    ? "cursor-default opacity-50"
                                    : (product.availableStock ?? 0) === 0
                                      ? "cursor-not-allowed opacity-40"
                                      : "hover:bg-amber-50/60 dark:hover:bg-amber-900/10",
                                )}
                              >
                                {/* Thumbnail */}
                                {product.images?.[0] ? (
                                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <Image
                                      src={product.images[0]}
                                      alt={product.title}
                                      fill
                                      sizes="36px"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                    <ImageIcon className="h-4 w-4 text-amber-400" />
                                  </div>
                                )}
                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {product.title}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    ৳
                                    {(
                                      product.discountPrice ?? product.price
                                    ).toFixed(2)}
                                    {" · "}
                                    <span
                                      className={cn(
                                        (product.availableStock ?? 0) === 0
                                          ? "text-red-400"
                                          : "text-gray-400",
                                      )}
                                    >
                                      {(product.availableStock ?? 0) === 0
                                        ? "Out of stock"
                                        : `${product.availableStock} left`}
                                    </span>
                                  </p>
                                </div>
                                {/* State badge */}
                                {inCart ? (
                                  <Badge
                                    variant="outline"
                                    className="shrink-0 rounded-full border-amber-200 bg-amber-50 text-[10px] text-amber-600 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                                  >
                                    Added
                                  </Badge>
                                ) : (
                                  <Plus className="h-4 w-4 shrink-0 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Cart product list */}
                {cartProducts.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-amber-200 py-8 dark:border-amber-900/30">
                    <ShoppingCart className="h-8 w-8 text-amber-300 dark:text-amber-800" />
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      No products — search above to add
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cartProducts.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/30 group"
                      >
                        {/* Thumbnail */}
                        {item.image ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                            <Package className="h-4 w-4 text-amber-400" />
                          </div>
                        )}

                        {/* Title + unit price */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                            ৳{item.price.toFixed(2)} each
                          </p>
                        </div>

                        {/* Quantity controls */}
                        {!isCourierAssigned ? (
                          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 p-1">
                            <button
                              type="button"
                              onClick={() => updateQty(item.productId, -1)}
                              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                setQty(
                                  item.productId,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="w-9 bg-transparent text-center text-sm font-semibold text-gray-900 dark:text-gray-50 outline-none tabular-nums"
                            />
                            <button
                              type="button"
                              onClick={() => updateQty(item.productId, 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-700 dark:text-gray-300">
                            ×{item.quantity}
                          </span>
                        )}

                        {/* Line total */}
                        <p className="shrink-0 min-w-15 text-right text-sm font-bold tabular-nums text-amber-600 dark:text-amber-400">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Remove */}
                        {!isCourierAssigned && (
                          <button
                            type="button"
                            onClick={() => removeProduct(item.productId)}
                            className="ml-1 shrink-0 rounded-lg p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Remove product"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Summary row */}
                    <div className="flex items-center justify-between rounded-xl border border-amber-200/60 bg-amber-50/40 px-4 py-2.5 dark:border-amber-900/30 dark:bg-amber-900/10">
                      <span className="text-xs font-semibold text-amber-700/70 dark:text-amber-500/70">
                        {cartProducts.reduce((s, p) => s + p.quantity, 0)} item
                        {cartProducts.reduce((s, p) => s + p.quantity, 0) !== 1
                          ? "s"
                          : ""}{" "}
                        subtotal
                      </span>
                      <span className="text-base font-bold tabular-nums text-amber-600 dark:text-amber-400">
                        ৳{subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── DIVIDER ── */}
              <div className="border-t border-gray-100 dark:border-gray-800" />

              {/* ── SECTION: Billing ── */}
              <div>
                <SectionLabel>
                  <User className="h-3 w-3 text-amber-500" />
                  Billing Details
                </SectionLabel>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      icon={User}
                      label="Full Name"
                      htmlFor="fullName"
                      required
                      error={errors.fullName?.message}
                    >
                      <Input
                        id="fullName"
                        placeholder="Customer name"
                        className={inputCls}
                        {...register("fullName")}
                        disabled={isCourierAssigned}
                      />
                    </FormField>
                    <FormField
                      icon={Mail}
                      label="Email"
                      htmlFor="email"
                      required
                      error={errors.email?.message}
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className={inputCls}
                        {...register("email")}
                        disabled={isCourierAssigned}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      icon={Phone}
                      label="Phone"
                      htmlFor="phone"
                      required
                      error={errors.phone?.message}
                    >
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        className={inputCls}
                        {...register("phone")}
                        disabled={isCourierAssigned}
                      />
                    </FormField>
                    <FormField
                      icon={Truck}
                      label="Shipping Cost"
                      htmlFor="shippingCost"
                      error={errors.shippingCost?.message}
                    >
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 select-none">
                          ৳
                        </span>
                        <Input
                          id="shippingCost"
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          className={cn(inputCls, "pl-7")}
                          {...register("shippingCost")}
                          disabled={isCourierAssigned}
                        />
                      </div>
                    </FormField>
                  </div>

                  <FormField
                    icon={MapPin}
                    label="Address"
                    htmlFor="address"
                    required
                    error={errors.address?.message}
                  >
                    <Input
                      id="address"
                      placeholder="House, Road, Area, City"
                      className={inputCls}
                      {...register("address")}
                      disabled={isCourierAssigned}
                    />
                  </FormField>

                  <FormField
                    icon={StickyNote}
                    label="Order Notes"
                    htmlFor="note"
                    error={errors.note?.message}
                  >
                    <Textarea
                      id="note"
                      placeholder="Notes about this order…"
                      rows={2}
                      className={cn(
                        inputCls,
                        "h-auto resize-none leading-relaxed",
                      )}
                      {...register("note")}
                      disabled={isCourierAssigned}
                    />
                  </FormField>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 dark:text-gray-600">
                <span className="text-red-400">*</span> Required fields
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex items-center gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>

          <button
            type="submit"
            form="my-order-edit-form"
            disabled={
              isUpdating ||
              !hasChanges ||
              isCourierAssigned ||
              cartProducts.length === 0
            }
            className={cn(
              "group relative overflow-hidden inline-flex items-center gap-1.5",
              "rounded-lg px-4 py-2 text-sm font-semibold text-white",
              "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500",
              "transition-all duration-200 active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1",
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
            />
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <FilePenLine className="h-3.5 w-3.5" />
                Save Changes
              </span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
