import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {loadWish, saveWish} from "@/redux/selectors/wishSelectors";
import {IWish} from "@/types/wish.types";
import {toast} from "sonner";

interface WishState {
    items: IWish[];
}

const initialState: WishState = {
    items: loadWish(),
};

const wishSlice = createSlice({
    name: "wish",
    initialState,
    reducers: {
        addToWish: (state, action: PayloadAction<Omit<IWish, "quantity">>) => {
            const item = action.payload;
            const existingItem = state.items.find(i => i._id === item._id);

            if (existingItem) {
                toast.warning("Wishlist Already exists!");
            }
            else {
                state.items.push(item as IWish);
            }
            saveWish(state.items);
        },

        removeFromWish: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item._id !== action.payload);
            saveWish(state.items);
        },

        clearWish: (state) => {
            state.items = [];
            saveWish([]);
        },
    },
});

export const {
    addToWish,
    removeFromWish,
    clearWish,
} = wishSlice.actions;

export default wishSlice.reducer;