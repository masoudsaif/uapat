"use client";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import settingsReducer from "./settingsSlice";
import planSettingsReducer from "./planSettingsSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["planSettings"],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  planSettings: planSettingsReducer,
});

export default persistReducer(persistConfig, rootReducer);
