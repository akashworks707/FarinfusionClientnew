/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { IProductBlog } from "@/types/productBlog";
import { blogFormSchema, BlogFormValues } from "@/utils/blogSchemas";
import { BLOG_CATEGORIES, BLOG_CONTENT_TYPES } from "@/types/productBlog";
import { categoryLabel, parseTags, tagsToString } from "@/utils/blogHelpers";
import { ImageUploadField } from "./ImageUploadField";
import {
  useCreateProductBlogMutation,
  useUpdateProductBlogMutation,
} from "@/redux/features/productBlog/productBlog.api";

interface Props {
  isOpen: boolean;
  editBlog: IProductBlog | null;
  onClose: () => void;
}

const inputCls = (err?: boolean) =>
  `w-full h-10 px-3 rounded-xl border ${
    err
      ? "border-red-400 dark:border-red-600 focus:ring-red-500/30"
      : "border-gray-200 dark:border-gray-700 focus:ring-amber-500/30 focus:border-amber-500"
  } bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200
  placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all`;

const textareaCls = (err?: boolean) =>
  `w-full px-3 py-2.5 rounded-xl border ${
    err
      ? "border-red-400 dark:border-red-600"
      : "border-gray-200 dark:border-gray-700 focus:border-amber-500"
  } bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200
  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none`;

const selectCls =
  "w-full h-10 pl-3 pr-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all appearance-none cursor-pointer";

const labelCls =
  "block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

export function BlogFormModal({ isOpen, editBlog, onClose }: Props) {
  const isEditing = !!editBlog;
  const [createBlog, { isLoading: isCreating }] = useCreateProductBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateProductBlogMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema as any),
    defaultValues: {
      status: "PUBLISHED",
      featured: false,
      contentType: "ARTICLE",
    },
  });

  const thumbnail = watch("thumbnail");
  const banner = watch("banner");

  // Populate form when editing
  useEffect(() => {
    if (editBlog) {
      reset({
        title: editBlog.title,
        shortDescription: editBlog.shortDescription,
        content: editBlog.content || "",
        category: editBlog.category,
        contentType: editBlog.contentType,
        thumbnail: editBlog.thumbnail || "",
        banner: editBlog.banner || "",
        tags: tagsToString(editBlog.tags || []),
        featured: editBlog.featured,
        status: editBlog.status,
      });
    } else {
      reset({
        title: "",
        shortDescription: "",
        content: "",
        category: "",
        contentType: "ARTICLE",
        thumbnail: "",
        banner: "",
        tags: "",
        featured: false,
        status: "PUBLISHED",
      });
    }
  }, [editBlog, reset, isOpen]);

  const onSubmit = async (values: BlogFormValues) => {
    const payload = {
      title: values.title,
      shortDescription: values.shortDescription,
      content: values.content,
      category: values.category,
      contentType: values.contentType,
      thumbnail: values.thumbnail || undefined,
      banner: values.banner || undefined,
      tags: values.tags ? parseTags(values.tags) : [],
      featured: values.featured ?? false,
      status: values.status ?? "PUBLISHED",
    
    };

    try {
      if (isEditing) {
        await updateBlog({ id: editBlog!._id, data: payload }).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await createBlog(payload).unwrap();
        toast.success("Blog created successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || `Failed to ${isEditing ? "update" : "create"} blog`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={!isLoading ? onClose : undefined} />

      {/* Modal */}
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl mt-8 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit Blog" : "Create Blog"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isEditing
                ? "Update blog post details below"
                : "Fill in the details to publish a new blog post"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-8 w-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-14rem)] overflow-y-auto">

            {/* Title */}
            <div>
              <label className={labelCls}>Title *</label>
              <input
                {...register("title")}
                placeholder="Enter blog title…"
                className={inputCls(!!errors.title)}
              />
              <FieldError msg={errors.title?.message} />
            </div>

            {/* Short Description */}
            <div>
              <label className={labelCls}>Short Description *</label>
              <textarea
                {...register("shortDescription")}
                rows={2}
                placeholder="Brief summary shown in listing…"
                className={textareaCls(!!errors.shortDescription)}
              />
              <FieldError msg={errors.shortDescription?.message} />
            </div>

            {/* Main Content */}
            <div>
              <label className={labelCls}>Content *</label>
              <textarea
                {...register("content")}
                rows={5}
                placeholder="Full blog content…"
                className={textareaCls(!!errors.content)}
              />
              <FieldError msg={errors.content?.message} />
            </div>

            {/* Category + Content Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className={labelCls}>Category *</label>
                <select {...register("category")} className={selectCls}>
                  <option value="">Select category…</option>
                  {BLOG_CATEGORIES.map((c: any) => (
                    <option key={c} value={c}>{categoryLabel(c)}</option>
                  ))}
                </select>
                <FieldError msg={errors.category?.message} />
              </div>
              <div className="relative">
                <label className={labelCls}>Content Type *</label>
                <select {...register("contentType")} className={selectCls}>
                  {BLOG_CONTENT_TYPES.map((t: any) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <FieldError msg={errors.contentType?.message} />
              </div>
            </div>

           
            {/* Thumbnail + Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ImageUploadField
                label="Thumbnail"
                hint="400×300"
                value={thumbnail}
                onChange={(url) => setValue("thumbnail", url, { shouldValidate: true })}
                onClear={() => setValue("thumbnail", "")}
                aspectRatio="thumbnail"
              />
              <ImageUploadField
                label="Banner"
                hint="1200×400"
                value={banner}
                onChange={(url) => setValue("banner", url, { shouldValidate: true })}
                onClear={() => setValue("banner", "")}
                aspectRatio="banner"
              />
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls}>Tags</label>
              <input
                {...register("tags")}
                placeholder="skincare, review, tutorial (comma separated)"
                className={inputCls()}
              />
              <p className="mt-1 text-xs text-gray-400">Separate tags with commas</p>
            </div>

            {/* Status + Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className={labelCls}>Status</label>
                <select {...register("status")} className={selectCls}>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>

              <div className="flex items-end pb-0.5">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register("featured")}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-amber-500 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark as Featured
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="h-10 px-5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-70 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditing ? "Saving…" : "Creating…"}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? "Save Changes" : "Publish Blog"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}