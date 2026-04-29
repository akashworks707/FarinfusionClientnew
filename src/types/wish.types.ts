import {ProductStatus} from "@/types/index";


export interface IWish {
    _id?: string;

    // Basic Info
    title: string;
    brand: {
        _id: string;
        title: string;
        slug: string;
    };
    category: {
        _id: string;
        title: string;
        slug: string;
        image: string[];
    };
    size?: string;
    slug?: string;

    quantity: number;

    // Pricing
    price: number;
    discountPrice?: number;
    buyingPrice?: number;

    // Stock / Availability
    totalAddedStock?: number;
    totalSold?: number;
    availableStock?: number;
    status: ProductStatus;
    isDeleted?: boolean;
    // Media
    images: string[];

    // Ratings & Reviews
    ratings?: number;
    reviews?: {
        user: string;
        rating: number;
        comment: string;
        date: Date;
    }[];

    // Description
    description: string;

    // Optional meta
    createdAt?: Date;
    updatedAt?: Date;
}