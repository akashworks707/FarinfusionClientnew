/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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

interface ProductVerificationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: IProductVerificationFormData) => Promise<void>;
  initialData?: IProductVerification;
  isLoading?: boolean;
}

export function ProductVerificationForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: ProductVerificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string>("");

  const SUPPORTED_FORM_MEDIA_TYPES = [
    "VIDEO",
    "PDF",
    "ARTICLE",
    "EXTERNAL_LINK",
  ] as const;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductVerificationFormData>({
    resolver: zodResolver(productVerificationFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          shortDescription: initialData.shortDescription,
          description: initialData.description,
          thumbnail: initialData.thumbnail,
          mediaUrl: initialData.mediaUrl,
          mediaType: SUPPORTED_FORM_MEDIA_TYPES.includes(
            initialData.mediaType as ProductVerificationFormData["mediaType"],
          )
            ? (initialData.mediaType as ProductVerificationFormData["mediaType"])
            : "EXTERNAL_LINK",
          category: initialData.category,
          tags: initialData.tags,
          featured: initialData.featured,
          status: initialData.status,
        }
      : {
          featured: false,
          status: "PUBLISHED",
        },
  });

  const mediaUrl = watch("mediaUrl");
  const mediaType = watch("mediaType");

  useEffect(() => {
    if (mediaUrl) {
      // Generate preview URL based on media type
      if (
        mediaType === "VIDEO" &&
        (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be"))
      ) {
        const videoId = mediaUrl.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
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

  const onFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
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
    }
    onOpenChange(newOpen);
  };

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

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Thumbnail URL
            </label>
            <Input
              placeholder="https://example.com/thumbnail.jpg"
              {...register("thumbnail")}
              disabled={isSubmitting}
              className="bg-gray-50 dark:bg-slate-800"
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
              disabled={isSubmitting || isLoading}
              className="flex-1 hover:cursor-pointer bg-amber-600 hover:bg-amber-700"
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
