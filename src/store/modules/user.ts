import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "hyejin",
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeNickname: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { changeNickname } = userSlice.actions; // 액션 생성 함수
export default userSlice.reducer; // 리듀성
