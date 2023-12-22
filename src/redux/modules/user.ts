import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type UserState = {
  email: string;
  name: string;
};

const initialState: UserState = {
  email: "",
  name: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (_, action: PayloadAction<UserState>) => {
      return action.payload;
    },

    logout: (_) => {
      return initialState;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
