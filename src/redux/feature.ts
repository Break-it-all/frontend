import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bpm: 60,
};

export const bpmSlice = createSlice({
  name: "bpm",
  initialState,
  reducers: {
    changeBpm: (state, action) => {
      state.bpm = action.payload;
    },
  },
});

export const { changeBpm } = bpmSlice.actions;
