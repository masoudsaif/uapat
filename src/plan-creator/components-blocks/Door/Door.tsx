import { FC, HTMLAttributes, memo } from "react";

import common from "../styles/common-colors";

export interface IDoorProps extends HTMLAttributes<HTMLDivElement> {}

const Door: FC<IDoorProps> = memo(({ style, ...props }) => (
  <div
    style={{
      border: `1px solid ${common.black}`,
      height: "100%",
      width: "100%",
      borderTopRightRadius: "100%",
      borderBottomColor: "transparent",
      ...style,
    }}
    {...props}
  >
    <div
      style={{
        height: "100%",
        width: 5,
        border: `1px solid ${common.black}`,
        borderLeftColor: "transparent",
        borderTopColor: "transparent",
      }}
    />
  </div>
));

export default Door;
