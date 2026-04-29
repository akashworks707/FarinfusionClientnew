import { RootState } from "../store";
import {CartItem} from "@/types/cart.types";


export const loadCart = (): CartItem[] => {
    try {
        const data = localStorage.getItem("cart");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const saveCart = (cart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// 🟡 Subtotal
export const selectSubtotal = (state: RootState) =>
    state.cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

// 🟡 Discount (safe + capped)
export const selectDiscount = (state: RootState) => {
    const subtotal = selectSubtotal(state);
    const coupon = state.coupon.applied;

    if (!coupon) return 0;

    let discount = 0;

    if (coupon.type === "percent") {
        discount = (subtotal * coupon.value) / 100;
    }

    if (coupon.type === "fixed") {
        discount = coupon.value;
    }

    // ✅ Prevent over-discount
    return Math.min(discount, subtotal);
};

// 🟡 Final Total (NO SHIPPING)
export const selectFinalTotal = (state: RootState) => {
    const subtotal = selectSubtotal(state);
    const discount = selectDiscount(state);

    const total = subtotal - discount;

    return total < 0 ? 0 : total;
};