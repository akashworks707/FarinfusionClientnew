
"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import { toast } from "sonner";
import { Plus, Upload, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import logo from "../../../../public/assets/FRN-Logo-scaled.webp";
import { useCreateCategoryMutation } from "@/redux/features/category/category.api";
import {Separator} from "@/components/ui/separator";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

// ─── Enum ─────────────────────────────────────────────────────────────────────

export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const categorySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  showOrder: z.preprocess(
    (val) => (val !== undefined && val !== "" ? Number(val) : undefined),
    z.number().int().positive("Display order must be a positive number").optional()
  ),
  status: z.nativeEnum(CategoryStatus, { message: "Please select a status" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateCategoryModal() {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      title: "",
      description: "",
      showOrder: 1,
      status: undefined,
    },
  });

  // ── File change handler ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError(null);
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageError("Category image is required");
  };

  const handleClose = () => {
    reset();
    clearImage();
    setImageError(null);
    setOpen(false);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    if (!imageFile) {
      setImageError("Category image is required");
      return;
    }
    setImageError(null);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("status", data.status);
      formData.append("showOrder", String(data.showOrder ?? 1));
      formData.append("image", imageFile);

      const res = await createCategory(formData).unwrap();
      if (res.success) {
        toast.success("Category created successfully!");
        handleClose();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button className={"cursor-pointer"}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6"
      >
        {/* Gold accent line */}
        <div className="absolute left-0 right-0 top-0 h-0.5 " />

        {/* Header */}
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest uppercase">
            Add Category
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Create a new product category
          </DialogDescription>
        </DialogHeader>

        {/* Divider */}
        <Separator />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className=" text-xs font-semibold tracking-widest uppercase">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter category title"
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className=" text-xs font-semibold tracking-widest uppercase">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter category description"
              rows={3}
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Show Order & Status — side by side */}
          <div className="grid grid-cols-2 gap-3">

            {/* Show Order */}
            <div className="space-y-1.5">
              <Label htmlFor="showOrder" className=" text-xs font-semibold tracking-widest uppercase">
                Display Order{" "}
                <span className="text-[#96999A] normal-case font-normal">(optional)</span>
              </Label>
              <Input
                id="showOrder"
                type="number"
                min={1}
                placeholder="e.g. 1"
                {...register("showOrder")}
              />
              {errors.showOrder && <p className="text-xs text-red-400">{errors.showOrder.message}</p>}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label
                  htmlFor="status"
                  className="text-xs font-semibold tracking-widest uppercase"
              >
                Status
              </Label>

              <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                      <Select
                          onValueChange={field.onChange}
                          value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent position={"popper"}>
                          {Object.values(CategoryStatus).map((s) => (
                              <SelectItem key={s} value={s}>
                                {s.charAt(0) + s.slice(1).toLowerCase()}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  )}
              />

              {errors.status && (
                  <p className="text-xs text-red-400">{errors.status.message}</p>
              )}
            </div>

          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">
              Category Image
            </Label>

            {imagePreview ? (
              <div className="relative flex items-center gap-3 rounded-md border border-[#4a5568] hover:bg-gray-200 p-2">
                <img src={imagePreview} alt="Preview" className="h-14 w-14 rounded-md object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  {/*<p className="text-sm text-white truncate">{imageFile?.name}</p>*/}
                  <p className="text-xs text-[#96999A]">
                    {imageFile ? (imageFile.size / 1024).toFixed(1) + " KB" : ""}
                  </p>
                </div>
                <Button
                    variant={"destructive"}
                  type="button"
                  onClick={clearImage}
                  className="shrink-0 cursor-pointer text-[#96999A] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed
                  border-[#4a5568] hover:bg-gray-200 px-4 py-6 cursor-pointer
                   transition-colors group"
              >
                <Upload className="h-6 w-6 text-[#96999A]" />
                <div className="text-center">
                  <p className="text-sm text-[#96999A] ">
                    Click to upload image
                  </p>
                  <p className="text-xs text-[#96999A]/70">PNG, JPG, WEBP — max 2MB</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}

            {imageError && <p className="text-xs text-red-400">{imageError}</p>}
          </div>

          {/* Submit */}
          <Button
              variant={"default"}
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 cursor-pointer
              font-bold tracking-widest uppercase
              transition-colors disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1e0f] border-t-transparent" />
                Creating category...
              </span>
            ) : (
              "Create Category"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}