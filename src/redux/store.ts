import { configureStore } from "@reduxjs/toolkit";
import { bpmSlice } from "./feature";

export const store = configureStore({
  reducer: { bpm: bpmSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
