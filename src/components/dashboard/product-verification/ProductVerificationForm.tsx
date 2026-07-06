/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ImageIcon,
  Loader2,
  Upload,
  X,
  Search,
  Check,
  Package,
} from "lucide-react";
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
import {
  IProductVerification,
  IProductVerificationFormData,
} from "@/types/productVerification";
import {
  productVerificationFormSchema,
  ProductVerificationFormData,
} from "@/utils/productVerificationSchema";
import {
  VERIFICATION_STATUS_OPTIONS,
  VERIFICATION_CONTENT_TYPE_OPTIONS,
  VERIFICATION_CATEGORY_OPTIONS,
} from "@/lib/constants/productVerification";
import Image from "next/image";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { cn } from "@/lib/utils";

interface ProductVerificationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: IProductVerificationFormData) => Promise<void>;
  initialData?: IProductVerification;
  isLoading?: boolean;
}

const inputCls =
  "h-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:placeholder:text-gray-600 dark:focus:border-amber-500 dark:focus:bg-gray-800";

export function ProductVerificationForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: ProductVerificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    initialData?.thumbnail ?? "",
  );
  const [thumbnailDragOver, setThumbnailDragOver] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // ── Product search state — same pattern as ReviewFormDialog ──────────────
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productSearch, setProductSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: productsData } = useGetAllProductsQuery({ limit: 500, page: 1 });
  const products = productsData?.data ?? [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductVerificationFormData>({
    resolver: zodResolver(productVerificationFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      thumbnail: "",
      mediaUrl: "",
      mediaType: "VIDEO",
      category: "COSMETICS",
      tags: [],
      featured: false,
      status: "PUBLISHED",
    },
  });

  const mediaUrl = watch("mediaUrl");
  const mediaType = watch("mediaType");

  useEffect(() => {
    if (mediaUrl) {
      if (
        mediaType === "VIDEO" &&
        (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be"))
      ) {
        const videoId = mediaUrl.match(
          /(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        )?.[1];
        if (videoId) {
          setMediaPreview(
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          );
        }
      } else if (mediaType === "EXTERNAL_LINK") {
        setMediaPreview("");
      }
    }
  }, [mediaUrl, mediaType]);

  // ── Close product dropdown on outside click ──────────────────────────────
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

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const handleProductSearchChange = (val: string) => {
    setProductSearch(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  };

  const filteredProducts = products.filter(
    (product: any) =>
      product.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      product.slug?.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const selectProduct = (product: any) => {
    setSelectedProduct(product);
    setValue("product", product._id, { shouldValidate: true });
    setProductSearch("");
    setDebouncedSearch("");
    setDropdownOpen(false);
  };

  const clearProduct = () => {
    setSelectedProduct(null);
    setValue("product", "", { shouldValidate: true });
  };

  // ── Thumbnail upload (unchanged) ──────────────────────────────────────────

  const handleThumbnailFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const localUrl = URL.createObjectURL(file);
    setThumbnailPreview(localUrl);

    try {
      setThumbnailUploading(true);
      const cloudUrl = await uploadToCloudinary(file);
      setThumbnailPreview(cloudUrl);
      setValue("thumbnail", cloudUrl, { shouldValidate: true });
    } catch {
      setThumbnailPreview(initialData?.thumbnail ?? "");
      setValue("thumbnail", initialData?.thumbnail ?? "");
    } finally {
      setThumbnailUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  const handleThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setThumbnailDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleThumbnailFile(file);
  };

  const removeThumbnail = () => {
    setThumbnailPreview("");
    setValue("thumbnail", "", { shouldValidate: true });
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const onFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const payload: IProductVerificationFormData = {
        ...data,
        product: selectedProduct?._id || undefined,
      };
      await onSubmit(payload);
      reset();
      onOpenChange(false);
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setMediaPreview("");
      setThumbnailPreview("");
      setSelectedProduct(null);
      setProductSearch("");
      setDebouncedSearch("");
    }
    onOpenChange(newOpen);
  };

  useEffect(() => {
    if (!open) return;

    const SUPPORTED_FORM_MEDIA_TYPES = [
      "VIDEO",
      "PDF",
      "ARTICLE",
      "EXTERNAL_LINK",
    ] as const;

    if (initialData) {
      const categoryValue = VERIFICATION_CATEGORY_OPTIONS.some(
        (option) => option.value === initialData.category,
      )
        ? (initialData.category as ProductVerificationFormData["category"])
        : "COSMETICS";

      reset({
        title: initialData.title,
        shortDescription: initialData.shortDescription,
        description: initialData.description,
        thumbnail: initialData.thumbnail ?? "",
        mediaUrl: initialData.mediaUrl,
        mediaType: SUPPORTED_FORM_MEDIA_TYPES.includes(
          initialData.mediaType as ProductVerificationFormData["mediaType"],
        )
          ? (initialData.mediaType as ProductVerificationFormData["mediaType"])
          : "EXTERNAL_LINK",
        category: categoryValue,
        tags: initialData.tags ?? [],
        featured: initialData.featured,
        status: initialData.status,
        product: (initialData as any).product?._id || "",
      });

      setThumbnailPreview(initialData.thumbnail ?? "");
      setSelectedProduct((initialData as any).product || null);
      setProductSearch("");
      setDebouncedSearch("");
    } else {
      reset({
        title: "",
        shortDescription: "",
        description: "",
        thumbnail: "",
        mediaUrl: "",
        mediaType: "VIDEO",
        category: "COSMETICS",
        tags: [],
        featured: false,
        status: "PUBLISHED",
        product: "",
      });

      setThumbnailPreview("");
      setSelectedProduct(null);
      setProductSearch("");
      setDebouncedSearch("");
    }
  }, [initialData, open, reset]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Verification" : "Create Verification"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the verification resource details"
              : "Create a new product verification guide, video, or tutorial"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* ── Product Selection (optional) — searchable, like Reviews ── */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Linked Product <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div ref={dropdownRef} className="relative">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search products to link…"
                  value={productSearch}
                  onChange={(e) => handleProductSearchChange(e.target.value)}
                  onFocus={() => setDropdownOpen(true)}
                  disabled={isSubmitting}
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

              {dropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-gray-200/80 bg-white shadow-lg dark:border-gray-700/60 dark:bg-gray-900">
                  {filteredProducts.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-gray-400">
                      No products found
                    </p>
                  ) : (
                    filteredProducts.map((product: any) => {
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

            {/* Selected product display */}
            {selectedProduct ? (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-amber-200/50 bg-amber-50/30 p-3 dark:border-amber-900/30 dark:bg-amber-900/10">
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
                    <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-800 dark:text-gray-200">
                    {selectedProduct.title}
                  </p>
                  <p className="text-xs text-gray-400">Linked to this verification</p>
                </div>
                <button
                  type="button"
                  onClick={clearProduct}
                  className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label="Remove linked product"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-400">
                Link a product so viewers can click through to it. Leave empty for a general guide.
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Title *
            </label>
            <Input
              placeholder="Enter verification title"
              {...register("title")}
              disabled={isSubmitting}
              className="bg-gray-50 dark:bg-slate-800"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Short Description *
            </label>
            <Textarea
              placeholder="Brief description of this verification resource"
              {...register("shortDescription")}
              disabled={isSubmitting}
              className="bg-gray-50 dark:bg-slate-800 min-h-20"
            />
            {errors.shortDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Full Description
            </label>
            <Textarea
              placeholder="Detailed description..."
              {...register("description")}
              disabled={isSubmitting}
              className="bg-gray-50 dark:bg-slate-800 min-h-24"
            />
          </div>

          {/* Media Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Media Type *
            </label>
            <Controller
              name="mediaType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VERIFICATION_CONTENT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.mediaType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mediaType.message}
              </p>
            )}
          </div>

          {/* Media URL */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Media URL *
            </label>
            <Input
              placeholder={`Enter ${mediaType === "VIDEO" ? "YouTube" : mediaType === "PDF" ? "PDF" : "media"} URL`}
              {...register("mediaUrl")}
              disabled={isSubmitting}
              className="bg-gray-50 dark:bg-slate-800"
            />
            {errors.mediaUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mediaUrl.message}
              </p>
            )}
          </div>

          {/* Media Preview */}
          {mediaPreview && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800">
              <Image
                src={mediaPreview}
                alt="Media preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Category *
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VERIFICATION_CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Thumbnail
            </label>

            <input type="hidden" {...register("thumbnail")} />

            {thumbnailPreview ? (
              <div className="relative w-full h-44 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 group">
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                />

                {thumbnailUploading && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                    <span className="text-xs text-white/80 font-medium">
                      Uploading…
                    </span>
                  </div>
                )}

                {!thumbnailUploading && (
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 flex items-center justify-center h-7 w-7 rounded-full bg-black/60 hover:bg-red-600 text-white transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove thumbnail"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {!thumbnailUploading && (
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="absolute inset-0 w-full flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-[11px] font-semibold text-white bg-black/50 px-3 py-1 rounded-full">
                      Replace image
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setThumbnailDragOver(true);
                }}
                onDragLeave={() => setThumbnailDragOver(false)}
                onDrop={handleThumbnailDrop}
                onClick={() =>
                  !isSubmitting && thumbnailInputRef.current?.click()
                }
                className={cn(
                  "relative flex flex-col items-center justify-center gap-3 w-full h-44 rounded-lg border-2 border-dashed cursor-pointer transition-colors select-none",
                  thumbnailDragOver
                    ? "border-amber-500 bg-amber-50/40 dark:bg-amber-900/10"
                    : "border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 hover:border-amber-400 hover:bg-amber-50/20 dark:hover:bg-amber-900/5",
                  isSubmitting && "pointer-events-none opacity-60",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    thumbnailDragOver
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : "bg-gray-100 dark:bg-slate-700",
                  )}
                >
                  {thumbnailDragOver ? (
                    <Upload className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-gray-400 dark:text-slate-400" />
                  )}
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {thumbnailDragOver
                      ? "Drop to upload"
                      : "Click or drag & drop"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    PNG, JPG, WEBP up to 10 MB
                  </p>
                </div>
              </div>
            )}

            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={isSubmitting || thumbnailUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleThumbnailFile(file);
              }}
            />
          </div>

          {/* Featured & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-gray-50 dark:bg-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VERIFICATION_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Featured
              </label>
              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(value) => field.onChange(value === "true")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-gray-50 dark:bg-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Featured</SelectItem>
                      <SelectItem value="false">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting || isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || thumbnailUploading}
              className="flex-1 hover:cursor-pointer bg-amber-600 hover:bg-amber-700"
            >
              {(isSubmitting || thumbnailUploading) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {thumbnailUploading
                ? "Uploading…"
                : initialData
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}