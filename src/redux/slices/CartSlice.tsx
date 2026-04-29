import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cart.types";
import {loadCart, saveCart} from "@/redux/selectors/cartSelectors";

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: loadCart(),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
        //     const item = action.payload;
        //     const existingItem = state.items.find(i => i._id === item._id);
        //
        //     if (existingItem) {
        //         existingItem.quantity += 1;
        //     } else {
        //         state.items.push({
        //             ...item,
        //             quantity: 1,
        //         });
        //     }
        //     saveCart(state.items);
        // },
        addToCart: (state, action) => {
            const item = state.items.find(
                (i) => i._id === action.payload._id
            );

            if (item) {
                item.quantity += action.payload.quantity;
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: action.payload.quantity,
                });
            }
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item._id !== action.payload);
            saveCart(state.items);
        },

        increaseQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i._id === action.payload);
            if (item) {
                item.quantity += 1;
                saveCart(state.items);
            }
        },

        decreaseQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i._id === action.payload);

            if (!item) return;

            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.items = state.items.filter(i => i._id !== action.payload);
            }

            saveCart(state.items);
        },

        clearCart: (state) => {
            state.items = [];
            saveCart([]);
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;