"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";

interface Props {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  onClear: () => void;
  hint?: string;
  aspectRatio?: "thumbnail" | "banner";
}

export function ImageUploadField({
  label,
  value,
  onChange,
  onClear,
  hint,
  aspectRatio = "thumbnail",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
      toast.success(`${label} uploaded successfully`);
    } catch {
      toast.error(`Failed to upload ${label.toLowerCase()}`);
    } finally {
      setUploading(false);
    }
  };

  const height = aspectRatio === "banner" ? "h-28" : "h-24";

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
        {hint && <span className="ml-1.5 text-gray-400 normal-case font-normal">({hint})</span>}
      </label>

      {value ? (
        <div className={`relative ${height} rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group`}>
          <Image src={value} alt={label} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/90 text-xs font-medium text-gray-800 hover:bg-white transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`
            w-full ${height} rounded-xl border-2 border-dashed
            border-gray-200 dark:border-gray-700
            hover:border-amber-400 dark:hover:border-amber-600
            bg-gray-50 dark:bg-gray-800/50
            flex flex-col items-center justify-center gap-2
            text-gray-400 hover:text-amber-500 transition-all
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              <span className="text-xs">Uploading…</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4" />
                <Upload className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs">Click to upload {label.toLowerCase()}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}