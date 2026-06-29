import { IProductBlog } from "@/types/productBlog";

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

export function categoryLabel(cat: string): string {
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const tagsToString = (tags: string[] = []) => tags.join(", ");

export const parseTags = (value: string) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export const statusColor = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        dot: "bg-green-500",
      };

    case "DRAFT":
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        dot: "bg-yellow-500",
      };

    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-900",
        text: "text-gray-600 dark:text-gray-300",
        dot: "bg-gray-400",
      };
  }
};

export const contentTypeColor = (type: "ARTICLE" | "VIDEO") => {
  switch (type) {
    case "VIDEO":
      return {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
      };

    default:
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
      };
  }
};

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// category → warm accent pair (bg / text) — amber palette for FarinFusion
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  SKINCARE: {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-700 dark:text-rose-400",
  },
  HAIRCARE: {
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-700 dark:text-violet-400",
  },
  BABY_CARE: {
    bg: "bg-sky-100 dark:bg-sky-900/30",
    text: "text-sky-700 dark:text-sky-400",
  },
  BEAUTY: {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    text: "text-pink-700 dark:text-pink-400",
  },
  COSMETICS: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
    text: "text-fuchsia-700 dark:text-fuchsia-400",
  },
  HEALTH: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  LIFESTYLE: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
  },
  TUTORIAL: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
  },
};

export function categoryColors(cat: string) {
  return (
    CATEGORY_COLORS[cat] ?? {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-600 dark:text-gray-400",
    }
  );
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getRelatedBlogs(
  blogs: IProductBlog[],
  current: IProductBlog,
  limit = 3,
): IProductBlog[] {
  return blogs
    .filter(
      (b) =>
        b._id !== current._id &&
        b.category === current.category &&
        b.status === "PUBLISHED",
    )
    .slice(0, limit);
}
