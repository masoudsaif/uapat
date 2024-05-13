"use client";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import settingsReducer from "./settingsSlice";
import editorSettingsReducer from "./editorSettingsSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["editorSettings"],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  editorSettings: editorSettingsReducer,
});

export default persistReducer(persistConfig, rootReducer);
