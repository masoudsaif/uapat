"use client";
import SystemUnit from "@/plan-creator/enums/system-unit.enum";
import IDimensions from "@/plan-creator/types/dimensions.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IPlanSettings {
  wallWidth: number;
  interiorWallWidth: number;
  pixelRatio: number;
  planDimensions: IDimensions;
  systemUnit: SystemUnit;
}

const initialState: IPlanSettings = {
  wallWidth: 6,
  interiorWallWidth: 4,
  pixelRatio: 2,
  planDimensions: {
    width: 288,
    length: 432,
  },
  systemUnit: SystemUnit.IMPERIAL,
};

const planSettingsSlice = createSlice({
  name: "plan-settings",
  initialState,
  reducers: {
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

export const { setSystemUnit, setPixelRatio, setWallWidth } =
  planSettingsSlice.actions;

export default planSettingsSlice.reducer;

// Pixel ratio is comparted to inches
// 2 = 1inch
// 24 = 1ft
// 24 / 3.281 = 1meter
// 24 / 3.281 / 100 = 1cm
// 24 / 3.281 / 1000 = 1mm
// wallWidth = 4inches = 8 px
