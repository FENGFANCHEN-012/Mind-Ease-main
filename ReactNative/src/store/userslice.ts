import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MindState } from "./mindslice";

export interface UserInfo {
  userName: string;
  age: number | null;
  sex: string;
  slogan: string | null;
  profilePicture: string | null;
  email: string | null;
  phone_number: string | null;
  role: string | null;
}

const initialState: UserInfo = {
  userName: "User",
  age: null,
  sex: "Not specified",
    slogan: null,
    profilePicture: null,
    email: null,
    phone_number: null,
    role: null,

};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfo>) {
      Object.assign(state, action.payload);
    },
    
    clearUserInfo(state) {
      Object.assign(state, initialState);
    },

  },
});

export const { setUserInfo, clearUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;

