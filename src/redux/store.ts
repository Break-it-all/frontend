import { configureStore } from "@reduxjs/toolkit";
import { bpmSlice } from "./feature";
import userSlice from "./modules/user";

export const store = configureStore({
  reducer: { bpm: bpmSlice.reducer, userSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
