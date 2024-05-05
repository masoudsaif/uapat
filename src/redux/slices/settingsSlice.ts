"use client";
import SystemUnit from "@/plan-creator/enums/system-unit.enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISettings {
  isDrawerOpen: boolean;
  wallWidth: number;
  pixelRatio: number;
  systemUnit: SystemUnit;
}

type SettingBoolean = keyof typeof booleans;

const booleans = {
  isDrawerOpen: false,
};

const initialState: ISettings = {
  ...booleans,
  wallWidth: 2,
  pixelRatio: 3.9,
  systemUnit: SystemUnit.Metric,
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
    setSystemUnit(state, { payload }: PayloadAction<SystemUnit>) {
      state.systemUnit = payload;
    },
    setPixelRatio(state, { payload }: PayloadAction<number>) {
      state.pixelRatio = payload;
    },
    setWallWidth(state, { payload }: PayloadAction<number>) {
      state.wallWidth = payload;
    },
  },
});

export const { turnOn, turnOff, setSystemUnit, setPixelRatio, setWallWidth } =
  settingsSlice.actions;

export default settingsSlice.reducer;

// Pixel ratio is comparted to inches
// 3.9 = 1inch
// 3.9 * 12 = 1ft
// 3.9 * 12 / 3.281 = 1meter
// 3.9 * 12 / 3.281 / 100 = 1cm
// 3.9 * 12 / 3.281 / 1000 = 1mm
