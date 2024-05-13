import Direction from "@/plan-creator/enums/direction.enum";
import gray from "@/plan-creator/styles/gray";
import IBlock from "@/plan-creator/types/block.interface";
import { planSettingsState } from "@/redux/store";
import { FC, HTMLAttributes, memo } from "react";
import { useSelector } from "react-redux";

export interface ILineHighlighterProps extends HTMLAttributes<HTMLDivElement> {
  block: IBlock;
  direction?: Direction;
}

const LineHighlighter: FC<ILineHighlighterProps> = memo(
  ({ direction, block, style, ...props }) => {
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
          border: `0.5px dashed ${gray[400]}`,
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
