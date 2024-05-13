import common from "@/plan-creator/styles/common-colors";
import { FC, HTMLAttributes } from "react";

export interface ISelectionBoxProps extends HTMLAttributes<HTMLDivElement> {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const SelectionBox: FC<ISelectionBoxProps> = ({
  startX,
  startY,
  endX,
  endY,
  style,
  ...props
}) => (
  <div
    {...props}
    style={{
      ...style,
      position: "absolute",
      border: `0.5px dotted ${common.black}`,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      left: Math.min(startX, endX),
      top: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
      pointerEvents: "none",
    }}
  ></div>
);
export default SelectionBox;
