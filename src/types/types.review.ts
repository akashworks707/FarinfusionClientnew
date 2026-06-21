
export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ReviewSource {
  FACEBOOK = "FACEBOOK",
  WEBSITE = "WEBSITE",
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  images?: string[];
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
}

export interface IReview {
  _id: string;
  product: IProduct;
  order?: string;

  customerName: string;
  rating: number;
  reviewText: string;

  reviewImage?: string;

  reviewSource: "FACEBOOK" | "WEBSITE";

  status: ReviewStatus;

  createdBy?: IUser;

  isDeleted?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface IReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
  averageRating: number;
}

export type ReviewFormData = {
  product: string;
  customerName: string;
  rating: number;
  reviewText: string;
  reviewSource: ReviewSource;
  status: ReviewStatus;
  reviewImage?: File;
};
