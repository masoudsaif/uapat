"use client";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

import reducer from "@/redux/slices/reducer";

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;

export const settingsState = (state: RootState) => state.settings;

export const persistor = persistStore(store);

export default store;
