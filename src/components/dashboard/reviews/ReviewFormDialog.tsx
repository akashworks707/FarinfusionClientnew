/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Upload, X, Search, ImageIcon, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { uploadToCloudinary } from "@/utils/cloudinary";

const reviewFormSchema = z.object({
  product: z.string().min(1, "Product is required"),
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10, "Review text must be at least 10 characters"),
  reviewSource: z.enum(["FACEBOOK", "WEBSITE"]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: any;
  products: any[];
  onSubmit: (data: FormData) => Promise<void>;
}

const inputCls =
  "h-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:placeholder:text-gray-600 dark:focus:border-amber-500 dark:focus:bg-gray-800";

export function ReviewFormDialog({
  open,
  onOpenChange,
  review,
  products = [],
  onSubmit,
}: ReviewFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    review?.reviewImage || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Product search states
  const [productSearch, setProductSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      product: review?.product?._id || "",
      customerName: review?.customerName || "",
      rating: review?.rating || 5,
      reviewText: review?.reviewText || "",
      reviewSource: review?.reviewSource || "WEBSITE",
      status: review?.status || "PENDING",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (review) {
      reset({
        product: review.product?._id || "",
        customerName: review.customerName || "",
        rating: review.rating || 5,
        reviewText: review.reviewText || "",
        reviewSource: review.reviewSource || "WEBSITE",
        status: review.status || "PENDING",
      });

      setSelectedProduct(review.product || null);
      setImagePreview(review.reviewImage || null);
      setImageFile(null);

      // Show selected product in search input
      setProductSearch(review.product?.title || "");
      setDebouncedSearch("");
    } else {
      reset({
        product: "",
        customerName: "",
        rating: 5,
        reviewText: "",
        reviewSource: "WEBSITE",
        status: "PENDING",
      });

      setSelectedProduct(null);
      setImagePreview(null);
      setImageFile(null);
      setProductSearch("");
      setDebouncedSearch("");
    }
  }, [review, open, reset]);

  const rating = watch("rating");

  // Initialize selected product from review data
  useEffect(() => {
    if (review?.product) {
      setSelectedProduct(review.product);
    }
  }, [review]);

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Debounce search
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const handleSearchChange = (val: string) => {
    setProductSearch(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      product.slug?.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const selectProduct = (product: any) => {
    setSelectedProduct(product);
    setValue("product", product._id);
    setProductSearch("");
    setDebouncedSearch("");
    setDropdownOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFormSubmit = async (values: ReviewFormValues) => {
    try {
      setIsLoading(true);
      const payload: any = {
        product: values.product,
        customerName: values.customerName,
        rating: values.rating,
        reviewText: values.reviewText,
        reviewSource: values.reviewSource,
        status: values.status || "APPROVED",
      };

      if (imageFile) {
        const imageUrl = await uploadToCloudinary(imageFile);

        payload.reviewImage = imageUrl;
      }

      await onSubmit(payload);
      reset();
      setImageFile(null);
      setImagePreview(null);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {review ? "Edit Review" : "Create New Review"}
          </DialogTitle>
          <DialogDescription>
            {review
              ? "Update the review details"
              : "Add a new review to the system"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 pr-4"
        >
          {/* Product Select with Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Product *</label>
            <div ref={dropdownRef} className="relative">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setDropdownOpen(true)}
                  className={cn(inputCls, "pl-9 pr-8")}
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
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-gray-200/80 bg-white shadow-lg dark:border-gray-700/60 dark:bg-gray-900">
                  {filteredProducts.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-gray-400">
                      No products found
                    </p>
                  ) : (
                    filteredProducts.map((product) => {
                      const isSelected = selectedProduct?._id === product._id;
                      return (
                        <button
                          key={product._id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectProduct(product);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                            isSelected
                              ? "bg-amber-50 dark:bg-amber-900/10"
                              : "hover:bg-gray-50/60 dark:hover:bg-gray-800/40",
                          )}
                        >
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
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                              {product.title}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Selected Product Display */}
            {selectedProduct && (
              <div className="mt-3 p-3 rounded-lg border border-amber-200/50 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-900/10">
                <div className="flex items-center gap-2">
                  {selectedProduct.images?.[0] ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                      <ImageIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-800 dark:text-gray-200">
                      {selectedProduct.title}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errors.product && (
              <p className="text-red-500 text-sm mt-1">
                {errors.product.message}
              </p>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Customer Name *
            </label>
            <Input
              {...register("customerName")}
              placeholder="Enter customer name"
              className={cn(inputCls)}
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.customerName.message}
              </p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Rating (1-5) *
            </label>
            <div className="flex gap-3 items-center">
              <Input
                type="number"
                {...register("rating", { valueAsNumber: true })}
                min="1"
                max="5"
                className={cn(inputCls, "w-20")}
              />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star)}
                    className={`text-2xl cursor-pointer transition-colors ${
                      star <= rating
                        ? "text-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Review Text *
            </label>
            <Textarea
              {...register("reviewText")}
              placeholder="Enter review details"
              rows={4}
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600"
            />
            {errors.reviewText && (
              <p className="text-red-500 text-sm mt-1">
                {errors.reviewText.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Review Image (Optional)
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                <Image
                  width={128}
                  height={128}
                  priority
                  quality={90}
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-amber-500 transition">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Click to upload image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Review Source */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Review Source *
            </label>
            <Select {...register("reviewSource")} defaultValue="WEBSITE">
              <SelectTrigger className={cn(inputCls)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEBSITE">Website</SelectItem>
                <SelectItem value="FACEBOOK">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {review ? "Update Review" : "Create Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
