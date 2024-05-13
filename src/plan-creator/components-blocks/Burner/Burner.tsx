import common from "@/plan-creator/styles/common-colors";
import { FC, HTMLAttributes, memo } from "react";

export interface IBurnerProps extends HTMLAttributes<HTMLDivElement> {
  length: number;
}

const Burner: FC<IBurnerProps> = memo(({ length, style, ...props }) => (
  <div
    {...props}
    style={{
      ...style,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: length,
      height: length,
      borderRadius: "50%",
      border: `1px solid ${common.black}`,
    }}
  >
    <div
      style={{
        width: 5,
        height: 5,
        border: `1px solid ${common.black}`,
        borderRadius: "50%",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: "49%",
        height: "112%",
        width: 0,
        border: `0.5px solid ${common.black}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: "49%",
        width: "112%",
        height: 0,
        border: `0.5px solid ${common.black}`,
      }}
    />
  </div>
));

export default Burner;
