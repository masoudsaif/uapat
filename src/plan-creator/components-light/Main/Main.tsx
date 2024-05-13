import spacing from "@/plan-creator/styles/spacing";
import { FC, HTMLAttributes, memo } from "react";

export interface IMainProps extends HTMLAttributes<HTMLDivElement> {}

const Main: FC<IMainProps> = memo(({ style, ...props }) => (
  <main
    {...props}
    style={{
      ...style,
      flexGrow: 1,
      minHeight: "100vh",
      padding: spacing(4),
      paddingTop: spacing(12),
    }}
  />
));

export default Main;
