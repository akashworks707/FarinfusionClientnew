import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";

// Core Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T,>(selector: (state: RootState) => T): T =>
  useSelector<RootState, T>(selector);

// Export all API hooks
export * from "../redux/features/orders/ordersApi";
export * from "../redux/features/courier/couriers.api";
