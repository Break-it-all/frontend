import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { bpmSlice } from "./feature";
import userSlice from "./modules/user";

// export const store = configureStore({
//   reducer: { bpm: bpmSlice.reducer, user: userSlice.reducer },
// });

const reducers = combineReducers({
  bpm: bpmSlice.reducer,
  user: userSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  // reducer: {
  //   ...persistedReducer,
  //   bpm: bpmSlice.reducer,
  // },
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
