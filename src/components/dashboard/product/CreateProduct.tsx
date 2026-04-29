/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadMultipleToCloudinary } from "@/utils/cloudinary";

import { useCreateProductMutation } from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetAllBrandsQuery } from "@/redux/features/brand/brand.api";

import { IBrand, ICategory } from "@/types";
import BreadCrumbPage from "@/components/shared/BreadCrumbPage";
import { useGetMeQuery } from "@/redux/features/user/user.api";

// 🔥 Editor (No SSR)
const ProductEditor = dynamic(
  () => import("@/components/dashboard/product/ProductEditor"),
  { ssr: false },
);

// ENUM
export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// VALIDATION
const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  buyingPrice: z.preprocess((val) => Number(val), z.number().optional()),
  price: z.preprocess((val) => Number(val), z.number().min(0)),
  availableStock: z.preprocess((val) => Number(val), z.number().min(0)),
  discountPrice: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional(),
  ),
  status: z.nativeEnum(ProductStatus),
  description: z.string().min(10, "Description required"),
  images: z.array(z.instanceof(File)).min(1, "At least one image required"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateProduct() {
  const router = useRouter();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 100 });
  const { data: brandsData } = useGetAllBrandsQuery({ limit: 100 });
  const { data: user } = useGetMeQuery(undefined);
  const role = user?.data?.role;

  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      status: ProductStatus.ACTIVE,
    },
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const images = watch("images");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limit to 10 images total
    if (files.length + previews.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Add new files to existing ones
    const currentImages = images || [];
    const updatedImages = [...currentImages, ...files];
    setValue("images", updatedImages);

    // Create previews for new files
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...urls]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...(images || [])];
    updated.splice(index, 1);

    const updatedPreview = [...previews];
    updatedPreview.splice(index, 1);

    setValue("images", updated);
    setPreviews(updatedPreview);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setUploadingImages(true);
      setUploadProgress(0);

      // Upload images to Cloudinary
      const imageUrls = await uploadMultipleToCloudinary(data.images);
      setUploadProgress(50);

      const formData = new FormData();

      const payloadData: any = {
        title: data.title,
        brand: data.brand,
        category: data.category,
        price: data.price,
        availableStock: data.availableStock,
        discountPrice: data.discountPrice,
        status: data.status,
        description: data.description,
        images: imageUrls,
      };

      if (role !== "MANAGER") {
        payloadData.buyingPrice = data.buyingPrice;
      }

      formData.append("data", JSON.stringify(payloadData));

      setUploadProgress(80);

      const res = await createProduct(formData).unwrap();

      if (res?.success) {
        setUploadProgress(100);
        toast.success("Product created successfully!");
        router.push("/staff/dashboard/admin/product-management");
      }
    } catch (err: any) {
      console.error("Create product error:", err);
      toast.error(err?.data?.message || "Failed to create product");
      setUploadingImages(false);
      setUploadProgress(0);
    }
  };

  return (
    <div>
      <div className={"p-6"}>
        <div className={"mb-6"}>
          <BreadCrumbPage
            BreadcrumbTitle={"Product Management"}
            BreadCrumbLink={"/staff/dashboard/admin/product-management"}
            BreadCrumbPage={"Create Product"}
          />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Create Product</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* TITLE */}
              <div className="space-y-2">
                <Label>Product Title</Label>
                <Input {...register("title")} />
                <p className="text-red-500 text-xs">{errors.title?.message}</p>
              </div>

              {/* BRAND + CATEGORY */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Controller
                    control={control}
                    name="brand"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent position={"popper"} align={"start"}>
                          {brands.map((b: IBrand) => (
                            <SelectItem key={b._id} value={b._id}>
                              {b.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.brand?.message}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent position={"popper"} align={"end"}>
                          {categories.map((c: ICategory) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.category?.message}
                  </p>
                </div>
              </div>

              {/* PRICE */}
              <div className="grid md:grid-cols-4 gap-4">
                {role !== "MANAGER" && (
                  <div className="space-y-2">
                    <Label>Buying Price</Label>
                    <Input
                      type="number"
                      onWheel={(e) => e.preventDefault()}
                      {...register("buyingPrice")}
                    />
                    <p className="text-red-500 text-xs">
                      {errors.buyingPrice?.message}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Sell Price</Label>
                  <Input
                    type="number"
                    onWheel={(e) => e.preventDefault()}
                    {...register("price")}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.price?.message}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Sell Discount Price</Label>
                  <Input type="number" {...register("discountPrice")} />
                </div>

                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    onWheel={(e) => e.preventDefault()}
                    {...register("availableStock")}
                  />
                  <p className="text-red-500 text-xs">
                    {errors.availableStock?.message}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <ProductEditor
                      content={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
                <p className="text-red-500 text-xs">
                  {errors.description?.message}
                </p>
              </div>

              {/* IMAGE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Product Images Gallery</Label>
                  <span className="text-xs text-muted-foreground">
                    {previews.length}/10 images
                  </span>
                </div>

                <label className="border-2 border-dashed border-amber-200/50 dark:border-amber-900/50 rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-amber-500/80 dark:hover:border-amber-500/60 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all duration-300 active:scale-95">
                  <div className="relative mb-3">
                    <Upload className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Drop images or click to upload
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WebP up to 10MB each
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={uploadingImages}
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {/* Upload Progress */}
                {uploadingImages && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                      <span className="text-sm text-muted-foreground">
                        Uploading to Cloudinary... {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-amber-500 to-amber-600 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Image Preview Grid */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {previews.map((src, index) => (
                      <div
                        key={index}
                        className="group relative w-full aspect-square rounded-lg overflow-hidden border border-amber-200/30 dark:border-amber-900/30 hover:border-amber-400/60 dark:hover:border-amber-600/60 transition-all duration-200"
                      >
                        <Image
                          src={src}
                          alt={`preview-${index}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            disabled={uploadingImages}
                            onClick={() => handleRemoveImage(index)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* Index badge */}
                        <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errors.images && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.images?.message}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <Button
                className="hover:cursor-pointer w-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading || uploadingImages}
              >
                {uploadingImages ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading Images...
                  </>
                ) : isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
