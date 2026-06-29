"use client";

import { useState } from "react";
import { Link2, Twitter, Facebook, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `/blog/${slug}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const btnCls =
    "flex items-center gap-2 h-9 px-4 rounded-xl border text-sm font-medium transition-all duration-150";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mr-1">
        Share
      </span>

      {/* Copy link */}
      <button
        onClick={copy}
        className={`${btnCls} border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600 bg-white dark:bg-gray-900`}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy link"}
      </button>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnCls} border-sky-200 dark:border-sky-900 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 bg-white dark:bg-gray-900`}
      >
        <Twitter className="h-3.5 w-3.5" />
        Twitter
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnCls} border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white dark:bg-gray-900`}
      >
        <Facebook className="h-3.5 w-3.5" />
        Facebook
      </a>
    </div>
  );
}