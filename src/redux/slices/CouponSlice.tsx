import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CouponType = "percent" | "fixed";

export interface Coupon {
    code: string;
    type: CouponType;
    value: number;
}

interface CouponState {
    applied: Coupon | null;
}

const initialState: CouponState = {
    applied: null,
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        // 🟢 Apply coupon
        applyCoupon: (state, action: PayloadAction<Coupon>) => {
            state.applied = action.payload;
        },

        // 🔴 Remove coupon
        removeCoupon: (state) => {
            state.applied = null;
        },

        // 🟡 Optional: clear on logout / cart clear
        clearCoupon: (state) => {
            state.applied = null;
        },
    },
});

export const {
    applyCoupon,
    removeCoupon,
    clearCoupon,
} = couponSlice.actions;

export default couponSlice.reducer;