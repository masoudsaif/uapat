import SystemUnit from "@/plan-creator/enums/system-unit.enum";
import common from "@/plan-creator/styles/common-colors";
import IBlock from "@/plan-creator/types/block.interface";
import {
  imperialDisplayLength,
  metricDisplayLength,
} from "@/plan-creator/utility/units";
import { editorSettingsState } from "@/redux/store";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Grid, GridProps, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";

export interface IArrowProps extends GridProps {
  block: IBlock;
}

const Arrow: FC<IArrowProps> = ({
  block: { dimensions, degree },
  display = "flex",
  position = "relative",
  width = "fit-content",
  alignItems = "center",
  color = common.black,
  ...props
}) => {
  const { pixelRatio, systemUnit } = useSelector(editorSettingsState);
  const isVertical = useMemo(() => degree === 90 || degree === 270, [degree]);
  const length = useMemo(
    () => (isVertical ? dimensions.width : dimensions.length),
    [isVertical, dimensions]
  );
  const l = useMemo(
    () => length * pixelRatio,

    [length, pixelRatio]
  );
  const displayLength = useMemo(
    () =>
      (systemUnit === SystemUnit.IMPERIAL
        ? imperialDisplayLength
        : metricDisplayLength)(length),
    [length, systemUnit]
  );

  return (
    <Grid
      item
      display={display}
      position={position}
      alignItems={alignItems}
      width={width}
      {...props}
    >
      <ArrowBackIosNewIcon
        sx={{
          position: "absolute",
          color,
          fontSize: "10px",
          left: -3,
        }}
      />
      <div
        style={{
          width: l,
          height: 0,
          border: `0.5px solid ${color}`,
        }}
      />
      <ArrowForwardIosIcon
        sx={{
          position: "absolute",
          color,
          fontSize: "10px",
          left: l - 7,
        }}
      />
      <Typography
        sx={{
          position: "absolute",
          bottom: -16,
          left: l / 2 - 15,
          p: 0.5,
          backgroundColor: common.white,
          userSelect: "none",
          ...(degree === 90 && { rotate: "270deg" }),
          ...(degree === 180 && { rotate: "180deg" }),
          ...(degree === 270 && { rotate: "90deg" }),
          ...(isVertical && { bottom: -18 }),
        }}
      >
        {displayLength}
      </Typography>
    </Grid>
  );
};

export default Arrow;
