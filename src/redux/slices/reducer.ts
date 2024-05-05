"use client";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import settingsReducer from "./settingsSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
});

export default persistReducer(persistConfig, rootReducer);
