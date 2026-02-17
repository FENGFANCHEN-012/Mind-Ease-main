import { configureStore } from "@reduxjs/toolkit";
import mindReducer from "./mindslice";

export const store = configureStore({
  reducer: {
    mind: mindReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
