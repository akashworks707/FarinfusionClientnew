export const BLOG_STATUSES = ["PUBLISHED", "DRAFT"] as const;

export const BLOG_CONTENT_TYPES = ["ARTICLE", "VIDEO"] as const;

export const BLOG_CATEGORIES = [
  "SKINCARE",
  "HAIRCARE",
  "BABY_CARE",
  "BEAUTY",
  "COSMETICS",
  "HEALTH",
  "LIFESTYLE",
  "TUTORIAL",
] as const;

export interface IProductBlog {
  _id: string;

  title: string;
  slug: string;

  shortDescription: string;
  content: string;

  thumbnail?: string;
  banner?: string;

  category: string;
  contentType: "ARTICLE" | "VIDEO";

  tags: string[];

  featured: boolean;

  status: "PUBLISHED" | "DRAFT";

  views: number;

  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface ProductBlogQueryParams {
  page?: number;
  limit?: number;

  searchTerm?: string;

  status?: string;

  category?: string;

  contentType?: string;

  featured?: boolean;
}
