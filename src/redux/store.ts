import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './features/baseApi'
import { ordersReducer } from './features/orders/ordersSlice'
import cartReducer from "@/redux/slices/CartSlice";
import CouponReducer from "@/redux/slices/CouponSlice";
import wishReducer from "@/redux/slices/wishSlice";
import viewModeReducer from "@/redux/slices/viewModeSlice";


export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        orders: ordersReducer,
        viewMode: viewModeReducer,
        cart : cartReducer,
        coupon: CouponReducer,
        wish : wishReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch