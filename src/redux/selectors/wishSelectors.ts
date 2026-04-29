import {IWish} from "@/types/wish.types";


export const loadWish = (): IWish[] => {
    try {
        const data = localStorage.getItem("wishlist");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const saveWish = (wishlist: IWish[]) => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
};