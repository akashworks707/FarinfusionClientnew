
export interface CartItem {
    _id: string;
    discountPrice?: number;
    slug: string;
    title: string;
    price: number;
    availableStock: number;
    quantity: number;
    images: string[];
}