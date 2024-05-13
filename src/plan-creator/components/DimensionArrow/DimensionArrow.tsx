import SystemUnit from "@/plan-creator/enums/system-unit.enum";
import {
  imperialDisplayLength,
  metricDisplayLength,
} from "@/plan-creator/utility/units";
import { planSettingsState } from "@/redux/store";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Fade, Grid, GridProps, IconButton, Typography } from "@mui/material";
import { common } from "@mui/material/colors";
import { FC, Fragment, useMemo } from "react";
import { useSelector } from "react-redux";

export interface IDimensionArrowProps extends GridProps {
  length: number;
  isInverted?: boolean;
  isVisible?: boolean;
  height?: number;
  color?: string;
  isSelected?: boolean;
  isVertical?: boolean;
  onSwapClick?: () => void;
  onVisibilityClick?: () => void;
}

const DimensionArrow: FC<IDimensionArrowProps> = ({
  length,
  isSelected,
  isVertical,
  isInverted,
  isVisible,
  color = common.black,
  display = "flex",
  position = "relative",
  width = "fit-content",
  alignItems = isVertical ? "flex-start" : "center",
  onSwapClick,
  onVisibilityClick,
  ...props
}) => {
  const { pixelRatio, systemUnit } = useSelector(planSettingsState);
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
    <Fragment>
      <Fade in={isVisible}>
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
              left: -5,
              ...(isVertical && {
                left: -4.5,
                top: -4,
                rotate: "90deg",
              }),
            }}
          />
          <div
            style={{
              width: l,
              height: 0,
              ...(isVertical && {
                height: l,
                width: 0,
              }),
              border: `0.5px solid ${color}`,
            }}
          />
          <ArrowForwardIosIcon
            sx={{
              position: "absolute",
              color,
              fontSize: "10px",
              left: l - 5,
              ...(isVertical && {
                top: l - 6,
                left: -4.5,
                rotate: "90deg",
              }),
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              bottom: -7,
              p: 0.5,
              backgroundColor: common.white,
              left: l / 2 - 16,
              userSelect: "none",
              ...(isInverted && {
                top: -7,
                height: 30,
              }),
              ...(isVertical && {
                top: l / 2 - 14,
                left: -14,
                height: 30,
                width: 45,
                ...(isInverted && {
                  left: -21,
                }),
              }),
            }}
          >
            {displayLength}
          </Typography>
        </Grid>
      </Fade>
      <Fade in={isSelected}>
        <Grid
          container
          sx={{
            position: "absolute",
            right: 0,
            bottom: -30,
            zIndex: 1,
            justifyContent: "flex-end",
            ...(isVertical && {
              left: 25,
              top: -3,
            }),
          }}
        >
          {onSwapClick ? (
            <IconButton
              onClick={onSwapClick}
              sx={{
                width: 25,
                height: 25,
              }}
            >
              <SwapVertIcon
                fontSize="small"
                sx={{ ...(isVertical && { rotate: "90deg" }) }}
              />
            </IconButton>
          ) : null}
          {onVisibilityClick ? (
            <IconButton
              onClick={onVisibilityClick}
              sx={{
                width: 25,
                height: 25,
              }}
            >
              {isVisible ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </IconButton>
          ) : null}
        </Grid>
      </Fade>
    </Fragment>
  );
};

export default DimensionArrow;
