import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

export type UserState = {
  id: number;
  email: string;
  name: string;
};

const initialState: UserState = {
  id: -1,
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
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice;
