import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  id: string;
  name: string;
  age: number | null;
  sex: string;
  slogan: string | null;
  profilePicture: string | null;
  email: string | null;
  phone_number: string | null;
  role: string | null;
}


const initialState: UserInfo = {
  id: "",
  name: "User",
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
    
    setGender(state, action: PayloadAction<string>) {
      state.sex = action.payload;
    },

    setAge(state, action: PayloadAction<number | null>) {
      state.age = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    clearUserInfo(state) {
      Object.assign(state, initialState);
    },

  },
});

export const { setUserInfo, clearUserInfo, setGender, setAge, setUserName } = userInfoSlice.actions;
export default userInfoSlice.reducer;

