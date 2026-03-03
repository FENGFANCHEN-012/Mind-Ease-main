import { configureStore } from "@reduxjs/toolkit";
import mindReducer from "./mindslice";
import userInfoReducer from "./userslice";
import authReducer from "./authslice";

export const store = configureStore({
  reducer: {
    mind: mindReducer, 
    userInfo: userInfoReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
