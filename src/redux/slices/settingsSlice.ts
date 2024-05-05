"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISettings {
  isBlockDrawerOpen: boolean;
}

type SettingBoolean = keyof typeof booleans;

const booleans = {
  isBlockDrawerOpen: false,
};

const initialState: ISettings = {
  ...booleans,
};

const settingsSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    turnOn(state, { payload }: PayloadAction<SettingBoolean>) {
      state[payload] = true;
    },
    turnOff(state, { payload }: PayloadAction<SettingBoolean>) {
      state[payload] = false;
    },
  },
});

export const { turnOn, turnOff } = settingsSlice.actions;

export default settingsSlice.reducer;
