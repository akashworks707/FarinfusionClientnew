import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OrderStatus } from '@/types/orders';

interface FilterState {
  status: OrderStatus | '';
  search: string;
  page: number;
  limit: number;
}

interface OrdersState {
  filters: FilterState;
  selectedOrderId: string | null;
  confirmingOrderId: string | null;
}

const initialState: OrdersState = {
  filters: {
    status: '',
    search: '',
    page: 1,
    limit: 10,
  },
  selectedOrderId: null,
  confirmingOrderId: null,
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<OrderStatus | ''>) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload;
    },
    setSelectedOrder: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderId = action.payload;
    },
    setConfirmingOrder: (state, action: PayloadAction<string | null>) => {
      state.confirmingOrderId = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setStatusFilter,
  setSearchFilter,
  setPage,
  setLimit,
  setSelectedOrder,
  setConfirmingOrder,
  resetFilters,
} = ordersSlice.actions;

export default ordersSlice.reducer;

export const ordersReducer = ordersSlice.reducer;
