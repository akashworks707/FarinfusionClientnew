import { IProduct } from ".";

export type VerificationContentType = "VIDEO" | "ARTICLE" | "PDF" | "IMAGE" | "EXTERNAL_LINK";
export type VerificationStatus = "PUBLISHED" | "DRAFT";
export type VerificationCategory = "COSMETICS" | "SKIN_CARE" | "HEALTH" | "PERFUME" | "OTHERS";

export interface IUser {
  _id: string;
  name: string;
  email: string;
}

export interface IProductVerification {
  _id: string;
  title: string;
  product: IProduct;
  slug?: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  mediaUrl: string;
  mediaType: VerificationContentType;
  category: VerificationCategory;
  tags: string[];
  featured: boolean;
  status: VerificationStatus;
  views: number;
  createdBy: IUser;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface IProductVerificationFormData {
  title: string;
  slug?: string;
  shortDescription: string;
  description?: string;
  thumbnail?: string;
  mediaUrl: string;
  mediaType: VerificationContentType;
  category: VerificationCategory;
  tags?: string[];
  featured?: boolean;
  status?: VerificationStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  searchTerm?: string;
  status?: VerificationStatus;
  mediaType?: VerificationContentType;
  featured?: boolean;
}