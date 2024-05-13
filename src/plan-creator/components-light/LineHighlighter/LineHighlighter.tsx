import { planSettingsState } from "@/redux/store";
import { useTheme } from "@mui/material";
import { FC, HTMLAttributes, memo } from "react";
import { useSelector } from "react-redux";

import Direction from "../enums/direction.enum";
import IBlock from "../types/block.interface";

export interface ILineHighlighterProps extends HTMLAttributes<HTMLDivElement> {
  block: IBlock;
  direction?: Direction;
}

const LineHighlighter: FC<ILineHighlighterProps> = memo(
  ({ direction, block, style, ...props }) => {
    const theme = useTheme();
    const {
      pixelRatio,
      planDimensions: { width, length },
    } = useSelector(planSettingsState);

    return (
      <div
        {...props}
        style={{
          ...style,
          position: "absolute",
          border: `0.5px dashed ${theme.palette.grey[400]}`,
          ...(direction === Direction.TOP && {
            width: length * pixelRatio,
            top: block.coordinates!.y,
          }),
          ...(direction === Direction.BOTTOM && {
            width: length * pixelRatio,
            top: block.coordinates!.y + block.dimensions!.width * pixelRatio,
          }),
          ...(direction === Direction.RIGHT && {
            width: 0,
            height: width * pixelRatio,
            left: block.coordinates!.x + block.dimensions.length * pixelRatio,
          }),
          ...(direction === Direction.LEFT && {
            width: 0,
            height: width * pixelRatio,
            left: block.coordinates!.x,
          }),
        }}
      />
    );
  }
);

export default LineHighlighter;
