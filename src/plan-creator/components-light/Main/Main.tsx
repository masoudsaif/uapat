import { useTheme } from "@mui/material";
import { FC, HTMLAttributes, memo } from "react";

export interface IMainProps extends HTMLAttributes<HTMLDivElement> {}

const Main: FC<IMainProps> = memo(({ style, ...props }) => {
  const theme = useTheme();

  return (
    <main
      {...props}
      style={{
        ...style,
        flexGrow: 1,
        minHeight: "100vh",
        padding: theme.spacing(4),
        paddingTop: theme.spacing(12),
      }}
    />
  );
});

export default Main;
