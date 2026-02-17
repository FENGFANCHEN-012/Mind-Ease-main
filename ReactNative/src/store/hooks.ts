import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

/**
 * Typed version of useDispatch
 * Ensures all dispatched actions are type-safe
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of useSelector
 * Ensures state selection follows RootState structure
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
